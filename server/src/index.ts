import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DAILY_QUOTA = Number(process.env.DAILY_QUOTA || 10);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

// 速率限制：每 IP 每分钟 6 次
const readingRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '请求过于频繁，请稍后再试' },
});

// ==================== 认证中间件 ====================
async function authenticateUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录' });
  }
  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: '登录已过期' });
  }
  (req as any).user = user;
  next();
}

// ==================== 配额管理 ====================
async function ensureDailyQuota(userId: string, userEmail: string | undefined) {
  const today = new Date().toISOString().slice(0, 10);

  let { data: userData } = await supabase
    .from('users')
    .select('remaining_calls, last_quota_reset')
    .eq('id', userId)
    .maybeSingle();

  if (!userData) {
    const { data: newUser } = await supabase
      .from('users')
      .insert({ id: userId, email: userEmail, remaining_calls: DAILY_QUOTA, last_quota_reset: today })
      .select('remaining_calls, last_quota_reset')
      .single();
    userData = newUser;
  }

  if (userData && userData.last_quota_reset !== today) {
    const { data: updated } = await supabase
      .from('users')
      .update({ remaining_calls: DAILY_QUOTA, last_quota_reset: today })
      .eq('id', userId)
      .select('remaining_calls, last_quota_reset')
      .single();
    userData = updated;
  }

  return userData;
}

// ==================== 健康检查 ====================
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ==================== 获取配额 ====================
app.get('/api/quota', authenticateUser, async (req, res) => {
  try {
    const user = (req as any).user;
    const data = await ensureDailyQuota(user.id, user.email);
    res.json({ remainingCalls: data?.remaining_calls ?? DAILY_QUOTA });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== AI 解读 ====================
app.post('/api/reading', readingRateLimiter, authenticateUser, async (req, res) => {
  try {
    const user = (req as any).user;
    const { messages, spreadType, question, drawnCards, quotaCost } = req.body;
    const cost = Number(quotaCost) || 1;

    // 1. 检查配额
    const userData = await ensureDailyQuota(user.id, user.email);
    if (!userData || userData.remaining_calls < cost) {
      return res.status(403).json({ error: '今日调用次数已用完' });
    }

    // 2. 调用 DeepSeek API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        stream: false,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`DeepSeek API 错误: ${response.statusText}`);
    }

    const result = await response.json();
    const aiMessage = result.choices[0].message.content;

    // 3. 扣配额
    await supabase
      .from('users')
      .update({ remaining_calls: userData.remaining_calls - cost })
      .eq('id', user.id);

    // 4. 保存解读记录
    const { data: reading } = await supabase
      .from('readings')
      .insert({
        user_id: user.id,
        question,
        spread_type: spreadType,
        drawn_cards: drawnCards,
        reading: aiMessage,
      })
      .select('id')
      .single();

    // 5. 记录调用日志
    await supabase.from('call_logs').insert({
      user_id: user.id,
      call_type: 'reading',
      metadata: { spreadType, quotaCost: cost, success: true },
    });

    res.json({
      message: aiMessage,
      remainingCalls: userData.remaining_calls - cost,
      readingId: reading?.id,
    });
  } catch (error: any) {
    console.error('AI 解读失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== 历史记录 ====================
app.get('/api/history', authenticateUser, async (req, res) => {
  try {
    const user = (req as any).user;
    const { data, error } = await supabase
      .from('readings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json({ readings: data || [] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/history/:id', authenticateUser, async (req, res) => {
  try {
    const user = (req as any).user;
    const { error } = await supabase
      .from('readings')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', user.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`ARCANA server running on http://localhost:${PORT}`);
});
