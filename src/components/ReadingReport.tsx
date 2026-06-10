import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReadingReportProps {
  content: string;
  onBack: () => void;
  onNewReading: () => void;
}

export default function ReadingReport({ content, onBack, onNewReading }: ReadingReportProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 space-y-10">
      <div className="text-center space-y-3">
        <div className="ornament max-w-[120px] mx-auto">
          <span className="text-[8px]">✦</span>
        </div>
        <h2 className="text-2xl font-serif text-gold-300 text-glow">解读报告</h2>
      </div>

      <div className="border border-gold-500/15 p-6 sm:p-10 bg-mystic-900/40 rounded-sm glow-purple">
        <div className="prose-arcana">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-xl font-serif font-bold text-gold-300 text-glow mb-4 mt-8 pb-2 border-b border-gold-500/15">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-serif font-bold text-gold-300 mb-3 mt-6 pb-2 border-b border-gold-500/10">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-serif font-bold text-gold-400 mb-2 mt-5">{children}</h3>,
              p: ({ children }) => <p className="text-sm text-gold-200/65 leading-[1.8] mb-4">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 mb-4 ml-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 mb-4 ml-2">{children}</ol>,
              li: ({ children }) => <li className="text-sm text-gold-200/65 leading-relaxed">{children}</li>,
              strong: ({ children }) => <strong className="font-bold text-gold-300">{children}</strong>,
              em: ({ children }) => <em className="text-gold-400/60 italic">{children}</em>,
              blockquote: ({ children }) => <blockquote className="border-l-2 border-gold-500/30 bg-gold-500/5 pl-5 py-3 my-4 italic text-gold-200/50 rounded-r-sm">{children}</blockquote>,
              hr: () => (
                <div className="ornament my-8 max-w-[80px] mx-auto">
                  <span className="text-[6px]">✦</span>
                </div>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-2">
        <button
          onClick={onBack}
          className="px-6 py-2.5 border border-gold-500/20 text-gold-500/50 font-serif text-sm hover:border-gold-500/40 hover:text-gold-400 transition-all rounded-sm"
        >
          ‹ 返回牌面
        </button>
        <button
          onClick={onNewReading}
          className="px-8 py-2.5 border-2 border-gold-500 text-gold-400 font-serif text-sm uppercase tracking-[0.2em] hover:bg-gold-500 hover:text-mystic-950 transition-all mystic-pulse rounded-sm"
        >
          新的占卜
        </button>
      </div>
    </div>
  );
}
