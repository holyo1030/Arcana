import { useState } from 'react';
import { SPREADS, type Spread } from '../data/spreads';

interface QuestionFormProps {
  onSubmit: (question: string, spread: Spread) => void;
}

export default function QuestionForm({ onSubmit }: QuestionFormProps) {
  const [question, setQuestion] = useState('');
  const [selectedSpreadId, setSelectedSpreadId] = useState('three-card');

  const selectedSpread = SPREADS.find(s => s.id === selectedSpreadId)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onSubmit(question.trim(), selectedSpread);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 max-w-xl mx-auto px-4">
      <div className="space-y-4">
        <label className="block text-xs uppercase tracking-[0.3em] text-gold-500/50 text-center">
          ✦ 你的困惑 ✦
        </label>
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="闭上眼，在心中默想你的问题..."
            rows={3}
            className="w-full bg-mystic-900/50 border border-gold-500/15 focus:border-gold-500/50 focus:glow-gold text-gold-200 text-lg font-serif py-4 px-5 resize-none focus:outline-none transition-all placeholder:text-gold-500/20 rounded-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-xs uppercase tracking-[0.3em] text-gold-500/50 text-center">
          ✦ 选择牌阵 ✦
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SPREADS.map((spread) => (
            <button
              key={spread.id}
              type="button"
              onClick={() => setSelectedSpreadId(spread.id)}
              className={`text-left p-5 border rounded-sm transition-all ${
                selectedSpreadId === spread.id
                  ? 'border-gold-500/60 bg-gold-500/10 glow-gold'
                  : 'border-gold-500/15 bg-mystic-900/30 hover:border-gold-500/30 hover:bg-mystic-800/40'
              }`}
            >
              <div className="text-sm font-serif text-gold-300 mb-1.5">
                {spread.name}
                <span className="ml-2 text-xs text-gold-500/30">{spread.cardCount}张</span>
              </div>
              <div className="text-xs text-gold-500/40 leading-relaxed">{spread.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={!question.trim()}
          className="px-12 py-3.5 border-2 border-gold-500 text-gold-400 font-serif text-sm uppercase tracking-[0.3em] hover:bg-gold-500 hover:text-mystic-950 transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gold-400 mystic-pulse"
        >
          开始占卜
        </button>
      </div>
    </form>
  );
}
