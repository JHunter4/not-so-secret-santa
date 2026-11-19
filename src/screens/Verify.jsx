import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { VERIFICATION } from '../config.js';

const TOTAL_QUESTIONS = 4;

const WRONG_MESSAGES = [
  'Nope. That answer is more suspicious than this link.',
  'Wrong. Santa just moved you one step closer to the naughty list.',
  'Access denied. Try again, imposter.',
  'Incorrect. Try again.',
];

const SCAN_MESSAGES = [
  'Checking criminal records...',
  "Consulting Santa's naughty list...",
  'Cross-referencing Thursday lunch habits...',
  'Verifying Christmas eligibility...',
];
const FINAL_MESSAGE = 'Identity questionable. Access granted anyway. ✅';
const STEP_MS = 1100;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const normalize = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
const matchesAny = (input, answers) => {
  const value = normalize(input);
  return value.length > 0 && answers.some((a) => value.includes(normalize(a)));
};

function useWrongAnswer() {
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  return {
    error,
    shakeKey: count,
    wrong: (message) => {
      setError(message ?? WRONG_MESSAGES[count % WRONG_MESSAGES.length]);
      setCount((c) => c + 1);
    },
    clear: () => setError(null),
  };
}

export default function Verify({ onNext }) {
  const [step, setStep] = useState(0);
  const [round, setRound] = useState(0);
  const [burned, setBurned] = useState(false);
  const [scanning, setScanning] = useState(false);

  const advance = () => {
    if (step === TOTAL_QUESTIONS - 1) setScanning(true);
    else setStep((s) => s + 1);
  };

  const burn = useCallback(() => setBurned(true), []);

  const restart = () => {
    setBurned(false);
    setStep(0);
    setRound((r) => r + 1);
  };

  if (scanning) return <Scanning onDone={onNext} />;
  if (burned) return <Burned onRestart={restart} />;

  return (
    <section className="scanlines relative flex min-h-dvh flex-col items-center px-5 py-12 sm:justify-center">
      <div className="relative z-10 w-full max-w-lg">
        <div className="mb-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-terminal/60">
            Security check · Question {step + 1} of {TOTAL_QUESTIONS}
          </p>
          <div className="mx-auto mt-3 flex max-w-xs gap-1.5">
            {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                  i < step ? 'bg-terminal' : i === step ? 'bg-terminal/60' : 'bg-terminal/15'
                }`}
              />
            ))}
          </div>
          {step === 0 && (
            <>
              <h1 className="terminal-glow mt-5 font-mono text-2xl font-bold text-terminal sm:text-3xl">
                Before we proceed, we need to verify your identity. 🔐
              </h1>
              <p className="mt-3 text-sm text-emerald-100/75 sm:text-base">
                Please complete our highly sophisticated security verification process. We take absolutely none of
                this seriously.
              </p>
            </>
          )}
        </div>

        <div key={`${round}-${step}`} className="step-forward">
          {step === 0 && <BirthdayQuestion onCorrect={advance} />}
          {step === 1 && <ThursdayQuestion onCorrect={advance} />}
          {step === 2 && <FireQuestion onCorrect={advance} onBurned={burn} />}
          {step === 3 && <ChristmasQuestion onCorrect={advance} />}
        </div>
      </div>
    </section>
  );
}

function QuestionCard({ number, title, note, error, shakeKey, onSubmit, submitLabel, children, tone = 'terminal' }) {
  const fire = tone === 'fire';
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      noValidate
      autoComplete="off"
      className={`rounded-xl border p-5 sm:p-7 ${
        fire
          ? 'border-orange-500/60 bg-black/75 shadow-[0_0_60px_rgba(255,90,0,0.35)]'
          : 'border-terminal/25 bg-black/60'
      }`}
    >
      <p className={`font-mono text-xs font-semibold ${fire ? 'text-orange-300/80' : 'text-terminal/50'}`}>
        [{String(number).padStart(2, '0')}]
      </p>
      <h2 className={`mt-1 font-mono text-lg font-bold leading-snug sm:text-xl ${fire ? 'text-orange-200' : 'text-terminal'}`}>
        {title}
      </h2>
      {note && <p className="mt-2 text-xs text-emerald-100/55">{note}</p>}

      <div className="mt-5">{children}</div>

      {error && (
        <p key={shakeKey} role="alert" className="shake mt-4 font-mono text-sm text-red-400">
          ✖ {error}
        </p>
      )}

      <button
        type="submit"
        className={`mt-6 w-full rounded-md px-6 py-4 font-mono text-base font-bold transition hover:brightness-110 focus:outline-none focus-visible:ring-4 active:scale-[0.98] ${
          fire
            ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white focus-visible:ring-orange-400/50'
            : 'bg-terminal text-void focus-visible:ring-terminal/40'
        }`}
      >
        {submitLabel}
      </button>
    </form>
  );
}

const inputClass =
  'w-full rounded-md border border-terminal/30 bg-black/70 px-4 py-3 font-mono text-base text-emerald-50 placeholder:text-emerald-200/30 focus:border-terminal focus:outline-none focus:ring-2 focus:ring-terminal/30';

function BirthdayQuestion({ onCorrect }) {
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [roasted, setRoasted] = useState(false);
  const { error, shakeKey, wrong, clear } = useWrongAnswer();

  const maxDay = month ? DAYS_IN_MONTH[Number(month) - 1] : 31;

  if (roasted) {
    return (
      <div className="fade-up rounded-xl border border-terminal/40 bg-black/70 p-6 text-center">
        <div className="text-5xl" aria-hidden="true">🤦</div>
        <p className="terminal-glow mt-4 font-mono text-lg font-bold text-terminal">Correct. October 15th. 👀</p>
        <p className="mt-3 text-base leading-relaxed text-emerald-50">
          You don't learn? Just giving away your mother's confidential information just like that.
        </p>
        <p className="mt-3 text-xs text-emerald-100/55">
          And you clicked a suspicious link on top of it. Impressive.
        </p>
        <button
          type="button"
          onClick={onCorrect}
          className="mt-6 w-full rounded-md bg-terminal px-6 py-4 font-mono text-base font-bold text-void transition hover:brightness-110 active:scale-[0.98]"
        >
          Continue verifying your identity →
        </button>
      </div>
    );
  }

  const submit = () => {
    if (!month || !day) {
      wrong('Pick a month AND a day. Your mother deserves a full birthday.');
      return;
    }
    const { month: m, day: d } = VERIFICATION.motherBirthday;
    if (Number(month) === m && Number(day) === d) setRoasted(true);
    else wrong("Incorrect, Yuh dont know yuh mada DOB?? 😳");
  };

  const selectClass = `${inputClass} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2339ff88'%3E%3Cpath d='M5.5 7.5 10 12l4.5-4.5'/%3E%3C/svg%3E")] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`;

  return (
    <QuestionCard
      number={1}
      title="What is your mother's date of birth?"
      note="Just the month and day. We're not monsters."
      error={error}
      shakeKey={shakeKey}
      onSubmit={submit}
      submitLabel="Verify →"
    >
      <div className="grid grid-cols-[1.6fr_1fr] gap-3">
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs text-terminal/70">Month</span>
          <select
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              if (day && Number(day) > DAYS_IN_MONTH[Number(e.target.value) - 1]) setDay('');
              clear();
            }}
            className={selectClass}
          >
            <option value="">Month</option>
            {MONTHS.map((name, i) => (
              <option key={name} value={i + 1}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-xs text-terminal/70">Day</span>
          <select
            value={day}
            onChange={(e) => {
              setDay(e.target.value);
              clear();
            }}
            className={selectClass}
          >
            <option value="">Day</option>
            {Array.from({ length: maxDay }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
      </div>
    </QuestionCard>
  );
}

function TextQuestion({
  number,
  title,
  note,
  placeholder,
  check,
  onCorrect,
  submitLabel = 'Verify →',
  inputMode,
  wrongMessage,
  emptyMessage = 'Silence is suspicious. Type something.',
}) {
  const [value, setValue] = useState('');
  const { error, shakeKey, wrong, clear } = useWrongAnswer();

  const submit = () => {
    if (!value.trim()) {
      wrong(emptyMessage);
      return;
    }
    if (check(value)) onCorrect();
    else wrong(wrongMessage);
  };

  return (
    <QuestionCard
      number={number}
      title={title}
      note={note}
      error={error}
      shakeKey={shakeKey}
      onSubmit={submit}
      submitLabel={submitLabel}
    >
      <input
        type="text"
        inputMode={inputMode}
        maxLength={60}
        autoFocus
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          clear();
        }}
        className={inputClass}
      />
    </QuestionCard>
  );
}

function ThursdayQuestion({ onCorrect }) {
  return (
    <TextQuestion
      number={2}
      title="What do you normally eat on Thursdays?"
      placeholder="Be specific. We're judging."
      check={(v) => matchesAny(v, VERIFICATION.thursdayFood)}
      onCorrect={onCorrect}
      wrongMessage="Yuh wrong but yuh probably right because yuh ditch me so much times without notification 😤"
    />
  );
}

function ChristmasQuestion({ onCorrect }) {
  return (
    <TextQuestion
      number={4}
      title="What is our favourite time of the year?"
      note="Choose wisely. The Christmas spirit is listening."
      placeholder="Hint: there's a tree involved 🎄"
      check={(v) => matchesAny(v, VERIFICATION.favouriteTime)}
      onCorrect={onCorrect}
      wrongMessage="Incorrect"
      submitLabel="Complete Verification ✅"
    />
  );
}

function FireQuestion({ onCorrect, onBurned }) {
  const { words, revealed } = VERIFICATION.rescueTarget;
  const total = VERIFICATION.fireSeconds;
  const [letters, setLetters] = useState(() =>
    words.map((word, wi) => [...word].map((ch, i) => (revealed[wi].includes(i) ? ch : ''))),
  );
  const [timeLeft, setTimeLeft] = useState(total);
  const [saved, setSaved] = useState(false);
  const { error, shakeKey, wrong, clear } = useWrongAnswer();
  const inputRefs = useRef({});

  const editable = useMemo(
    () =>
      words.flatMap((word, wi) => [...word].map((_, i) => [wi, i]).filter(([, i]) => !revealed[wi].includes(i))),
    [words, revealed],
  );

  useEffect(() => {
    if (saved) return undefined;
    if (timeLeft <= 0) {
      onBurned();
      return undefined;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, saved, onBurned]);

  useEffect(() => {
    const [wi, i] = editable[0];
    inputRefs.current[`${wi}-${i}`]?.focus();
  }, [editable]);

  const focusCell = (index) => {
    const cell = editable[index];
    if (cell) inputRefs.current[`${cell[0]}-${cell[1]}`]?.focus();
  };

  const setLetter = (wi, i, ch) =>
    setLetters((prev) => prev.map((row, r) => (r === wi ? row.map((c, k) => (k === i ? ch : c)) : row)));

  const handleChange = (wi, i, raw) => {
    const ch = raw.replace(/[^a-z]/gi, '').slice(-1).toUpperCase();
    setLetter(wi, i, ch);
    clear();
    if (ch) focusCell(editable.findIndex(([w, k]) => w === wi && k === i) + 1);
  };

  const handleKeyDown = (wi, i, e) => {
    const index = editable.findIndex(([w, k]) => w === wi && k === i);
    if (e.key === 'Backspace' && !letters[wi][i] && index > 0) {
      e.preventDefault();
      const [pw, pi] = editable[index - 1];
      setLetter(pw, pi, '');
      focusCell(index - 1);
    } else if (e.key === 'ArrowLeft') {
      focusCell(index - 1);
    } else if (e.key === 'ArrowRight') {
      focusCell(index + 1);
    }
  };

  const submit = () => {
    if (letters.some((row) => row.some((c) => !c))) {
      wrong('Fill in every box! The fire is not going to wait for you.');
      return;
    }
    if (letters.map((row) => row.join('')).join(' ') === words.join(' ')) setSaved(true);
    else wrong('Wrong person! They can save themselves. Try again, quickly! 🔥');
  };

  const heat = saved ? 0 : 1 - timeLeft / total;
  const urgent = timeLeft <= 10;

  if (saved) {
    return (
      <div className="fade-up rounded-xl border border-orange-400/60 bg-black/75 p-6 text-center">
        <div className="text-5xl" aria-hidden="true">🚒🧯</div>
        <p className="mt-4 font-mono text-lg font-bold text-orange-200">Phew! The Economic Analyst has been rescued!</p>
        <p className="mt-2 text-sm text-emerald-50/80">
          Saved with {timeLeft} second{timeLeft === 1 ? '' : 's'} to spare. Correct choice. Obviously.
        </p>
        <button
          type="button"
          onClick={onCorrect}
          className="mt-6 w-full rounded-md bg-terminal px-6 py-4 font-mono text-base font-bold text-void transition hover:brightness-110 active:scale-[0.98]"
        >
          Next →
        </button>
      </div>
    );
  }

  return (
    <>
      <FireEffects heat={heat} />
      <div className="relative">
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="flame text-3xl" aria-hidden="true">🔥</span>
          <div
            className={`rounded-lg border-2 px-5 py-2 text-center font-mono ${
              urgent ? 'heat-pulse border-red-500 bg-red-600/30 text-red-200' : 'border-orange-400/70 bg-black/70 text-orange-200'
            }`}
            role="timer"
            aria-live="off"
          >
            <span className="block text-[10px] uppercase tracking-[0.3em] opacity-80">Time left</span>
            <span className="text-3xl font-bold tabular-nums">0:{String(timeLeft).padStart(2, '0')}</span>
          </div>
          <span className="flame text-3xl" style={{ animationDelay: '0.3s' }} aria-hidden="true">🔥</span>
        </div>

        <QuestionCard
          number={3}
          title="QUICK! TAJ is on fire 🔥 and you can only save ONE person. Who would it be?"
          note="Fill in the blank boxes before the timer hits zero, or you start over. Three letters are free. You're welcome."
          error={error}
          shakeKey={shakeKey}
          onSubmit={submit}
          submitLabel="Save Them! 🚒"
          tone="fire"
        >
          <div className="space-y-3">
            {words.map((word, wi) => (
              <div key={word} className="flex justify-center gap-1 sm:gap-1.5">
                {[...word].map((_, i) => {
                  const isRevealed = revealed[wi].includes(i);
                  return (
                    <input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[`${wi}-${i}`] = el;
                      }}
                      type="text"
                      inputMode="text"
                      autoCapitalize="characters"
                      autoCorrect="off"
                      spellCheck={false}
                      maxLength={2}
                      readOnly={isRevealed}
                      tabIndex={isRevealed ? -1 : 0}
                      aria-label={`${wi === 0 ? 'First' : 'Second'} word, letter ${i + 1}`}
                      value={letters[wi][i]}
                      onChange={(e) => handleChange(wi, i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(wi, i, e)}
                      onFocus={(e) => e.target.select()}
                      className={`h-11 w-9 rounded-md border-2 text-center font-mono text-xl font-bold uppercase focus:outline-none sm:h-12 sm:w-11 ${
                        isRevealed
                          ? 'border-gold-400 bg-gold-400 text-pine-950'
                          : 'border-orange-500/70 bg-black/80 text-orange-100 caret-orange-300 focus:border-orange-300 focus:ring-2 focus:ring-orange-400/50'
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </QuestionCard>
      </div>
    </>
  );
}

function FireEffects({ heat }) {
  const embers = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 3 + Math.random() * 4,
        delay: -Math.random() * 6,
        drift: Math.round(Math.random() * 80 - 40),
      })),
    [],
  );
  const flames = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ id: i, size: 28 + ((i * 37) % 26) })), []);

  return createPortal(
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="heat-pulse absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: 0.35 + heat * 0.65,
          background:
            'radial-gradient(ellipse at 50% 115%, rgba(255,110,0,0.75), rgba(200,20,0,0.35) 45%, transparent 75%)',
        }}
      />
      {embers.map((e) => (
        <span
          key={e.id}
          className="ember"
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
            '--drift': `${e.drift}px`,
          }}
        />
      ))}
      <div className="absolute inset-x-0 -bottom-2 flex justify-around" style={{ transform: `scale(${1 + heat * 0.5})`, transformOrigin: 'bottom' }}>
        {flames.map((f) => (
          <span key={f.id} className="flame" style={{ fontSize: f.size, animationDelay: `${(f.id % 5) * 0.17}s` }}>
            🔥
          </span>
        ))}
      </div>
    </div>,
    document.body,
  );
}

function Burned({ onRestart }) {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
      <FireEffects heat={1} />
      <div className="fade-up relative z-10 w-full max-w-md rounded-xl border-2 border-red-500/70 bg-black/80 p-7 shadow-[0_0_80px_rgba(255,60,0,0.5)]">
        <div className="text-6xl" aria-hidden="true">🔥💀🔥</div>
        <h2 className="mt-4 font-mono text-3xl font-black text-red-400">YOU GOT BURNED.</h2>
        <p className="mt-3 text-base leading-relaxed text-orange-100">
          You took too long and TAJ is now a pile of ashes. The Economic Analyst is very disappointed in you.
        </p>
        <p className="mt-2 text-xs text-orange-200/60">Our security system has no choice but to start from the beginning.</p>
        <button
          type="button"
          onClick={onRestart}
          className="mt-6 w-full rounded-md bg-gradient-to-r from-red-600 to-orange-500 px-6 py-4 font-mono text-base font-bold text-white transition hover:brightness-110 active:scale-[0.98]"
        >
          Start Over 🧯
        </button>
      </div>
    </section>
  );
}

function Scanning({ onDone }) {
  const [scanStep, setScanStep] = useState(0);

  useEffect(() => {
    if (scanStep < SCAN_MESSAGES.length) {
      const t = setTimeout(() => setScanStep((s) => s + 1), STEP_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [scanStep, onDone]);

  const done = scanStep >= SCAN_MESSAGES.length;
  const progress = Math.round((scanStep / SCAN_MESSAGES.length) * 100);

  return (
    <section className="scanlines relative flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-xl border border-terminal/30 bg-black/70 p-6 font-mono shadow-[0_0_60px_rgba(57,255,136,0.12)]">
        <p className="mb-4 text-xs uppercase tracking-widest text-terminal/60">Running Very Official Verification™</p>
        <ul className="space-y-2 text-sm text-terminal" aria-live="polite">
          {SCAN_MESSAGES.slice(0, Math.min(scanStep + 1, SCAN_MESSAGES.length)).map((msg, i) => (
            <li key={msg} className="fade-up flex items-start gap-2">
              <span className="w-5 shrink-0">
                {i < scanStep ? (
                  '✔'
                ) : (
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-terminal border-t-transparent align-middle" />
                )}
              </span>
              <span className={i < scanStep ? 'text-terminal/70' : ''}>{msg}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 h-3 overflow-hidden rounded-full border border-terminal/30 bg-terminal/5">
          <div
            className="progress-stripes h-full rounded-full bg-terminal transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-right text-xs text-terminal/60">{progress}%</p>

        {done && (
          <div className="fade-up mt-6 rounded-lg border border-terminal/50 bg-terminal/10 p-4 text-center">
            <p className="terminal-glow text-base font-bold text-terminal sm:text-lg">{FINAL_MESSAGE}</p>
            <p className="mt-2 text-xs text-emerald-100/70">Your identity has been verified by absolutely nobody.</p>
          </div>
        )}
      </div>
    </section>
  );
}
