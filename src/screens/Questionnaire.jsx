import { useState } from 'react';
import {
  BUDGET_DEFAULT,
  BUDGET_MAX,
  BUDGET_MIN,
  BUDGET_STEP,
  CARD_OPTIONS,
  DELIVERY_RULES,
  budgetAmount,
  formatJmd,
} from '../config.js';

const STEPS = [
  { title: 'Gift Budget', emoji: '💰', quip: 'Slide it till it feel right.' },
  { title: 'Notes & Cards', emoji: '💌', quip: 'Your handwriting is about to be judged.' },
  { title: 'The Secret Delivery Agreement', emoji: '🕵️', quip: 'If you get caught delivering a gift, we don’t know you.' },
];

function validate(step, a) {
  switch (step) {
    case 0:
      return a.budget ? null : 'Slide the budget. Christmas cheer isn’t free.';
    case 1:
      return a.cards ? null : 'Select how many notes or cards you’re giving.';
    case 2:
      return a.pledged ? null : 'You must solemnly swear before sealing the deal.';
    default:
      return null;
  }
}

export default function Questionnaire({ answers, setAnswers, onBackToWelcome, onComplete }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState('forward');
  const [error, setError] = useState(null);
  const [shakeKey, setShakeKey] = useState(0);

  const update = (patch) => {
    setAnswers((a) => ({ ...a, ...patch }));
    setError(null);
  };

  const goNext = () => {
    const problem = validate(step, answers);
    if (problem) {
      setError(problem);
      setShakeKey((k) => k + 1);
      return;
    }
    setError(null);
    if (step === STEPS.length - 1) {
      onComplete();
      return;
    }
    setDirection('forward');
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setError(null);
    if (step === 0) {
      onBackToWelcome();
      return;
    }
    setDirection('back');
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const meta = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <section className="relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 pb-10 pt-14 sm:pt-16">
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-gold-300">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="normal-case tracking-normal text-cream-100/70">{meta.title}</span>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-pine-900 ring-1 ring-gold-500/30"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={step + 1}
          aria-label="Questionnaire progress"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-berry-600 via-gold-400 to-pine-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between px-0.5" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span
              key={s.title}
              className={`text-base transition ${i <= step ? 'opacity-100' : 'opacity-30 grayscale'}`}
            >
              {s.emoji}
            </span>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          goNext();
        }}
        noValidate
        className="flex flex-col"
      >
        <div
          key={step}
          className={`${direction === 'forward' ? 'step-forward' : 'step-back'} rounded-2xl border border-gold-500/25 bg-cream-100 p-5 text-pine-900 shadow-2xl sm:p-7`}
        >
          {step === 0 && <BudgetStep answers={answers} update={update} />}
          {step === 1 && <CardsStep answers={answers} update={update} />}
          {step === 2 && <AgreementStep answers={answers} update={update} />}

          {error && (
            <p
              key={shakeKey}
              role="alert"
              className="shake mt-5 rounded-lg border border-berry-500/40 bg-berry-600/10 px-4 py-3 text-sm font-semibold text-berry-700"
            >
              {error}
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-xs italic text-gold-200/80">{meta.quip}</p>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={goBack}
            className="rounded-full border-2 border-cream-100/40 px-6 py-3.5 font-semibold text-cream-100 transition hover:border-cream-100 hover:bg-cream-100/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-300/50 active:scale-95"
          >
            ← Back
          </button>
          <button
            type="submit"
            className={`flex-1 rounded-full px-6 py-3.5 font-bold shadow-lg ring-2 transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 active:scale-[0.98] ${
              isLast
                ? 'bg-berry-600 text-cream-50 ring-gold-400/70 hover:bg-berry-500 focus-visible:ring-gold-300'
                : 'bg-gold-400 text-pine-950 ring-gold-200/60 hover:bg-gold-300 focus-visible:ring-gold-200'
            }`}
          >
            {isLast ? 'Seal the Christmas Deal 🎄' : 'Next →'}
          </button>
        </div>
      </form>
    </section>
  );
}

function StepHeading({ emoji, children, sub }) {
  return (
    <div className="mb-5">
      <div className="mb-2 text-3xl" aria-hidden="true">
        {emoji}
      </div>
      <h2 className="font-display text-2xl font-bold leading-snug text-pine-900 sm:text-3xl">{children}</h2>
      {sub && <p className="mt-2 text-sm text-pine-800/75">{sub}</p>}
    </div>
  );
}

