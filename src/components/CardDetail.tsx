import { type DrawnCard } from '../lib/TarotEngine';

interface CardDetailProps {
  drawn: DrawnCard;
  onClose: () => void;
}

export default function CardDetail({ drawn, onClose }: CardDetailProps) {
  const info = drawn.isReversed ? drawn.card.reversed : drawn.card.upright;
  const altInfo = drawn.isReversed ? drawn.card.upright : drawn.card.reversed;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-mystic-950/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-mystic-900 border border-gold-500/20 shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gold-500/40 hover:text-gold-400 transition-colors text-xl"
        >
          &times;
        </button>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className={`w-24 aspect-[2/3] border border-gold-500/30 bg-card flex-shrink-0 overflow-hidden ${drawn.isReversed ? 'rotate-180' : ''}`}>
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
              <div className="fallback hidden flex items-center justify-center h-full">
                <span className="text-gold-400 text-xs font-serif">{drawn.card.name}</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-serif text-gold-300">{drawn.card.name}</h3>
              <p className="text-xs text-gold-500/50">{drawn.card.nameEn}</p>
              <div className={`inline-block mt-2 px-2 py-0.5 text-[10px] border ${
                drawn.isReversed
                  ? 'border-red-400/30 text-red-400/70'
                  : 'border-gold-500/30 text-gold-500/70'
              }`}>
                {drawn.isReversed ? '逆位 Reversed' : '正位 Upright'}
              </div>
              <div className="mt-2 text-[10px] text-gold-500/40">
                位置：{drawn.position.name} — {drawn.position.meaning}
              </div>
            </div>
          </div>

          {/* Current orientation meaning */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif text-gold-400 uppercase tracking-widest">
              {drawn.isReversed ? '逆位含义' : '正位含义'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {info.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-[11px] border border-gold-500/20 text-gold-300"
                >
                  {kw}
                </span>
              ))}
            </div>
            <p className="text-sm text-gold-200/70 leading-relaxed">{info.meaning}</p>
          </div>

          {/* Other orientation */}
          <div className="space-y-3 opacity-50">
            <h4 className="text-sm font-serif text-gold-500/60 uppercase tracking-widest">
              {drawn.isReversed ? '正位参考' : '逆位参考'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {altInfo.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-[10px] border border-gold-500/10 text-gold-500/40"
                >
                  {kw}
                </span>
              ))}
            </div>
            <p className="text-xs text-gold-500/40 leading-relaxed">{altInfo.meaning}</p>
          </div>

          {/* Element */}
          <div className="text-[10px] text-gold-500/30 border-t border-gold-500/10 pt-3">
            元素：{drawn.card.element} &middot; {drawn.card.arcana === 'major' ? '大阿卡纳' : '小阿卡纳'}
            {drawn.card.suit && ` · ${
              { wands: '权杖', cups: '圣杯', swords: '宝剑', pentacles: '星币' }[drawn.card.suit]
            }`}
          </div>
        </div>
      </div>
    </div>
  );
}
