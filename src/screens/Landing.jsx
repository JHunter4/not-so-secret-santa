const BOOT_LINES = [
  '> scanning device ............ ok',
  '> detecting poor decisions ... confirmed',
  '> unknown QR code scanned .... guilty',
  '> Santa is watching. HR probably isn’t.',
];

export default function Landing({ onNext }) {
  return (
    <section className="scanlines relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-14 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(57,255,136,0.12),transparent_60%)]" />

      <div className="fade-up relative mb-8 inline-flex items-center gap-2 rounded-full border border-red-500/50 bg-red-500/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-red-300">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        Security notice · Threat: festive
      </div>

      <div className="peek relative mb-6 text-6xl sm:text-7xl" aria-hidden="true">
        👀
      </div>

      <h1 className="flicker terminal-glow relative max-w-2xl font-mono text-2xl font-bold leading-snug text-terminal sm:text-4xl">
        Didn't you learn not to open suspicious links at work? 👀
      </h1>

      <p className="fade-up relative mt-6 max-w-md text-base text-emerald-100/80 sm:text-lg" style={{ animationDelay: '600ms' }}>
        Well, since you're already here... we might as well continue.
      </p>

      <div className="relative mt-8 w-full max-w-md rounded-lg border border-terminal/25 bg-black/60 p-4 text-left font-mono text-xs text-terminal/80 shadow-[0_0_40px_rgba(57,255,136,0.08)] sm:text-sm">
        {BOOT_LINES.map((line, i) => (
          <p key={line} className="fade-up" style={{ animationDelay: `${900 + i * 450}ms` }}>
            {line}
          </p>
        ))}
        <p className="cursor-blink fade-up mt-1 text-terminal" style={{ animationDelay: `${900 + BOOT_LINES.length * 450}ms` }}>
          {'>'} awaiting questionable consent
        </p>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="fade-up group relative mt-10 rounded-md border-2 border-terminal px-8 py-4 font-mono text-base font-bold text-terminal transition hover:bg-terminal hover:text-void focus:outline-none focus-visible:ring-4 focus-visible:ring-terminal/40 active:scale-95"
        style={{ animationDelay: '2800ms' }}
      >
        Anyways, Continue <span className="inline-block transition group-hover:translate-x-1">→</span>
      </button>

      <p className="fade-up relative mt-6 font-mono text-[11px] text-emerald-200/40" style={{ animationDelay: '3200ms' }}>
        No cookies were harmed. Only Christmas ones will be.
      </p>
    </section>
  );
}
