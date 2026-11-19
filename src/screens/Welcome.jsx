import { EVENT } from '../config.js';
import { GiftIllustration, HollyIllustration, SantaIllustration } from '../components/Decorations.jsx';

export default function Welcome({ onNext }) {
  return (
    <section className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-5 pb-12 pt-16 text-center">
      <div className="relative mb-2">
        <SantaIllustration className="float h-36 w-36 drop-shadow-2xl sm:h-44 sm:w-44" />
        <GiftIllustration className="absolute -bottom-1 -left-10 h-14 w-14 rotate-[-12deg]" />
        <GiftIllustration className="absolute -bottom-2 -right-10 h-12 w-12 rotate-[10deg]" color="#16614a" ribbon="#f3d98b" />
      </div>

      <h1 className="fade-up mt-6 max-w-2xl font-display text-4xl font-extrabold leading-tight text-cream-50 sm:text-6xl">
        Welcome to <span className="text-gold-400">Not So</span> Secret Santa! 🎅🎁
      </h1>

      <p className="fade-up mt-4 max-w-xl font-display text-lg italic text-gold-200 sm:text-xl" style={{ animationDelay: '150ms' }}>
        Where the gifts are mysterious, the rules are questionable and the Christmas spirit is mandatory!
      </p>

      <div
        className="fade-up mt-7 inline-flex items-center gap-3 rounded-full border border-gold-500/60 bg-berry-700/80 px-5 py-2.5 shadow-lg"
        style={{ animationDelay: '300ms' }}
      >
        <span aria-hidden="true">📅</span>
        <span className="text-sm font-bold tracking-wide text-cream-50 sm:text-base">{EVENT.period}</span>
      </div>

      <div
        className="fade-up relative mt-8 w-full max-w-lg rounded-2xl border border-gold-500/30 bg-cream-100 p-6 text-left text-pine-900 shadow-2xl sm:p-8"
        style={{ animationDelay: '450ms' }}
      >
        <HollyIllustration className="absolute -top-5 left-1/2 h-10 w-16 -translate-x-1/2" />
        <p className="text-base leading-relaxed sm:text-lg">
          You've officially been recruited into Not So Secret Santa. Your mission is simple: spread a little Christmas
          cheer, leave a few surprises and most importantly,{' '}
          <strong className="font-extrabold text-berry-700">DON'T GET CAUGHT!</strong>
        </p>
        <p className="mt-3 text-sm italic leading-relaxed text-pine-800/75">
          Yes, you both know who's who. No, that's not an excuse. Act like it's the best-kept secret in the office.
        </p>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="fade-up hover-wiggle mt-9 inline-flex items-center gap-2 rounded-full bg-berry-600 px-9 py-4 text-lg font-bold text-cream-50 shadow-[0_10px_30px_rgba(185,28,28,0.45)] ring-2 ring-gold-400/70 transition hover:-translate-y-0.5 hover:bg-berry-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-300 active:scale-95"
        style={{ animationDelay: '600ms' }}
      >
        Let's Get Sneaky! <span className="wiggle-target inline-block">🎁</span>
      </button>

      <p className="fade-up mt-6 text-xs uppercase tracking-[0.25em] text-gold-300/70" style={{ animationDelay: '800ms' }}>
        Christmas cheer loading... 100%
      </p>
    </section>
  );
}
