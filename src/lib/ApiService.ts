import { supabase } from './AuthService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://arcana-api-6x0i.onrender.com';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('请先登录');
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || '请求失败');
  }
  return response.json();
}

export async function getQuota(): Promise<{ remainingCalls: number }> {
  return fetchWithAuth('/api/quota');
}

export async function requestReading(params: {
  messages: Array<{ role: string; content: string }>;
  spreadType: string;
  question: string;
  drawnCards: any;
  quotaCost: number;
}): Promise<{ message: string; remainingCalls: number; readingId?: string }> {
  return fetchWithAuth('/api/reading', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function getHistory(): Promise<{ readings: any[] }> {
  return fetchWithAuth('/api/history');
}

export async function deleteReading(id: string): Promise<void> {
  return fetchWithAuth(`/api/history/${id}`, { method: 'DELETE' });
}
