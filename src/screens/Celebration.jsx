import { useLayoutEffect, useRef, useState } from 'react';
import AgreementDocument from '../components/AgreementDocument.jsx';
import { Confetti } from '../components/Decorations.jsx';
import { downloadAgreementPdf } from '../lib/pdf.js';

const DOC_WIDTH = 794;
const DOC_HEIGHT = 1123;

function ScaledPreview({ answers }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(0.4);

  useLayoutEffect(() => {
    const el = ref.current;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / DOC_WIDTH)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="mx-auto w-full max-w-[794px]">
      <div className="relative overflow-hidden rounded-md shadow-2xl ring-1 ring-gold-500/40" style={{ height: DOC_HEIGHT * scale }}>
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: DOC_WIDTH, height: DOC_HEIGHT, transform: `scale(${scale})` }}
        >
          <AgreementDocument answers={answers} />
        </div>
      </div>
    </div>
  );
}

export default function Celebration({ answers, onRestart }) {
  const [downloading, setDownloading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const handleDownload = async () => {
    setDownloading(true);
    setPdfError(null);
    try {
      await downloadAgreementPdf(answers);
    } catch (err) {
      console.error(err);
      setPdfError('The elves dropped the PDF. Please try again, or use Print and choose “Save as PDF”.');
    } finally {
      setDownloading(false);
    }
  };

  const handleRestart = () => {
    if (window.confirm('Start over? Your agreement will vanish faster than Santa up a chimney.')) onRestart();
  };

  return (
    <section className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-16 pt-16 text-center">
      <Confetti />

      <div className="fade-up text-6xl" aria-hidden="true">
        🎄🎁
      </div>
      <h1 className="fade-up mt-4 font-display text-4xl font-extrabold leading-tight text-cream-50 sm:text-5xl">
        Congratulations! You're Officially <span className="text-gold-400">Not So Secret!</span> 🎅🎉
      </h1>
      <p className="fade-up mx-auto mt-4 max-w-xl text-base leading-relaxed text-cream-100/85 sm:text-lg" style={{ animationDelay: '150ms' }}>
        Your Secret Santa mission has been assigned. Print your agreement, sign it and deliver it without getting
        caught. May the Christmas odds be ever in your favour!
      </p>

      <div className="fade-up mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row" style={{ animationDelay: '300ms' }}>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 rounded-full bg-berry-600 px-6 py-4 font-bold text-cream-50 shadow-lg ring-2 ring-gold-400/70 transition hover:-translate-y-0.5 hover:bg-berry-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-300 active:scale-95"
        >
          🖨️ Print Agreement
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 rounded-full bg-gold-400 px-6 py-4 font-bold text-pine-950 shadow-lg ring-2 ring-gold-200/60 transition hover:-translate-y-0.5 hover:bg-gold-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-200 active:scale-95 disabled:cursor-wait disabled:opacity-70"
        >
          {downloading ? '🎄 Wrapping your PDF...' : '📄 Download as PDF'}
        </button>
      </div>
      {pdfError && (
        <p role="alert" className="mt-3 text-sm font-semibold text-gold-200">
          {pdfError}
        </p>
      )}
      <button
        type="button"
        onClick={handleRestart}
        className="mt-4 rounded-full px-5 py-2 text-sm font-semibold text-cream-100/70 underline-offset-4 transition hover:text-cream-50 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/60"
      >
        ↺ Start Over
      </button>

      <div className="fade-up mt-10" style={{ animationDelay: '450ms' }}>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">Your Official Agreement</p>
        <ScaledPreview answers={answers} />
      </div>

      <div className="mt-8 space-y-1 text-sm italic text-gold-200/80">
        <p>Your festive contract is legally binding in the North Pole. Probably.</p>
        <p>If you get caught delivering a gift, we don't know you.</p>
      </div>
    </section>
  );
}
