import { useState } from 'react';
import QuestionForm from './components/QuestionForm';
import CardDraw from './components/CardDraw';
import SpreadLayout from './components/SpreadLayout';
import ReadingReport from './components/ReadingReport';
import { drawCards, buildReadingContext, type ReadingResult } from './lib/TarotEngine';
import { buildReadingPrompt } from './lib/AIPrompts';
import { requestReading } from './lib/ApiService';
import { type Spread } from './data/spreads';

type Step = 'input' | 'drawing' | 'spread' | 'report';

function App() {
  const [step, setStep] = useState<Step>('input');
  const [readingResult, setReadingResult] = useState<ReadingResult | null>(null);
  const [report, setReport] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      });

      setReport(data.message);
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
    <>
      {/* Atmospheric background */}
      <div className="cosmic-bg" />
      <div className="stars" />

      <div className="relative z-10 min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="w-full text-center mb-16 mt-8">
          <div className="ornament mb-6 max-w-xs mx-auto">
            <span>✦</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-serif font-bold tracking-[0.15em] text-gold-300 text-glow-strong mb-3">
            ARCANA
          </h1>
          <p className="text-[11px] font-mono text-gold-500/40 uppercase tracking-[0.5em]">
            Unveil Your Path
          </p>
          <div className="ornament mt-6 max-w-xs mx-auto">
            <span>✦</span>
          </div>
        </header>

        {/* Navigation */}
        {step !== 'input' && (
          <div className="w-full max-w-4xl mb-8">
            <button
              onClick={handleNewReading}
              className="text-xs font-serif text-gold-500/40 hover:text-gold-300 transition-colors flex items-center gap-2"
            >
              <span>‹</span> 新的占卜
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

        {/* Footer */}
        <footer className="mt-20 mb-8 text-center">
          <div className="ornament mb-4 max-w-[100px] mx-auto">
            <span className="text-[8px]">✦</span>
          </div>
          <p className="text-[10px] font-mono text-gold-500/20">&copy; {new Date().getFullYear()} ARCANA</p>
        </footer>
      </div>
    </>
  );
}

export default App;
