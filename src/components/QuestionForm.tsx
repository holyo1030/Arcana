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
    <form onSubmit={handleSubmit} className="space-y-10 max-w-xl mx-auto px-4">
      <div className="space-y-3">
        <label className="block text-xs uppercase tracking-[0.3em] text-gold-500/60">
          你的困惑 (Your Question)
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="在心中默想你的问题，然后写下来..."
          rows={3}
          className="w-full bg-transparent border-b-2 border-gold-500/20 focus:border-gold-500 text-gold-200 text-lg font-serif py-3 px-0 resize-none focus:outline-none transition-colors placeholder:text-gold-500/20"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-xs uppercase tracking-[0.3em] text-gold-500/60">
          选择牌阵 (Spread)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SPREADS.map((spread) => (
            <button
              key={spread.id}
              type="button"
              onClick={() => setSelectedSpreadId(spread.id)}
              className={`text-left p-4 border transition-all ${
                selectedSpreadId === spread.id
                  ? 'border-gold-500 bg-gold-500/10'
                  : 'border-gold-500/20 hover:border-gold-500/40'
              }`}
            >
              <div className="text-sm font-serif text-gold-300 mb-1">
                {spread.name}
                <span className="ml-2 text-xs text-gold-500/40">{spread.cardCount}张</span>
              </div>
              <div className="text-xs text-gold-500/50">{spread.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          type="submit"
          disabled={!question.trim()}
          className="px-10 py-3 border-2 border-gold-500 text-gold-400 font-serif text-sm uppercase tracking-widest hover:bg-gold-500 hover:text-mystic-950 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gold-400"
        >
          开始占卜
        </button>
      </div>
    </form>
  );
}
