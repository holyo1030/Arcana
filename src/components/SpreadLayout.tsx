import { useState } from 'react';
import { type DrawnCard } from '../lib/TarotEngine';
import { type Spread } from '../data/spreads';
import CardDetail from './CardDetail';

interface SpreadLayoutProps {
  spread: Spread;
  drawnCards: DrawnCard[];
  onRequestReading: () => void;
  isAnalyzing: boolean;
}

export default function SpreadLayout({ spread, drawnCards, onRequestReading, isAnalyzing }: SpreadLayoutProps) {
  const [selectedCard, setSelectedCard] = useState<DrawnCard | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-serif text-gold-300 text-glow">{spread.name}</h2>
        <p className="text-xs text-gold-500/40">点击任意一张牌查看详细牌义</p>
      </div>

      {/* Card grid */}
      <div className={`grid gap-5 justify-center ${
        spread.cardCount === 1 ? 'grid-cols-1 max-w-[180px] mx-auto' :
        spread.cardCount === 3 ? 'grid-cols-3 max-w-md mx-auto' :
        'grid-cols-5 max-w-2xl mx-auto'
      }`}>
        {drawnCards.map((drawn, i) => (
          <div
            key={i}
            onClick={() => setSelectedCard(drawn)}
            className={`cursor-pointer group transition-all hover:scale-105 ${
              spread.id === 'celtic-cross' ? getCelticLayoutClass(i) : ''
            }`}
          >
            <div className="text-center mb-1.5">
              <span className="text-[10px] text-gold-500/35 uppercase tracking-widest">
                {drawn.position.name}
              </span>
            </div>
            <div className={`aspect-[2/3] border bg-card overflow-hidden rounded-sm transition-all ${
              selectedCard === drawn
                ? 'border-gold-500 glow-gold-strong'
                : 'border-gold-500/20 group-hover:border-gold-500/50 group-hover:glow-gold'
            }`}>
              <div className={`w-full h-full flex flex-col items-center justify-center p-2 ${drawn.isReversed ? 'rotate-180' : ''}`}>
                <img
                  src={`/cards/${drawn.card.image}`}
                  alt={drawn.card.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.querySelector('.fallback')?.classList.remove('hidden');
                  }}
                />
                <div className="fallback hidden text-center">
                  <div className="text-gold-400 text-sm font-serif">{drawn.card.name}</div>
                  <div className="text-gold-500/40 text-[10px]">{drawn.card.nameEn}</div>
                </div>
              </div>
            </div>
            <div className="text-center mt-2">
              <div className="text-xs font-serif text-gold-300">{drawn.card.name}</div>
              <div className={`text-[10px] mt-0.5 ${drawn.isReversed ? 'text-red-400/70' : 'text-gold-500/35'}`}>
                {drawn.isReversed ? '▼ 逆位' : '▲ 正位'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Card detail modal */}
      {selectedCard && (
        <CardDetail
          drawn={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {/* AI Reading button */}
      <div className="flex flex-col items-center gap-3 pt-6">
        <div className="ornament max-w-[200px]">
          <span className="text-[8px]">✦</span>
        </div>
        <button
          onClick={onRequestReading}
          disabled={isAnalyzing}
          className="px-12 py-3.5 border-2 border-gold-500 text-gold-400 font-serif text-sm uppercase tracking-[0.3em] hover:bg-gold-500 hover:text-mystic-950 transition-all disabled:opacity-40 disabled:cursor-not-allowed mystic-pulse"
        >
          {isAnalyzing ? '✦ 解读生成中...' : '✦ AI 深度解读'}
        </button>
      </div>
    </div>
  );
}

function getCelticLayoutClass(index: number): string {
  const classes: Record<number, string> = {
    0: 'col-start-3 row-start-2',
    1: 'col-start-3 row-start-2',
    2: 'col-start-3 row-start-3',
    3: 'col-start-2 row-start-2',
    4: 'col-start-3 row-start-1',
    5: 'col-start-4 row-start-2',
    6: 'col-start-5 row-start-4',
    7: 'col-start-5 row-start-3',
    8: 'col-start-5 row-start-2',
    9: 'col-start-5 row-start-1',
  };
  return classes[index] || '';
}
