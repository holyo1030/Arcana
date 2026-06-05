import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReadingReportProps {
  content: string;
  onBack: () => void;
  onNewReading: () => void;
}

export default function ReadingReport({ content, onBack, onNewReading }: ReadingReportProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-serif text-gold-300">解读报告</h2>
      </div>

      <div className="border border-gold-500/20 p-6 sm:p-8 bg-mystic-900/50">
        <div className="prose-arcana">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-xl font-serif font-bold text-gold-300 mb-3 mt-6 pb-2 border-b border-gold-500/20">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-serif font-bold text-gold-300 mb-3 mt-6 pb-2 border-b border-gold-500/10">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-serif font-bold text-gold-400 mb-2 mt-4">{children}</h3>,
              p: ({ children }) => <p className="text-sm text-gold-200/70 leading-relaxed mb-3">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3 ml-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 ml-2">{children}</ol>,
              li: ({ children }) => <li className="text-sm text-gold-200/70 leading-relaxed">{children}</li>,
              strong: ({ children }) => <strong className="font-bold text-gold-300">{children}</strong>,
              blockquote: ({ children }) => <blockquote className="border-l-4 border-gold-500/30 bg-gold-500/5 pl-4 py-2 my-3 italic text-gold-200/50">{children}</blockquote>,
              hr: () => <hr className="my-6 border-gold-500/10" />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gold-500/30 text-gold-500/60 font-serif text-sm hover:border-gold-500/50 hover:text-gold-400 transition-all"
        >
          ← 返回牌面
        </button>
        <button
          onClick={onNewReading}
          className="px-6 py-2 border-2 border-gold-500 text-gold-400 font-serif text-sm uppercase tracking-widest hover:bg-gold-500 hover:text-mystic-950 transition-all"
        >
          新的占卜
        </button>
      </div>
    </div>
  );
}
