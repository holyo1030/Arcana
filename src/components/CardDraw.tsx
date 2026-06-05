import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type DrawnCard } from '../lib/TarotEngine';
import { type Spread } from '../data/spreads';

interface CardDrawProps {
  spread: Spread;
  drawnCards: DrawnCard[];
  onComplete: () => void;
}

export default function CardDraw({ spread, drawnCards, onComplete }: CardDrawProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const allRevealed = revealedCount >= spread.cardCount;

  const handleReveal = () => {
    if (revealedCount < spread.cardCount) {
      setRevealedCount(revealedCount + 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-serif text-gold-300">{spread.name}</h2>
        <p className="text-xs text-gold-500/50">
          {allRevealed
            ? '所有牌已揭示'
            : `点击翻开第 ${revealedCount + 1} 张牌（共 ${spread.cardCount} 张）`}
        </p>
      </div>

      <div className={`grid gap-4 justify-center ${
        spread.cardCount === 1 ? 'grid-cols-1 max-w-[200px] mx-auto' :
        spread.cardCount === 3 ? 'grid-cols-3 max-w-lg mx-auto' :
        'grid-cols-5 max-w-2xl mx-auto'
      }`}>
        {drawnCards.map((drawn, i) => {
          const isRevealed = i < revealedCount;
          return (
            <div
              key={i}
              className={`relative ${spread.id === 'celtic-cross' ? getCelticPosition(i) : ''}`}
            >
              <div className="text-center mb-1">
                <span className="text-[10px] text-gold-500/40 uppercase tracking-widest">
                  {drawn.position.name}
                </span>
              </div>
              <div
                className="perspective-1000 cursor-pointer"
                onClick={() => !isRevealed && revealedCount === i && handleReveal()}
              >
                <motion.div
                  className="relative w-full aspect-[2/3]"
                  animate={{ rotateY: isRevealed ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Back */}
                  <div
                    className="absolute inset-0 backface-hidden border border-gold-500/30 bg-gradient-to-br from-mystic-800 to-mystic-900 flex items-center justify-center"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="w-3/4 h-3/4 border border-gold-500/20 flex items-center justify-center">
                      <span className="text-gold-500/30 text-2xl">&#10022;</span>
                    </div>
                  </div>
                  {/* Front */}
                  <div
                    className="absolute inset-0 backface-hidden rotate-y-180 border border-gold-500/40 bg-card overflow-hidden"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
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
                </motion.div>
              </div>
              <AnimatePresence>
                {isRevealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-2"
                  >
                    <div className="text-xs font-serif text-gold-300">{drawn.card.name}</div>
                    <div className={`text-[10px] ${drawn.isReversed ? 'text-red-400/60' : 'text-gold-500/40'}`}>
                      {drawn.isReversed ? '逆位' : '正位'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {!allRevealed && (
        <div className="flex justify-center">
          <button
            onClick={handleReveal}
            className="px-8 py-3 border border-gold-500/40 text-gold-400 font-serif text-sm hover:border-gold-500 hover:bg-gold-500/10 transition-all"
          >
            翻开下一张
          </button>
        </div>
      )}

      {allRevealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <button
            onClick={onComplete}
            className="px-10 py-3 border-2 border-gold-500 text-gold-400 font-serif text-sm uppercase tracking-widest hover:bg-gold-500 hover:text-mystic-950 transition-all"
          >
            查看解读
          </button>
        </motion.div>
      )}
    </div>
  );
}

function getCelticPosition(index: number): string {
  const positions: Record<number, string> = {
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
  return positions[index] || '';
}