function OptionCard({ selected, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative rounded-xl border-2 p-3 text-center transition focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400/60 active:scale-95 ${
        selected
          ? 'border-berry-600 bg-berry-600 text-cream-50 shadow-lg shadow-berry-600/30'
          : 'border-pine-800/15 bg-white text-pine-900 hover:border-pine-600/50'
      } ${className}`}
    >
      {selected && (
        <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-[11px] font-black text-pine-950">
          ✓
        </span>
      )}
      {children}
    </button>
  );
}

function BudgetStep({ answers, update }) {
  const amount = budgetAmount(answers) ?? BUDGET_DEFAULT;
  const percent = ((amount - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;

  return (
    <>
      <StepHeading emoji="💰" sub="Choose your preferred gift budget in JMD dollars.">
        How much we a spend pon gift?
      </StepHeading>

      <div className="mb-4 rounded-xl border border-gold-500/40 bg-gold-200/50 px-4 py-3 text-sm text-pine-900">
        Your mission is <strong>1 gift</strong> plus notes/cards. This budget is for the <em>gift</em>.
      </div>

      <div className="rounded-2xl border-2 border-pine-800/10 bg-white px-5 py-6">
        <p className="text-center font-display text-4xl font-extrabold text-berry-700 tabular-nums">
          {formatJmd(amount)}
        </p>
        <p className="mt-1 text-center text-xs font-semibold uppercase tracking-widest text-pine-800/50">JMD</p>

        <label htmlFor="budget" className="sr-only">
          Gift budget in Jamaican dollars
        </label>
        <input
          id="budget"
          type="range"
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={amount}
          onChange={(e) => update({ budget: Number(e.target.value) })}
          className="budget-slider mt-6 w-full cursor-pointer"
          style={{ '--fill': `${percent}%` }}
          aria-valuetext={formatJmd(amount)}
        />

        <div className="mt-2 flex justify-between text-xs font-semibold text-pine-800/55">
          <span>{formatJmd(BUDGET_MIN)}</span>
          <span>{formatJmd(BUDGET_MAX)}</span>
        </div>
      </div>
    </>
  );
}

function CardsStep({ answers, update }) {
  return (
    <>
      <StepHeading emoji="💌" sub="Minimum 2, maximum 4.">
        Select the number of notes / cards to give
      </StepHeading>

      <div className="grid grid-cols-3 gap-3">
        {CARD_OPTIONS.map((n) => (
          <OptionCard key={n} selected={answers.cards === n} onClick={() => update({ cards: n })} className="py-5">
            <span className="block text-3xl font-black">{n}</span>
            <span className="mt-1 block text-xs font-semibold opacity-80">notes / cards</span>
          </OptionCard>
        ))}
      </div>

      <div className="mt-5 flex gap-3 rounded-xl border-2 border-dashed border-berry-600/50 bg-berry-600/5 p-4">
        <span className="text-2xl" aria-hidden="true">
          ✍️
        </span>
        <p className="text-sm font-semibold text-berry-800">
          At least ONE must be a handwritten note. No shortcuts! Santa appreciates effort.
        </p>
      </div>
    </>
  );
}

function AgreementStep({ answers, update }) {
  return (
    <>
      <div className="mb-5 rounded-xl bg-berry-700 px-4 py-5 text-center text-cream-50 shadow-inner">
        <div className="text-3xl" aria-hidden="true">
          🕵️
        </div>
        <h2 className="mt-1 font-display text-2xl font-extrabold tracking-wide sm:text-3xl">RULE #1: DON'T GET CAUGHT!</h2>
      </div>
      <p className="text-base font-semibold leading-relaxed text-pine-900">
        Under no circumstances should your Secret Santa recipient see you delivering a gift, Christmas card or note to
        their workstation.
      </p>

      <ul className="mt-4 space-y-2.5">
        {DELIVERY_RULES.map((rule) => (
          <li key={rule} className="flex gap-3 text-sm text-pine-900">
            <span className="mt-0.5 text-gold-600" aria-hidden="true">
              ★
            </span>
            <span>{rule}</span>
          </li>
        ))}
      </ul>

      <label
        htmlFor="pledge"
        className={`mt-6 flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition ${
          answers.pledged ? 'border-pine-700 bg-pine-700/10' : 'border-pine-800/20 bg-white hover:border-pine-600/50'
        }`}
      >
        <input
          id="pledge"
          type="checkbox"
          checked={answers.pledged}
          onChange={(e) => update({ pledged: e.target.checked })}
          className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer accent-pine-700"
        />
        <span className="text-sm font-bold text-pine-900 sm:text-base">
          I solemnly swear to be sneaky, festive and reasonably well-behaved.
        </span>
      </label>
    </>
  );
}
