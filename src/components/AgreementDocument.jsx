import {
  EVENT,
  FINAL_MISSION_TEXT,
  FOOTER_TEXT,
  PLEDGE_PARAGRAPHS,
  budgetAmount,
  formatJmd,
} from '../config.js';

function Holly({ style }) {
  return (
    <svg viewBox="0 0 60 40" width="64" height="42" style={{ position: 'absolute', ...style }} aria-hidden="true">
      <path d="M30 22 C 22 6, 6 10, 2 18 C 8 18, 8 24, 14 24 C 12 28, 18 32, 30 22 Z" fill="#16614a" />
      <path d="M30 22 C 38 6, 54 10, 58 18 C 52 18, 52 24, 46 24 C 48 28, 42 32, 30 22 Z" fill="#0f4d38" />
      <circle cx="26" cy="22" r="4.5" fill="#b91c1c" />
      <circle cx="34" cy="22" r="4.5" fill="#9f1d1d" />
      <circle cx="30" cy="16" r="4.5" fill="#b91c1c" />
    </svg>
  );
}

function Star({ size = 14, color = '#b8892f' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" fill={color} />
    </svg>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 16, borderBottom: '1.5px dotted #9a9a9a', padding: '7px 0' }}>
      <div
        style={{
          width: 230,
          flexShrink: 0,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#0f4d38',
          paddingTop: 2,
        }}
      >
        {label}
      </div>
      <div style={{ flex: 1, fontSize: 15.5, fontWeight: 600, color: '#1c1c1c', lineHeight: 1.35, wordBreak: 'break-word' }}>
        {value}
      </div>
    </div>
  );
}

export default function AgreementDocument({ answers }) {
  const budget = budgetAmount(answers);

  return (
    <article
      className="agreement"
      style={{ position: 'relative', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', inset: 18, border: '4px double #0f4d38' }} />
      <div style={{ position: 'absolute', inset: 30, border: '1.5px dashed #9f1d1d' }} />
      <Holly style={{ top: 10, left: 10, transform: 'rotate(-30deg)' }} />
      <Holly style={{ top: 10, right: 10, transform: 'rotate(30deg)' }} />
      <Holly style={{ bottom: 10, left: 10, transform: 'rotate(-150deg)' }} />
      <Holly style={{ bottom: 10, right: 10, transform: 'rotate(150deg)' }} />

      <div
        style={{
          position: 'absolute',
          inset: '46px 52px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <header style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <Star size={12} />
            <Star size={16} color="#9f1d1d" />
            <Star size={12} />
          </div>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#0f4d38',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            NOT SO SECRET SANTA
          </h1>
          <p
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontStyle: 'italic',
              fontSize: 21,
              color: '#9f1d1d',
              margin: '6px 0 0',
            }}
          >
            Official Christmas Agreement {EVENT.year}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px auto 0', width: 360 }}>
            <span style={{ flex: 1, height: 1.5, background: '#b8892f' }} />
            <Star size={14} />
            <span style={{ flex: 1, height: 1.5, background: '#b8892f' }} />
          </div>
        </header>

        <section>
          <Row label="Event Period" value={EVENT.period} />
          <Row label="Gift Budget" value={budget ? formatJmd(budget) : '—'} />
          <Row label="Gifts" value="1" />
          <Row label="Notes / Cards" value={`${answers.cards} (at least 1 handwritten note)`} />
        </section>

        <section
          style={{
            border: '1.5px solid #0f4d38',
            borderRadius: 10,
            padding: '16px 24px',
            background: 'rgba(15, 77, 56, 0.035)',
          }}
        >
          <h2
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 21,
              fontWeight: 700,
              color: '#0f4d38',
              textAlign: 'center',
              margin: '0 0 8px',
            }}
          >
            The Secret Santa Pledge
          </h2>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 14, lineHeight: 1.55, color: '#222' }}>
            <p style={{ margin: '0 0 6px' }}>
              I, <span style={{ display: 'inline-block', width: 230, borderBottom: '1px solid #333' }}>&nbsp;</span>,{' '}
              {PLEDGE_PARAGRAPHS[0]}
            </p>
            <p style={{ margin: '0 0 6px' }}>{PLEDGE_PARAGRAPHS[1]}</p>
            <p style={{ margin: 0 }}>{PLEDGE_PARAGRAPHS[2]}</p>
          </div>
        </section>

        <section style={{ display: 'flex', gap: 40, padding: '10px 0 18px' }}>
          {['Signature', 'Date'].map((label) => (
            <div key={label} style={{ flex: label === 'Signature' ? 1.6 : 1 }}>
              <div style={{ height: 56, borderBottom: '1.5px solid #1c1c1c' }} />
              <p style={{ margin: '8px 0 0', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#0f4d38' }}>
                {label.toUpperCase()}
              </p>
            </div>
          ))}
        </section>

        <section
          style={{
            border: '2.5px solid #9f1d1d',
            borderRadius: 10,
            padding: '14px 22px',
            textAlign: 'center',
            outline: '1px dashed #9f1d1d',
            outlineOffset: 4,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, letterSpacing: '0.08em', color: '#9f1d1d' }}>
            YOUR FINAL MISSION 🎯
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: 15, lineHeight: 1.5, fontWeight: 600, color: '#1c1c1c' }}>
            {FINAL_MISSION_TEXT}
          </p>
        </section>

        <footer style={{ textAlign: 'center', fontSize: 11.5, color: '#555', letterSpacing: '0.04em' }}>
          {FOOTER_TEXT} 🎅
        </footer>
      </div>
    </article>
  );
}
