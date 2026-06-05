import { useState, useEffect } from 'react';
import QuestionForm from './components/QuestionForm';
import CardDraw from './components/CardDraw';
import SpreadLayout from './components/SpreadLayout';
import ReadingReport from './components/ReadingReport';
import { AuthModal, useAuth } from './components/Auth';
import { drawCards, buildReadingContext, type ReadingResult } from './lib/TarotEngine';
import { buildReadingPrompt } from './lib/AIPrompts';
import { requestReading, getQuota } from './lib/ApiService';
import { type Spread } from './data/spreads';

type Step = 'input' | 'drawing' | 'spread' | 'report';

function App() {
  const { user, loading: authLoading, logout } = useAuth();
  const [step, setStep] = useState<Step>('input');
  const [readingResult, setReadingResult] = useState<ReadingResult | null>(null);
  const [report, setReport] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [remainingCalls, setRemainingCalls] = useState(10);

  useEffect(() => {
    if (user) {
      getQuota()
        .then(data => setRemainingCalls(data.remainingCalls))
        .catch(() => {});
    }
  }, [user]);

  const handleStartReading = (question: string, spread: Spread) => {
    const result = drawCards(spread, question);
    setReadingResult(result);
    setReport('');
    setError(null);
    setStep('drawing');
  };

  const handleDrawComplete = () => {
    setStep('spread');
  };

  const handleRequestReading = async () => {
    if (!readingResult) return;

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const cost = readingResult.spread.quotaCost;
    if (remainingCalls < cost) {
      setError(`需要 ${cost} 次配额，但仅剩 ${remainingCalls} 次`);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const context = buildReadingContext(readingResult);
      const { systemPrompt, userPrompt } = buildReadingPrompt(context, readingResult.spread.id);

      const data = await requestReading({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        spreadType: readingResult.spread.id,
        question: readingResult.question,
        drawnCards: readingResult.drawnCards.map(d => ({
          cardId: d.card.id,
          cardName: d.card.name,
          isReversed: d.isReversed,
          position: d.position.name,
        })),
        quotaCost: cost,
      });

      setReport(data.message);
      setRemainingCalls(data.remainingCalls);
      setStep('report');
    } catch (err: any) {
      console.error('Reading failed:', err);
      setError(err.message || '解读生成失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewReading = () => {
    setStep('input');
    setReadingResult(null);
    setReport('');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Top bar */}
      <div className="w-full flex justify-between items-center mb-4">
        <div />
        <div className="flex items-center gap-3">
          {authLoading ? (
            <span className="text-xs text-gold-500/30">...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gold-500/40 font-mono">
                {remainingCalls} 次
              </span>
              <span className="text-xs text-gold-500/40 font-mono truncate max-w-[120px]">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="text-xs text-gold-500/30 hover:text-gold-400 transition-colors"
              >
                退出
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-xs font-serif text-gold-500/50 border border-gold-500/20 px-3 py-1.5 hover:border-gold-500/40 hover:text-gold-400 transition-all"
            >
              登录
            </button>
          )}
        </div>
      </div>

      {/* Header */}
      <header className="w-full text-center mb-12 mt-4">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tighter text-gold-300 mb-2">
          ARCANA
        </h1>
        <p className="text-[10px] font-mono text-gold-500/30 uppercase tracking-[0.4em]">
          Unveil Your Path
        </p>
      </header>

      {/* Navigation */}
      {step !== 'input' && (
        <div className="w-full max-w-4xl mb-8">
          <button
            onClick={handleNewReading}
            className="text-xs font-serif text-gold-500/40 hover:text-gold-400 transition-colors"
          >
            &larr; 新的占卜
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="w-full flex-1">
        {step === 'input' && (
          <QuestionForm onSubmit={handleStartReading} />
        )}

        {step === 'drawing' && readingResult && (
          <CardDraw
            spread={readingResult.spread}
            drawnCards={readingResult.drawnCards}
            onComplete={handleDrawComplete}
          />
        )}

        {step === 'spread' && readingResult && (
          <SpreadLayout
            spread={readingResult.spread}
            drawnCards={readingResult.drawnCards}
            onRequestReading={handleRequestReading}
            isAnalyzing={isAnalyzing}
          />
        )}

        {step === 'report' && report && (
          <ReadingReport
            content={report}
            onBack={() => setStep('spread')}
            onNewReading={handleNewReading}
          />
        )}

        {error && (
          <div className="text-center mt-4">
            <p className="text-xs text-red-400/70 font-mono">{error}</p>
          </div>
        )}
      </main>

      {/* Auth modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Footer */}
      <footer className="mt-16 mb-8 text-center text-[10px] font-mono text-gold-500/15">
        <p>&copy; {new Date().getFullYear()} ARCANA</p>
      </footer>
    </div>
  );
}

export default App;
