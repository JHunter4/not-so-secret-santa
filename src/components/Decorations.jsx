import { useMemo } from 'react';

export function Snow({ count = 34 }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 5,
        duration: 9 + Math.random() * 12,
        delay: -Math.random() * 20,
        drift: Math.round(Math.random() * 80 - 40),
        opacity: 0.35 + Math.random() * 0.55,
      })),
    [count],
  );

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            '--drift': `${f.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

const BULB_COLORS = ['#d43a3a', '#e6c063', '#1f9a6c', '#f8e8b8'];

export function ChristmasLights({ count = 18 }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-20 h-10 overflow-hidden">
      <svg className="absolute inset-x-0 top-0 h-6 w-full" preserveAspectRatio="none" viewBox="0 0 100 10">
        <path
          d="M0 2 Q 5.5 8 11.1 2 T 22.2 2 T 33.3 2 T 44.4 2 T 55.5 2 T 66.6 2 T 77.7 2 T 88.8 2 T 100 2"
          fill="none"
          stroke="#0b2a1f"
          strokeWidth="0.6"
        />
      </svg>
      <div className="relative flex justify-between px-[2%]">
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className="bulb mt-[10px] block h-3.5 w-2.5 rounded-b-full rounded-t-sm"
            style={{
              background: BULB_COLORS[i % BULB_COLORS.length],
              boxShadow: `0 0 10px 2px ${BULB_COLORS[i % BULB_COLORS.length]}99`,
              animationDelay: `${(i % 4) * 0.45}s`,
              transform: `translateY(${i % 2 ? 4 : 0}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const CONFETTI_COLORS = ['#d43a3a', '#e6c063', '#1f9a6c', '#ffffff', '#f3d98b', '#b91c1c'];

export function Confetti({ count = 70 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        width: 6 + Math.random() * 6,
        height: 8 + Math.random() * 10,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        duration: 2.8 + Math.random() * 2.6,
        delay: Math.random() * 1.2,
        drift: Math.round(Math.random() * 160 - 80),
        spin: Math.round(360 + Math.random() * 900),
        round: Math.random() > 0.7,
      })),
    [count],
  );

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.width,
            height: p.round ? p.width : p.height,
            background: p.color,
            borderRadius: p.round ? '9999px' : '2px',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--drift': `${p.drift}px`,
            '--spin': `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  );
}

export function SantaIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Santa Claus">
      <circle cx="100" cy="108" r="78" fill="#0f4d38" opacity="0.35" />
      <path d="M48 92 C 52 40, 120 18, 150 60 L 166 104 L 52 104 Z" fill="#b91c1c" />
      <path d="M118 30 C 150 22, 172 40, 178 70" fill="none" stroke="#b91c1c" strokeWidth="18" strokeLinecap="round" />
      <circle cx="180" cy="78" r="13" fill="#fffbf2" />
      <rect x="40" y="94" width="130" height="22" rx="11" fill="#fffbf2" />
      <circle cx="104" cy="128" r="32" fill="#f6c9a8" />
      <circle cx="92" cy="124" r="3.6" fill="#1c1c1c" />
      <circle cx="116" cy="124" r="3.6" fill="#1c1c1c" />
      <path d="M86 116 q6 -5 12 0 M110 116 q6 -5 12 0" stroke="#fffbf2" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="104" cy="135" r="5" fill="#e88f80" />
      <circle cx="84" cy="136" r="5" fill="#f2a39a" opacity="0.6" />
      <circle cx="124" cy="136" r="5" fill="#f2a39a" opacity="0.6" />
      <path
        d="M66 134 C 62 170, 84 192, 104 192 C 124 192, 146 170, 142 134 C 132 150, 120 146, 104 146 C 88 146, 76 150, 66 134 Z"
        fill="#fffbf2"
      />
      <path d="M90 150 q14 10 28 0" stroke="#d9cfc0" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function GiftIllustration({ className = '', color = '#b91c1c', ribbon = '#e6c063' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect x="14" y="42" width="72" height="50" rx="5" fill={color} />
      <rect x="9" y="30" width="82" height="16" rx="4" fill={color} style={{ filter: 'brightness(1.15)' }} />
      <rect x="45" y="30" width="10" height="62" fill={ribbon} />
      <path d="M50 30 C 34 10, 18 22, 30 30 Z M50 30 C 66 10, 82 22, 70 30 Z" fill={ribbon} />
      <circle cx="50" cy="30" r="5" fill={ribbon} style={{ filter: 'brightness(0.9)' }} />
    </svg>
  );
}

export function HollyIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true">
      <path d="M30 22 C 22 6, 6 10, 2 18 C 8 18, 8 24, 14 24 C 12 28, 18 32, 30 22 Z" fill="#16614a" />
      <path d="M30 22 C 38 6, 54 10, 58 18 C 52 18, 52 24, 46 24 C 48 28, 42 32, 30 22 Z" fill="#1f7a5c" />
      <circle cx="26" cy="22" r="4.5" fill="#b91c1c" />
      <circle cx="34" cy="22" r="4.5" fill="#d43a3a" />
      <circle cx="30" cy="16" r="4.5" fill="#9f1d1d" />
    </svg>
  );
}
