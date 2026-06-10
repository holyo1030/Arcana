import { useState, useEffect } from 'react';
import { supabase, signOut, onAuthStateChange } from '../lib/AuthService';
import type { User } from '@supabase/supabase-js';

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-mystic-950/90 backdrop-blur-md p-4" onClick={onClose}>
      <div className="relative w-full max-w-xs bg-mystic-900 border border-gold-500/20 rounded-sm glow-purple" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gold-500/30 hover:text-gold-400 text-xl transition-colors">&times;</button>

        <div className="p-8 space-y-6">
          <div className="text-center">
            <div className="ornament mb-4 max-w-[60px] mx-auto">
              <span className="text-[8px]">&#10022;</span>
            </div>
            <h2 className="text-2xl font-serif text-gold-300 tracking-wider text-glow">ARCANA</h2>
            <p className="text-[10px] font-mono text-gold-500/30 uppercase tracking-[0.4em] mt-1">登录以获取 AI 解读</p>
          </div>

          {error && (
            <div className="p-2.5 border border-red-400/20 bg-red-400/5 text-red-400/70 text-xs text-center rounded-sm">{error}</div>
          )}

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gold-500/25 text-gold-400 text-sm font-serif hover:border-gold-500/50 hover:bg-gold-500/10 transition-all rounded-sm mystic-pulse"
          >
            Google 一键登录
          </button>

          <p className="text-[10px] text-gold-500/25 text-center">每日 10 次免费解读</p>
        </div>
      </div>
    </div>
  );
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => setUser(session?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    const { data: { subscription } } = onAuthStateChange(setUser);
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  return { user, loading, logout };
}
