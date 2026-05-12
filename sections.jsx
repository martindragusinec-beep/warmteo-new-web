// Warmteo LP — Sections: Reality (team), Comparison, Cost-vs-Internal, Proof, FAQ, Form

/** Query na lokální JPG/PNG: Browser cachuje / starý `sections.jsx` sonst keine neuen Fotos. Bei Asset-Tausch hochsetzen. */
const ASSET_BUST = '?v=w3-20260521';
const bust = (path) => (path && path.includes('?') ? path : path + ASSET_BUST);

/** Google reCAPTCHA v3 vor Absenden — liefert null ohne Site-Key (Demo). Secret niemals im Client. */
async function fetchRecaptchaToken() {
  const siteKey = (typeof window !== 'undefined' && (window.WARMTEO_RECAPTCHA_SITE_KEY || '').trim()) || '';
  if (!siteKey) return null;
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    const gr = typeof window !== 'undefined' ? window.grecaptcha : undefined;
    if (gr && typeof gr.ready === 'function') {
      return new Promise((resolve, reject) => {
        gr.ready(() => {
          gr.execute(siteKey, { action: 'warmteo_form_submit' }).then(resolve).catch(reject);
        });
      });
    }
    await new Promise((r) => setTimeout(r, 80));
  }
  throw new Error('reCAPTCHA nicht geladen (Script blockiert?). Bitte Seite neu laden.');
}

// ────────── 02 · REALITY (Team + Realisations merged) ──────────
const REALITY_ITEMS = [
  { kind: 'photo', label: 'Markus · Team-Lead', stamp: 'TEAM-LEAD', big: true,
    quote: '„Wir reden nicht.\nWir schrauben."',
    src: 'assets/realitaet-monteur-waermepumpen-aussen.png',
    alt: 'Monteur in gelbem Shirt und schwarzer Arbeitslatzhose lehnt entspannt an einer schwarzen Luft-Wasser-Wärmepumpe vor modernem Haus mit Rasen — freundlicher Blick in die Kamera.',
    objectPosition: 'center 42%',
  },
  { kind: 'photo', label: 'Vaillant · aroTHERM plus', stamp: '2× AUSSENEINHEIT',
    meta: 'Zwei Luft-Wasser-Außeneinheiten auf Ortbeton — ausgerichtet, entkoppelt, dokumentiert montiert.',
    src: 'assets/realitaet-vaillant-arotherm-duo-aussen.jpg',
    alt: 'Parallele Außenaufstellung zweier Vaillant aroTHERM plus Luft-Wasser-Wärmepumpen auf Betonfundamenten mit Schwingungsdämpfern; dahinter dunkles Trapezblech, Gartenumfeld.',
    objectPosition: 'center 56%',
  },
  { kind: 'spec', label: 'CREW SETUP', big: '4', sub: '× Monteure', tail: 'pro Einsatzteam · zertifiziert' },
  { kind: 'photo', label: 'Wechselrichter · String-Anschluss', stamp: 'PV · DETAIL',
    meta: 'Beschriftete Leitungen · saubere Arbeit',
    src: 'assets/realitaet-pv-verkabelung.png',
    alt: 'Monteur steckt schwarze Solarkabel mit MC4-Steckern unter einen weißen Wechselrichter; beschriftete Leitungsetiketten.' },
  { kind: 'stat', label: 'LIVE · DE', big: '14', sub: 'Crews · DE', signal: true },
  { kind: 'photo', label: 'Viessmann · Außeneinheit', stamp: 'L/W AUSSEN',
    meta: 'Luft-Wasser-Gerät auf Kiesbett vor der Fassade — Leitungszuführungen und Aufstellfläche dokumentiert.',
    src: 'assets/realitaet-viessmann-luft-wasser-aussen.jpg',
    alt: 'Schwarze Viessmann-Außenluft-Wärmepumpe vor heller Hausfassade mit Kiesstreifen und kleinen Kellernfenstern.',
    objectPosition: 'center 48%',
  },
  { kind: 'photo', label: 'Außenmodul · Montage vor Ort', stamp: 'MONTAGE',
    meta: 'Geöffnete Baugruppe · Handschuhe · dokumentiert',
    src: 'assets/realitaet-wp-montage-aussen.png',
    alt: 'Techniker mit Werkzeug und Handschuhen arbeitet hockend am geöffneten grauen Außenmodul einer Wärmepumpe vor einem modernen Haus; Verkabelung und Verrohrung sichtbar.' },
  { kind: 'photo', label: 'Mitsubishi Ecodan · Heizungszentrale', stamp: 'EFH · 11 kW',
    meta: 'Ecodan Innenmodul · Speicher · gedämmte Verrohrung',
    src: 'assets/realitaet-ecodan-heizungsraum.png',
    alt: 'Heiztechnikraum mit Mitsubishi-Ecodan-Wandgerät, weißem Speicher, rotem Ausdehnungsgefäß und grau isolierter Rohrleitungsführung.' },
  { kind: 'photo', label: 'Innenmodul · Heizwand', stamp: 'TECHNIKRAUM',
    meta: 'Silbergedämmte Vorlauf-/Rücklaufstrassen, Armaturenzugänglichkeit und Kondensatführung — sauber an der Nassfliese ausgerichtet.',
    src: 'assets/realitaet-innenmodul-verrohrung.jpg',
    alt: 'Weisses Wand-Innengerät einer Wärmebereitung mit digitalem Farbdisplay, silberisolierter Verrohrung, roten Absperrkugelhähnen, seitlichem Pufferspeicher und Kondensattechnik unter dem Feld.',
    objectPosition: 'center 45%',
  },
  { kind: 'photo', label: 'NIBE F1145 · Bedienservice', stamp: 'INNENMODUL',
    meta: 'Farbdisplay · gedämmte Rohre · Manometer',
    src: 'assets/realitaet-nibe-f1145.png',
    alt: 'Techniker bedient die Steuerung einer weißen NIBE-Wärmepumpe F1145; im Hintergrund gedämmte Rohrleitungen, Manometer und weiterer Speicher.' },
  { kind: 'photo', label: 'Schlieger · Puffer & Speicher', stamp: 'KELLER · HYDRAULIK',
    meta: 'Zwei zylindrische Schlieger-Speicher mit Kupfer- und Kunststoffverrohrung, Ausdehnungsgefäßen und strukturierten Messstellen.',
    src: 'assets/realitaet-schlieger-zwei-speicher-keller.png',
    alt: 'Technikbereich mit zwei grossen beschichteten Speicherzylindern der Marke Schlieger; rotes Kugelausgleichsfass am Boden, weiteres Membranausgleichsgefäss an der Wand, Kupferverteilungen und Armaturenkreuz.',
    objectPosition: 'center 42%',
  },
  { kind: 'photo', label: 'Heiztechnik · Pufferspeicher', stamp: 'EFH · REAL',
    meta: 'Stehendes Speichervolumen mit Anschlussscheibe, isolierte Leitungstrassen zur Wandverteilung — realer Kellerraum unter Last.',
    src: 'assets/realitaet-pufferspeicher-heizraum.jpg',
    alt: 'Blick in einen bestehenden Heiztechnikraum: grosser vertikaler Pufferspeicher mit Anschlüssen und Manometer, rotes Ausdehnungsgefäss, Schaltschrank mit Sicherungen, Licht von einem Kellerfenster.',
    objectPosition: 'center 44%',
  },
];

function RealityCard({ it }) {
  const baseStyle = {
    flex: '0 0 auto',
    width: it.big ? 460 : 300,
    height: 380,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    background: it.kind === 'spec' ? WARMTEO.ink2 : WARMTEO.ink2,
    border: `1px solid ${WARMTEO.lineDark}`,
  };
  if (it.kind === 'photo') {
    return (
      <div style={baseStyle}>
        <PhotoSlot label={it.label} src={it.src ? bust(it.src) : undefined} alt={it.alt} objectPosition={it.objectPosition} tone="dark" ratio="auto" style={{ height: '100%', borderRadius: 0 }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(11,13,17,0.4) 0%, transparent 35%, transparent 60%, rgba(11,13,17,0.85) 100%)',
        }} />
        <div style={{
          position: 'absolute', top: 16, left: 16,
          background: it.stampColor || WARMTEO.signal,
          color: it.stampColor ? '#fff' : WARMTEO.ink,
          padding: '6px 10px', borderRadius: 8,
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', fontWeight: 700,
        }}>● {it.stamp}</div>
        {it.quote && (
          <div style={{
            position: 'absolute', left: 22, right: 22, bottom: 22,
            fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700,
            color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em',
            whiteSpace: 'pre-line',
            textShadow: '0 2px 24px rgba(0,0,0,0.7)',
          }}>{it.quote}</div>
        )}
        {it.meta && !it.quote && (
          <div style={{
            position: 'absolute', left: 16, right: 16, bottom: 16,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '10px 12px', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            <div style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600 }}>
              {it.meta}
            </div>
          </div>
        )}
      </div>
    );
  }
  if (it.kind === 'spec') {
    return (
      <div style={{ ...baseStyle, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <MonoTag color={WARMTEO.signal}>// {it.label}</MonoTag>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 84, fontWeight: 800,
            color: '#fff', lineHeight: 0.9, letterSpacing: '-0.04em',
          }}>{it.big}<span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 28, fontWeight: 700 }}> {it.sub}</span></div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 12 }}>
            {it.tail}
          </div>
        </div>
      </div>
    );
  }
  // stat
  return (
    <div style={{
      ...baseStyle,
      background: WARMTEO.signal,
      color: WARMTEO.ink,
      border: 'none',
      padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    }}>
      <MonoTag>// {it.label}</MonoTag>
      <div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 120, fontWeight: 800,
          color: WARMTEO.ink, lineHeight: 0.9, letterSpacing: '-0.04em',
        }}>{it.big}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 8, fontWeight: 600 }}>
          {it.sub}
        </div>
      </div>
    </div>
  );
}

function RealitySection() {
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0); // accumulated user offset in px
  const dragRef = React.useRef({ active: false, startX: 0, baseX: 0, moved: false });
  const trackRef = React.useRef(null);
  const carouselRef = React.useRef(null);
  const resumeAfterInputRef = React.useRef(null);
  const mouseInsideRef = React.useRef(false);

  // duplicate for seamless loop
  const items = [...REALITY_ITEMS, ...REALITY_ITEMS];

  // wrap dragX so user scrolling never escapes the looped track width
  const wrapDrag = (x) => {
    const el = trackRef.current;
    if (!el) return x;
    const half = el.scrollWidth / 2; // one full set width
    if (!half) return x;
    let v = x % half;
    if (v > 0) v -= half;
    return v;
  };

  const clearInputResume = () => {
    if (resumeAfterInputRef.current) {
      clearTimeout(resumeAfterInputRef.current);
      resumeAfterInputRef.current = null;
    }
  };

  const scheduleResumeAfterInput = React.useCallback(() => {
    clearInputResume();
    resumeAfterInputRef.current = setTimeout(() => {
      if (!mouseInsideRef.current) setPaused(false);
      resumeAfterInputRef.current = null;
    }, 2200);
  }, []);

  React.useEffect(() => () => clearInputResume(), []);

  React.useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onWheel = (e) => {
      let dx = e.deltaX;
      if (e.shiftKey) dx -= e.deltaY;
      else if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) dx = -e.deltaY;
      if (Math.abs(dx) < 1) return;
      e.preventDefault();
      setPaused(true);
      setDragX((x) => wrapDrag(x + dx));
      scheduleResumeAfterInput();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [scheduleResumeAfterInput]);

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    clearInputResume();
    dragRef.current = { active: true, startX: e.clientX, baseX: dragX, moved: false };
    setDragging(true);
    setPaused(true);
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 3) dragRef.current.moved = true;
    setDragX(wrapDrag(dragRef.current.baseX + dx));
  };
  const endPointerDrag = (e) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    setDragging(false);
    e?.currentTarget?.releasePointerCapture?.(e.pointerId);
    setTimeout(() => {
      if (!mouseInsideRef.current) setPaused(false);
    }, 600);
  };

  const ARROW_STEP = 320;
  const onCarouselKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPaused(true);
      setDragX((x) => wrapDrag(x + ARROW_STEP));
      scheduleResumeAfterInput();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPaused(true);
      setDragX((x) => wrapDrag(x - ARROW_STEP));
      scheduleResumeAfterInput();
    }
  };
  return (
    <section id="realitaet" style={{
      background: WARMTEO.ink,
      color: '#fff',
      padding: '120px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes realityScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .reality-track { animation: realityScroll 60s linear infinite; }
        .reality-track.paused { animation-play-state: paused; }
        .reality-carousel:focus { outline: none; }
        .reality-carousel:focus-visible {
          outline: 2px solid ${WARMTEO.signal};
          outline-offset: 4px;
        }
      `}</style>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
        <h2 style={headingStyle('dark')}>
          Echte Monteure.<br />
          <span style={{ color: WARMTEO.signal }}>Echte Baustellen.</span>
        </h2>
        <p style={{ ...paraStyle('dark'), maxWidth: 560, marginBottom: 56 }}>
          Keine Stockfotos, keine Agentur-Models. Das ist unser Team — auf der Baustelle,
          im Schmutz, mit Werkzeug in der Hand.
        </p>
      </div>

      {/* Marquee track — Ziehen, Mausrad (vertikal/Shift+Rad), Pfeiltasten nach Fokus (Tab) */}
      <div
        ref={carouselRef}
        className="reality-carousel"
        role="region"
        aria-label="Referenzfotos — seitwärts mit der Maus ziehen (oder Mausrad / Pfeiltasten nach Tab)"
        tabIndex={0}
        onKeyDown={onCarouselKeyDown}
        onMouseEnter={() => {
          mouseInsideRef.current = true;
          if (!dragRef.current.active) setPaused(true);
        }}
        onMouseLeave={() => {
          mouseInsideRef.current = false;
          if (!dragRef.current.active) setPaused(false);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointerDrag}
        onPointerCancel={endPointerDrag}
        onLostPointerCapture={() => {
          if (!dragRef.current.active) return;
          dragRef.current.active = false;
          setDragging(false);
        }}
        style={{
          position: 'relative',
          maskImage: 'linear-gradient(90deg, transparent 0, black 60px, black calc(100% - 60px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0, black 60px, black calc(100% - 60px), transparent 100%)',
          cursor: dragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          WebkitUserSelect: 'none', userSelect: 'none',
        }}>
        <div style={{
          transform: `translateX(${dragX}px)`,
          width: 'max-content',
          /* Drag und Auto-Animation trennen: Äußeres translate (Hand), inneres nur Keyframes */
        }}>
        <div
          ref={trackRef}
          className={`reality-track${paused ? ' paused' : ''}`}
          style={{
            display: 'flex', gap: 16, width: 'max-content',
            paddingLeft: 32,
          }}>
          {items.map((it, i) => <RealityCard key={i} it={it} />)}
        </div>
        </div>
      </div>
    </section>
  );
}

// ────────── Inline Section CTA (button at end of a section, inside its container) ──────────
function SectionCTA({ children, onCTA }) {
  return (
    <div style={{
      marginTop: 56,
      display: 'flex', justifyContent: 'center',
    }}>
      <PrimaryCTA large onClick={onCTA}>{children}</PrimaryCTA>
    </div>
  );
}

// ────────── Inline CTA Block ──────────
function InlineCTA({ tone = 'light', eyebrow, headline, sub, primary = 'Verfügbarkeit prüfen', secondary, onPrimary, onSecondary }) {
  const dark = tone === 'dark';
  return (
    <div style={{
      background: dark ? WARMTEO.ink : '#fff',
      color: dark ? '#fff' : WARMTEO.ink,
      border: `1.5px solid ${dark ? 'rgba(255,255,255,0.10)' : 'rgba(11,13,17,0.08)'}`,
      borderRadius: 26,
      padding: 'clamp(28px, 4vw, 44px) clamp(24px, 4vw, 48px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 32, flexWrap: 'wrap',
      boxShadow: dark ? '0 30px 60px -30px rgba(0,0,0,0.55)' : '0 22px 50px -28px rgba(11,13,17,0.18)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* decorative dot */}
      <div aria-hidden style={{
        position: 'absolute', right: -60, top: -60,
        width: 200, height: 200, borderRadius: '50%',
        background: WARMTEO.signal, opacity: dark ? 0.14 : 0.18, filter: 'blur(10px)',
      }} />
      <div style={{ flex: '1 1 360px', minWidth: 260, position: 'relative', zIndex: 1 }}>
        {eyebrow && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: dark ? WARMTEO.signal : 'rgba(11,13,17,0.55)',
            fontWeight: 600, marginBottom: 10,
          }}>{eyebrow}</div>
        )}
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.8vw, 32px)',
          fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.02em', margin: 0,
        }}>{headline}</h3>
        {sub && (
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: 15.5, lineHeight: 1.55,
            color: dark ? 'rgba(255,255,255,0.7)' : WARMTEO.ink3,
            margin: '12px 0 0', maxWidth: 540,
          }}>{sub}</p>
        )}
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        <PrimaryCTA large onClick={onPrimary}>{primary}</PrimaryCTA>
        {secondary && (
          <button onClick={onSecondary} style={{
            appearance: 'none', cursor: 'pointer',
            background: 'transparent',
            color: dark ? '#fff' : WARMTEO.ink,
            border: `1.5px solid ${dark ? 'rgba(255,255,255,0.3)' : 'rgba(11,13,17,0.2)'}`,
            borderRadius: 999,
            padding: '14px 22px',
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14.5,
            letterSpacing: '-0.005em',
            transition: 'all 0.18s ease',
          }} className="inline-cta-secondary">
            {secondary}
          </button>
        )}
      </div>
    </div>
  );
}

// ────────── 03 · COMPARISON (Problem vs Solution) ──────────
function ComparisonSection({ variant, onCTA }) {
  const [side, setSide] = useState('loesung');
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => setSide((s) => (s === 'problem' ? 'loesung' : 'problem')), 4000);
    return () => clearInterval(t);
  }, [autoplay]);

  const pickSide = (k) => { setAutoplay(false); setSide(k); };

  const problems = [
    'Aufträge ablehnen wegen Kapazität',
    'Personalsuche dauert Monate',
    'Reklamationen fressen die Marge',
    'Wachstum scheitert am Bottleneck',
  ];
  const solutions = [
    'Eingespielte Crews — sofort verfügbar',
    'Anfahrt binnen 48–72 Stunden',
    '2.000+ saubere Installationen',
    'Bundesweit · pay-per-Anlage',
  ];

  const isProblem = side === 'problem';

  return (
    <section style={{
      background: WARMTEO.bone, padding: '120px 32px', position: 'relative',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 48 }}>
          <h2 style={{ ...headingStyle('light'), maxWidth: 720, margin: 0 }}>
            Heute sagen Sie ab.<br />
            <span style={{ color: WARMTEO.mintDeep }}>Morgen sagen Sie zu.</span>
          </h2>
          {/* Segmented switch with sliding pill */}
          <div className="cmp-switch" style={{
            position: 'relative',
            display: 'inline-flex', background: '#fff',
            border: `1.5px solid ${WARMTEO.ink}`, padding: 4, borderRadius: 999,
            minWidth: 340,
            maxWidth: '100%',
          }}>
            <div style={{
              position: 'absolute', top: 4, bottom: 4,
              left: isProblem ? 4 : '50%',
              width: 'calc(50% - 4px)',
              background: isProblem ? WARMTEO.danger : WARMTEO.mintDeep,
              borderRadius: 999,
              transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s',
              zIndex: 0,
            }} />
            {[
              { k: 'problem', l: 'Ohne uns' },
              { k: 'loesung', l: 'Mit Warmteo' },
            ].map((o) => (
              <button key={o.k} onClick={() => pickSide(o.k)} style={{
                position: 'relative', zIndex: 1,
                appearance: 'none', border: 'none', cursor: 'pointer',
                padding: '12px 28px', flex: 1,
                background: 'transparent',
                color: side === o.k ? '#fff' : WARMTEO.ink,
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13.5,
                letterSpacing: '0.02em',
                transition: 'color 0.2s',
              }}>{o.l}</button>
            ))}
          </div>
        </div>

        {/* Card with face background + flipping rows */}
        <div className="cmp-card" style={{
          position: 'relative',
          border: `2px solid ${WARMTEO.ink}`,
          borderRadius: 28,
          background: isProblem ? '#2a1010' : '#0d2418',
          minHeight: 520,
          overflow: 'hidden',
          transition: 'background 0.4s ease',
        }}>
          {/* face photo placeholder filling left */}
          <div className="cmp-face" style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%',
            opacity: 1,
            transition: 'all 0.4s ease',
            filter: isProblem ? 'grayscale(0.15) contrast(1.05)' : 'saturate(1.06) contrast(1.02)',
          }}>
            {isProblem ? (
              <img
                src={bust('assets/comparison-stress.png')}
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  display: 'block',
                }}
                decoding="async"
              />
            ) : (
              <img
                src={bust('assets/comparison-happy.png')}
                alt=""
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  display: 'block',
                }}
                decoding="async"
              />
            )}
            {/* tint overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: isProblem
                ? 'linear-gradient(90deg, rgba(224,57,47,0.5), transparent)'
                : 'linear-gradient(90deg, rgba(31,107,59,0.5), transparent)',
            }} />
          </div>

          {/* big stamp */}
          <div className="cmp-stamp" style={{
            position: 'absolute', top: 28, left: 28,
            border: `3px solid ${isProblem ? WARMTEO.danger : WARMTEO.mint}`,
            color: isProblem ? WARMTEO.danger : WARMTEO.mint,
            padding: '8px 14px',
            borderRadius: 999,
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 22, letterSpacing: '0.1em',
            transform: 'rotate(-6deg)',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            zIndex: 2,
          }}>
            {isProblem ? 'ABGELEHNT' : 'ZUGESAGT'}
          </div>

          {/* List right */}
          <div className="cmp-list" style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: '55%',
            background: WARMTEO.ink,
            padding: '48px 48px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <MonoTag color={isProblem ? WARMTEO.danger : WARMTEO.mint} style={{ marginBottom: 18 }}>
              {isProblem ? '// IHR ALLTAG OHNE UNS' : '// IHR ALLTAG MIT UNS'}
            </MonoTag>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(isProblem ? problems : solutions).map((t, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: isProblem ? 'rgba(224,57,47,0.08)' : 'rgba(31,107,59,0.12)',
                  border: `1px solid ${isProblem ? 'rgba(224,57,47,0.3)' : 'rgba(31,107,59,0.4)'}`,
                  fontFamily: 'var(--font-sans)', fontSize: 16, color: '#fff',
                  fontWeight: 500,
                  animation: `slideIn 0.4s ease ${i * 0.06}s both`,
                }}>
                  <span style={{
                    flex: '0 0 auto',
                    width: 26, height: 26,
                    background: isProblem ? WARMTEO.danger : WARMTEO.mintDeep,
                    color: '#fff',
                    display: 'grid', placeItems: 'center',
                    borderRadius: '50%',
                    fontWeight: 800, fontSize: 16,
                  }}>
                    {isProblem ? '✕' : '✓'}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <SectionCTA onCTA={onCTA}>
          {variant === 'aktion' ? 'Aktion sichern · 500 € Rabatt' : 'Partner werden'}
        </SectionCTA>
      </div>
    </section>
  );
}

// ────────── 04 · COST VS INTERNAL TEAM ──────────
function CostSection({ variant, onCTA }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const internalCost = useCountUp(486000, { duration: 1600, start: inView });
  const ourCost = useCountUp(0, { duration: 600, start: inView });

  // "alarm" fires after counter finishes — card turns red, stamp slams in
  const [alarm, setAlarm] = React.useState(false);
  React.useEffect(() => {
    if (!inView) { setAlarm(false); return; }
    const t = setTimeout(() => setAlarm(true), 1700);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <section id="vergleich" ref={ref} style={{
      background: WARMTEO.bone2, padding: '120px 32px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionEyebrow num="04" label="Eigenes Team vs. Warmteo" />
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 56 }}>
          <h2 style={{ ...headingStyle('light'), maxWidth: 720, margin: 0 }}>
            Pay-per-Anlage statt<br />
            <Marker>fixe Lohnkosten.</Marker>
          </h2>
          <p style={{ ...paraStyle('light'), maxWidth: 380, margin: 0 }}>
            Was ein 4-köpfiges internes Montageteam jährlich kostet — und was Sie mit Warmteo
            stattdessen flexibel bezahlen.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="cost-grid">
          {/* INTERN — red */}
          <div className={alarm ? 'cost-alarm-on' : ''} style={{
            background: '#fff',
            border: `2px solid ${alarm ? WARMTEO.danger : WARMTEO.ink}`,
            borderRadius: 24,
            padding: '36px 32px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: alarm ? '0 0 0 6px rgba(232,72,72,0.14), 0 30px 60px -20px rgba(232,72,72,0.35)' : '0 0 0 0 rgba(232,72,72,0)',
            transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
            animation: alarm ? 'cost-shake 0.5s ease-out' : 'none',
          }}>
            <MonoTag color={alarm ? WARMTEO.danger : WARMTEO.ink3}>// INTERN · 4 MONTEURE</MonoTag>
            <div style={{ marginTop: 24, display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'clamp(48px, 6vw, 84px)', lineHeight: 1,
                color: alarm ? WARMTEO.danger : WARMTEO.ink,
                letterSpacing: '-0.03em',
                fontVariantNumeric: 'tabular-nums',
                transition: 'color 0.5s ease',
              }}>
                {internalCost.toLocaleString('de-DE')} €
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: alarm ? WARMTEO.danger : WARMTEO.ink3, letterSpacing: '0.14em', transition: 'color 0.5s ease' }}>/JAHR</div>
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, color: WARMTEO.ink3, marginTop: 8 }}>
              Lohn · Lohnnebenkosten · Fahrzeug · Werkzeug · Schulung
            </div>

            <ul style={costListStyle('red')}>
              {[
                'Fixkosten — auch bei leeren Monaten',
                'Recruiting 6–9 Monate, kein Garantie-Fit',
                'Krankheitstage = ausfallende Aufträge',
                'Reklamationen fressen die Marge',
              ].map((t, i) => (
                <li key={i} style={costItem(WARMTEO.danger)}>
                  <span style={{ color: WARMTEO.danger, fontWeight: 700, fontSize: 18 }}>✕</span>
                  {t}
                </li>
              ))}
            </ul>

            {/* "REJECTED" stamp */}
            <div className="cost-stamp" style={{
              position: 'absolute', top: 28, right: 24,
              border: `3px solid ${WARMTEO.danger}`,
              color: WARMTEO.danger,
              padding: '6px 12px',
              borderRadius: 999,
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 18, letterSpacing: '0.1em',
              transform: alarm ? 'rotate(8deg) scale(1)' : 'rotate(40deg) scale(2.4)',
              opacity: alarm ? 1 : 0,
              transition: 'transform 0.45s cubic-bezier(.5,1.6,.4,1), opacity 0.3s ease',
            }}>NICHT SKALIERBAR</div>
          </div>

          {/* WARMTEO — green */}
          <div className={alarm ? 'cost-win-on' : ''} style={{
            background: WARMTEO.ink,
            color: '#fff',
            border: `2px solid ${WARMTEO.signal}`,
            borderRadius: 24,
            padding: '36px 32px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: alarm
              ? '0 30px 60px -20px rgba(0,0,0,0.5), 0 0 0 8px rgba(255,214,10,0.28), 0 0 60px rgba(255,214,10,0.35)'
              : '0 30px 60px -20px rgba(0,0,0,0.4), 0 0 0 6px rgba(255,214,10,0.1)',
            transform: alarm ? 'scale(1.05) translateY(-4px)' : (inView ? 'scale(1.02)' : 'scale(1)'),
            transition: 'transform 0.6s cubic-bezier(.5,1.5,.4,1), box-shadow 0.6s ease',
          }}>
            {/* shimmer sweep */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(105deg, transparent 30%, rgba(255,214,10,0.10) 42%, rgba(255,255,255,0.55) 50%, rgba(255,214,10,0.10) 58%, transparent 70%)',
              transform: alarm ? 'translateX(120%)' : 'translateX(-120%)',
              transition: 'transform 2.4s cubic-bezier(.4,.1,.2,1) 0.2s',
              mixBlendMode: 'screen',
            }} />
            <MonoTag color={WARMTEO.signal}>// MIT WARMTEO · FLEXIBEL</MonoTag>
            <div style={{ marginTop: 24, position: 'relative' }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'clamp(36px, 4.5vw, 60px)', lineHeight: 1,
                color: '#fff', letterSpacing: '-0.02em',
                textShadow: alarm ? '0 0 24px rgba(255,214,10,0.45)' : 'none',
                transition: 'text-shadow 0.6s ease',
              }}>
                ab <span style={{ color: WARMTEO.signal }}>5.000 €</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.14em', marginTop: 8, color: 'rgba(255,255,255,0.7)' }}>
                / WÄRMEPUMPE · MONTAGE
              </div>
              <div style={{ marginTop: 10, fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'rgba(255,255,255,0.65)' }}>
                pay-per-Anlage · 0 € Fixkosten · keine Lohnnebenkosten
              </div>
            </div>

            <ul style={costListStyle('green')}>
              {[
                'Nur bezahlen, wenn auch montiert wird',
                'Anfahrt binnen 48–72 Stunden',
                'Eingespielte Crews · 2.000+ Anlagen',
                'Bundesweite Abdeckung in DE',
              ].map((t, i) => (
                <li key={i} style={costItem(WARMTEO.signal, true)}>
                  <span style={{ color: WARMTEO.signal, fontWeight: 700, fontSize: 18 }}>✓</span>
                  {t}
                </li>
              ))}
            </ul>

            <div data-cost-stamp-win="1" style={{
              position: 'absolute', top: 28, right: 24,
              background: WARMTEO.signal, color: WARMTEO.ink,
              border: `3px solid ${WARMTEO.ink}`,
              padding: '6px 12px',
              borderRadius: 999,
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 18, letterSpacing: '0.1em',
              transform: alarm ? 'rotate(-6deg) scale(1.1)' : 'rotate(6deg) scale(1)',
              boxShadow: alarm ? '0 0 0 4px rgba(255,214,10,0.3)' : 'none',
              transition: 'transform 0.5s cubic-bezier(.5,1.6,.4,1) 0.15s, box-shadow 0.5s ease',
              animation: alarm ? 'cost-win-pulse 1.6s ease-in-out 0.6s infinite' : 'none',
            }}>SKALIERBAR</div>
          </div>
        </div>

        <SectionCTA onCTA={onCTA}>Kostenloser Rechen-Vergleich</SectionCTA>
      </div>
    </section>
  );
}

const costListStyle = (kind) => ({
  listStyle: 'none', padding: 0, marginTop: 28,
  display: 'flex', flexDirection: 'column', gap: 10,
  borderTop: `1px solid ${kind === 'green' ? 'rgba(255,255,255,0.1)' : WARMTEO.line}`,
  paddingTop: 20,
});
const costItem = (color, dark = false) => ({
  display: 'flex', alignItems: 'flex-start', gap: 12,
  fontFamily: 'var(--font-sans)', fontSize: 15.5,
  color: dark ? 'rgba(255,255,255,0.92)' : WARMTEO.ink2,
  fontWeight: 500,
  lineHeight: 1.4,
});

// ────────── 05 · PROOF — Logos & Realisations ──────────
function ProofSection({ variant, onCTA }) {
  /** Marken-Logos als lokale SVGs (teilw. Wikimedia Commons; Mitsubishi/Panasonic Simple Icons). */
  const brands = [
    { name: 'Viessmann', logo: 'assets/brands/viessmann.svg' },
    { name: 'Vaillant', logo: 'assets/brands/vaillant.svg' },
    { name: 'Bosch', logo: 'assets/brands/bosch.svg' },
    { name: 'Daikin', logo: 'assets/brands/daikin.svg' },
    { name: 'Mitsubishi Electric', logo: 'assets/brands/mitsubishi.svg' },
    { name: 'Panasonic', logo: 'assets/brands/panasonic.svg' },
    { name: 'Buderus', logo: 'assets/brands/buderus.png' },
    // Kein Logo — Platzhalter wie „u. a.“
    { name: 'Weitere Marken', more: true },
  ];
  const cases = [
    {
      city: 'Außen',
      kw: 'Montage',
      img: 'assets/carousel-crew-outdoor.png',
      model: 'Crew & Aufstellung',
      blurb: 'Koordination auf der Baustelle — von der Lieferung bis zu den ersten Rohr- und Elektroanschlüssen.',
      type: 'Team · Logistik',
      days: 2,
    },
    {
      city: 'Keller',
      kw: 'Hydraulik',
      img: 'assets/realisation-pufferspeicher.png',
      model: 'Pufferspeicher & Rohrnetz',
      blurb: 'Isolierte Leitungen, Expansionsgefäß und saubere Anbindung im Technikraum.',
      type: 'Bestand · EFH',
      days: 3,
    },
    {
      city: 'Garten',
      kw: 'L/W',
      img: 'assets/carousel-unit-outdoor.png',
      model: 'Außeneinheit im Betrieb',
      blurb: 'Luft-Wasser-Gerät auf Fundament — typische Montage bei Kundenprojekten.',
      type: 'Luft / Wasser',
      days: 2,
    },
    {
      city: 'System',
      kw: 'Reflex',
      img: 'assets/carousel-buffer-reflex.png',
      model: 'Speicher-Integration',
      blurb: 'Hydraulische Einbindung für stabilen Vorlauf — nach Plan und Herstellervorgabe.',
      type: 'Puffer · Heizung',
      days: 3,
    },
    {
      city: 'TWW',
      kw: 'Speicher',
      img: 'assets/carousel-tank-silver.png',
      model: 'Brauchwarmwasser-Speicher',
      blurb: 'Stehendes Volumen im Technikraum — Zirkulation und Frischwasser sauber dokumentiert, Armaturen beschriftet, Übergabe unter Last möglich.',
      type: 'Trinkwasser',
      days: 2,
    },
    {
      city: 'Elektro',
      kw: 'PV+Speicher',
      img: 'assets/realisation-solar-battery.png',
      model: 'Wechselrichter & Batteriespeicher',
      blurb: 'Übersichtliche Verdrahtung, Schutzorgane und saubere Trassenführung an der Wand.',
      type: 'SolarEdge · AC/DC',
      days: 4,
    },
    {
      city: 'Innen',
      kw: 'IVT',
      img: 'assets/realisation-ivt-innen.png',
      model: 'Innenstation Wärmepumpe',
      blurb: 'IVT-Aufstellung mit Druckausgleich, Filtration und beschrifteter Hydraulik.',
      type: 'Heizungsraum',
      days: 3,
    },
  ];

  return (
    <section id="proof" style={{ background: '#fff', padding: '120px 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionEyebrow num="05" label="Referenzen · 2.000+ Anlagen" />
        <h2 style={{ ...headingStyle('light'), marginBottom: 48 }}>
          Wir montieren <span style={{ background: WARMTEO.signal, padding: '0 0.1em' }}>diese Marken.</span>
        </h2>

        {/* Brand logos row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
          border: `1px solid ${WARMTEO.line}`, marginBottom: 80,
        }} className="brand-grid">
          {brands.map((b, i) => (
            <div key={b.name} style={{
              borderRight: (i + 1) % 4 !== 0 ? `1px solid ${WARMTEO.line}` : 'none',
              borderBottom: i < 4 ? `1px solid ${WARMTEO.line}` : 'none',
              padding: '22px 18px',
              minHeight: 88,
              display: 'grid', placeItems: 'center',
              transition: 'background 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = WARMTEO.bone; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {b.more ? (
                <p style={{
                  margin: 0,
                  maxWidth: '12em',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: 1.25,
                  letterSpacing: '-0.015em',
                  color: WARMTEO.ink3,
                  textAlign: 'center',
                }}>
                  u. a.<br />weitere Marken
                </p>
              ) : (
              <img
                src={bust(b.logo)}
                alt={b.name}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="brand-logo-img"
                style={{
                  maxWidth: 'min(160px, 100%)',
                  maxHeight: 44,
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
              )}
            </div>
          ))}
        </div>

        {/* Case grid */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ ...headingStyle('light'), fontSize: 'clamp(28px, 3vw, 40px)', margin: 0 }}>
            Letzte Einsätze.
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="case-grid">
          {cases.map((c, i) => (
            <article key={c.img || i} style={{
              border: `1px solid ${WARMTEO.line}`,
              background: '#fff',
              transition: 'transform 0.25s, box-shadow 0.25s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 40px -16px rgba(0,0,0,0.18)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ position: 'relative', aspectRatio: '4/3', background: WARMTEO.bone2, overflow: 'hidden' }}>
                {c.img ? (
                  <img
                    src={bust(c.img)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <PhotoSlot label={`${c.model} · ${c.city}`} ratio="4/3" tone="light" style={{ height: '100%', borderRadius: 0 }} />
                )}
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  background: WARMTEO.ink, color: '#fff',
                  padding: '4px 10px',
                  fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', fontWeight: 600,
                }}>● {c.city.toUpperCase()}</div>
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  background: WARMTEO.signal, color: WARMTEO.ink,
                  padding: '4px 10px',
                  fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', fontWeight: 700,
                }}>{c.kw}</div>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: WARMTEO.ink, letterSpacing: '-0.01em' }}>
                  {c.model}
                </div>
                {c.blurb && (
                  <p style={{
                    margin: '8px 0 0',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: WARMTEO.ink3,
                  }}>{c.blurb}</p>
                )}
                <div style={{
                  marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderTop: `1px solid ${WARMTEO.line}`, paddingTop: 10, marginTop: 12,
                }}>
                  <MonoTag>{c.type}</MonoTag>
                  <MonoTag color={WARMTEO.mintDeep}>● {c.days} Tage</MonoTag>
                </div>
              </div>
            </article>
          ))}
        </div>

        <SectionCTA onCTA={onCTA}>Verfügbarkeit prüfen</SectionCTA>
      </div>
    </section>
  );
}

// ────────── 06 · FAQ ──────────
function FAQSection() {
  const items = [
    { q: 'Wie schnell können Sie starten?', a: 'In der Regel binnen 48–72 Stunden. Nach dem ersten Kapazitäts-Check geben wir Ihnen ein verbindliches Startdatum für den ersten Einsatz.' },
    { q: 'In welchen Regionen sind Sie aktiv?', a: 'Bundesweit — alle 16 Bundesländer. Unsere Crews sind über DE verteilt; Anfahrt und Übernachtung sind im Tagessatz enthalten.' },
    { q: 'Wie läuft die erste Zusammenarbeit ab?', a: 'Kurzes Telefonat oder WhatsApp · Kapazitäts-Check und Region-Abgleich · erster Probe-Einsatz · danach Rahmenvertrag mit fixen Konditionen.' },
    { q: 'Was kostet eine Montage konkret?', a: 'Pay-per-Anlage ab 5.000 € netto, je nach Modell und Aufwand. Bei Volumen ab 5 Anlagen/Monat gibt es Staffelpreise. Keine Fixkosten, keine Bereitschaftspauschale.' },
    { q: 'Welche Marken montieren Sie?', a: 'Alle gängigen DE-Hersteller: Viessmann, Vaillant, Bosch, Daikin, Mitsubishi, Panasonic, Buderus, Wolf u.a.' },
    { q: 'Wie ist das mit Reklamationen?', a: 'Wir übernehmen die volle Verantwortung für die Montagequalität. Reklamationen werden binnen 5 Werktagen vor Ort geprüft und behoben — ohne Zusatzkosten.' },
  ];
  const [open, setOpen] = useState(new Set([0, 1]));
  const toggle = (i) => {
    setOpen((s) => {
      const n = new Set(s);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };
  return (
    <section id="faq" style={{ background: WARMTEO.bone, padding: '120px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionEyebrow num="06" label="Bevor Sie fragen" />
        <h2 style={{ ...headingStyle('light'), marginBottom: 48 }}>Die häufigsten Fragen.</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map((it, i) => {
            const isOpen = open.has(i);
            return (
              <div
                key={i}
                className="faq-card"
                data-open={isOpen ? '1' : '0'}
                style={{
                  background: isOpen ? '#fff' : 'rgba(255,255,255,0.55)',
                  border: `1.5px solid ${isOpen ? WARMTEO.ink : 'rgba(11,13,17,0.12)'}`,
                  borderRadius: 22,
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  boxShadow: isOpen ? '0 18px 40px -22px rgba(11,13,17,0.25)' : 'none',
                }}
              >
                <button onClick={() => toggle(i)} style={{
                  width: '100%', appearance: 'none', border: 'none', background: 'transparent',
                  textAlign: 'left', cursor: 'pointer', borderRadius: 0,
                  padding: '22px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(17px, 2vw, 22px)',
                    color: WARMTEO.ink, letterSpacing: '-0.01em',
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(11,13,17,0.45)', marginRight: 14, fontWeight: 500 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {it.q}
                  </span>
                  <span className="faq-plus" style={{
                    flex: '0 0 auto', width: 36, height: 36, borderRadius: 999,
                    border: `1.5px solid ${WARMTEO.ink}`,
                    background: isOpen ? WARMTEO.signal : 'transparent',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.25s ease',
                  }}>
                    <span style={{
                      display: 'block',
                      fontSize: 20, fontWeight: 600, lineHeight: 1,
                      fontFamily: 'var(--font-sans)',
                      transform: isOpen ? 'rotate(45deg)' : 'none',
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      marginTop: -2,
                    }}>+</span>
                  </span>
                </button>
                <div style={{
                  display: 'grid',
                  gridTemplateRows: isOpen ? '1fr' : '0fr',
                  transition: 'grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{
                      fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.6,
                      color: WARMTEO.ink3, padding: '0 24px 24px 62px', margin: 0,
                      maxWidth: 820,
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? 'translateY(0)' : 'translateY(-6px)',
                      transition: 'opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s',
                    }}>{it.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ────────── 07 · MULTI-STEP FORM ──────────
// Vereinfachte Querstreifen oben → unten (ohne Wappen). Quellen: Landesflaggen / Landesfarben.
const BUNDESLAENDER = [
  { code: 'BW', name: 'Baden-Württemberg', stripes: ['#000000', '#FFCC00'] },
  { code: 'BY', name: 'Bayern', stripes: ['#FFFFFF', '#0066B3'] },
  { code: 'BE', name: 'Berlin', stripes: ['#E3000F', '#FFFFFF', '#E3000F'] },
  { code: 'BB', name: 'Brandenburg', stripes: ['#E3000F', '#FFFFFF'] },
  { code: 'HB', name: 'Bremen', stripes: ['#E3000F', '#FFFFFF', '#E3000F', '#FFFFFF'] },
  { code: 'HH', name: 'Hamburg', stripes: ['#E3000F', '#FFFFFF'] },
  { code: 'HE', name: 'Hessen', stripes: ['#E3000F', '#FFFFFF'] },
  { code: 'MV', name: 'Mecklenburg-Vorpommern', stripes: ['#005CA9', '#FFFFFF', '#FFD300', '#FFFFFF', '#E3000F'] },
  { code: 'NI', name: 'Niedersachsen', stripes: ['#000000', '#E3000F', '#FFCC00'] },
  { code: 'NW', name: 'Nordrhein-Westfalen', stripes: ['#1F8A4C', '#FFFFFF', '#E3000F'] },
  { code: 'RP', name: 'Rheinland-Pfalz', stripes: ['#000000', '#E3000F', '#FFCC00'] },
  { code: 'SL', name: 'Saarland', stripes: ['#000000', '#E3000F', '#FFCC00'] },
  { code: 'SN', name: 'Sachsen', stripes: ['#FFFFFF', '#1F8A4C'] },
  { code: 'ST', name: 'Sachsen-Anhalt', stripes: ['#FFCC00', '#000000'] },
  { code: 'SH', name: 'Schleswig-Holstein', stripes: ['#005CA9', '#FFFFFF', '#E3000F'] },
  { code: 'TH', name: 'Thüringen', stripes: ['#FFFFFF', '#E3000F'] },
];

function FlagStripes({ stripes, w = 32, h = 22 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 4, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      border: '1px solid rgba(0,0,0,0.18)', flex: '0 0 auto',
    }}>
      {stripes.map((c, i) => (
        <div key={i} style={{ flex: 1, background: c }} />
      ))}
    </div>
  );
}

function FormSection({ variant }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ volume: '', land: '', plz: '', firma: '', name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState('idle'); // idle | loading | success | error
  const [submitError, setSubmitError] = useState('');
  const update = (k, v) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  // ── Validators ──
  const validatePLZ = (plz) => {
    const trimmed = (plz || '').trim();
    if (!/^\d{5}$/.test(trimmed)) return false;
    const n = parseInt(trimmed, 10);
    // German PLZ valid range: 01067 (Dresden) – 99998 (Körner)
    return n >= 1067 && n <= 99998;
  };
  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
  const validatePhone = (p) => {
    const cleaned = p.replace(/[\s\-()/.]/g, '');
    return /^\+?\d{7,15}$/.test(cleaned);
  };

  const validateStep = (s) => {
    const errs = {};
    if (s === 0 && !data.volume) errs.volume = 'Bitte Volumen wählen';
    if (s >= 1) {
      if (!data.land) errs.land = 'Bundesland erforderlich';
      if (!data.plz.trim()) errs.plz = 'PLZ erforderlich';
      else if (!validatePLZ(data.plz)) errs.plz = 'Ungültige PLZ (5 Ziffern, z.B. 80331)';
    }
    if (s === 2) {
      if (!data.firma.trim()) errs.firma = 'Firma erforderlich';
      if (!data.name.trim()) errs.name = 'Name erforderlich';
      if (!validateEmail(data.email)) errs.email = 'Gültige E-Mail erforderlich';
      if (!validatePhone(data.phone)) errs.phone = 'Gültige Telefonnummer erforderlich';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitForm = async () => {
    if (!validateStep(2)) return;
    setSubmitState('loading');
    setSubmitError('');
    const webhookUrl = (window.WARMTEO_WEBHOOK_URL || '').trim();
    let recaptchaToken = null;
    try {
      recaptchaToken = await fetchRecaptchaToken();
    } catch (capErr) {
      console.error('[Warmteo Form] reCAPTCHA', capErr);
      setSubmitError(capErr.message || 'reCAPTCHA');
      setSubmitState('error');
      return;
    }
    const payload = {
      ...data,
      variant,
      submittedAt: new Date().toISOString(),
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      referrer: document.referrer || null,
      ...(recaptchaToken ? { recaptchaToken } : {}),
    };
    try {
      if (!webhookUrl) {
        // Demo mode: log + simulate success
        console.log('[Warmteo Form] No webhook configured, demo payload:', payload);
        await new Promise((r) => setTimeout(r, 700));
        setSubmitState('success');
        return;
      }
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmitState('success');
    } catch (err) {
      console.error('[Warmteo Form] submit failed', err);
      setSubmitError(err.message || 'Unbekannter Fehler');
      setSubmitState('error');
    }
  };

  const isAktion = variant === 'aktion';
  const formCTA = isAktion ? 'Anfrage senden · 500 € Rabatt' : 'Partnerschaft anfragen';

  const volumes = ['1–5', '5–10', '10–20', '20+'];

  const fc = isAktion ? {
    title: (
      <>
        Aktuell <span className="form-slot-pulse">nur 1 Slot</span> für neue Partner.
      </>
    ),
    lead: (
      <>
        Aktuell haben wir Kapazität für nur 1 neuen Partner. Sichern Sie sich Ihren Termin.{' '}
        Für die <strong style={{ color: WARMTEO.signal }}>500&nbsp;€-Aktion</strong> füllen Sie die Schritte aus — Bestätigung binnen{' '}
        <strong style={{ color: WARMTEO.signal }}>24&nbsp;Stunden</strong>.
      </>
    ),
    step1: 'Schritt 1 · Monatliches Montagevolumen',
    step2: 'Schritt 2 · Ihre Einsatzregion',
    step3: 'Schritt 3 · Kontakt für Rabatt & Rückruf',
    hStep1: 'Wie viele Anlagen pro Monat planen Sie?',
    hStep2: 'In welchem Bundesland liegen Ihre Einsätze?',
    hStep3: 'Wie erreichen wir Sie für Rabatt und Termin?',
    successLead: (
      <>
        Wir prüfen Ihre Angaben und die Aktionsbedingungen — Rückruf in der Regel binnen{' '}
        <strong style={{ color: WARMTEO.signal }}>24&nbsp;Stunden</strong>, meist per WhatsApp oder Telefon.
      </>
    ),
  } : {
    title: (
      <>
        Aktuell <span className="form-slot-pulse">nur 1 Slot</span> für neue Partner.
      </>
    ),
    lead: (
      <>
        Aktuell haben wir Kapazität für nur 1 neuen Partner. Sichern Sie sich Ihren Termin.{' '}
        Antwort binnen <strong style={{ color: WARMTEO.signal }}>24&nbsp;Stunden</strong>.
      </>
    ),
    step1: 'Schritt 1 · Monatliches Volumen',
    step2: 'Schritt 2 · Region der Einsätze',
    step3: 'Schritt 3 · Kontakt',
    hStep1: 'Wie viele Anlagen pro Monat?',
    hStep2: 'In welchem Bundesland?',
    hStep3: 'Wer ist Ihr Ansprechpartner?',
    successLead: (
      <>
        Wir melden uns mit den nächsten Schritten zur Partnerschaft — in der Regel binnen{' '}
        <strong style={{ color: WARMTEO.signal }}>24&nbsp;Stunden</strong>, meist per WhatsApp oder Telefon.
      </>
    ),
  };

  return (
    <section id="form" style={{ background: WARMTEO.ink, color: '#fff', padding: '120px 32px', position: 'relative' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h2 style={{ ...headingStyle('dark'), marginBottom: 16 }}>
          {fc.title}
        </h2>
        <p style={{ ...paraStyle('dark'), marginBottom: 36, maxWidth: 620 }}>
          {fc.lead}
        </p>

        <div className="form-guide-wrap" aria-hidden="true">
          <svg className="form-guide-arrow" width="48" height="58" viewBox="0 0 48 58" fill="none">
            <path d="M12 14l12 13 12-13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 29l12 13 12-13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
          </svg>
        </div>

        <div style={{
          background: WARMTEO.ink2,
          border: `2px solid ${WARMTEO.signal}`,
          borderRadius: 22,
          padding: '40px 44px',
          boxShadow: '0 0 0 6px rgba(255,214,10,0.10), 0 30px 80px -24px rgba(255,214,10,0.20)',
          position: 'relative',
        }}>
          {/* progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            {[0, 1, 2].map((i) => (
              <React.Fragment key={i}>
                <div style={{
                  width: 32, height: 32, borderRadius: 999,
                  background: step >= i ? WARMTEO.signal : 'transparent',
                  border: `1.5px solid ${step >= i ? WARMTEO.signal : WARMTEO.lineDark}`,
                  color: step >= i ? WARMTEO.ink : 'rgba(255,255,255,0.5)',
                  display: 'grid', placeItems: 'center',
                  fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13,
                  transition: 'all 0.2s',
                }}>{i + 1}</div>
                {i < 2 && <div style={{ flex: 1, height: 1, background: step > i ? WARMTEO.signal : WARMTEO.lineDark, transition: 'background 0.2s' }} />}
              </React.Fragment>
            ))}
          </div>

          {step === 0 && (
            <div>
              <div style={formLabel}>{fc.step1}</div>
              <h3 style={formH}>{fc.hStep1}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }} className="vol-grid">
                {volumes.map((v) => {
                  const active = data.volume === v;
                  return (
                    <button
                      key={v}
                      className="vol-card"
                      data-active={active ? '1' : '0'}
                      onClick={() => { update('volume', v); setTimeout(() => setStep(1), 220); }}
                      style={{
                        appearance: 'none', cursor: 'pointer',
                        padding: '24px 16px', borderRadius: 14,
                        background: active ? WARMTEO.signal : 'transparent',
                        color: active ? WARMTEO.ink : '#fff',
                        border: `1.5px solid ${active ? WARMTEO.signal : WARMTEO.lineDark}`,
                        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24,
                        letterSpacing: '-0.01em', textAlign: 'center',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      {v}
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', marginTop: 4, fontWeight: 500, opacity: 0.7 }}>
                        ANLAGEN/MONAT
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div style={formLabel}>{fc.step2}</div>
              <h3 style={formH}>{fc.hStep2}</h3>

              {/* Desktop: grid karet s vlajkami */}
              <div className="land-grid-desktop" style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
                marginBottom: 20,
              }}>
                {BUNDESLAENDER.map((l) => {
                  const active = data.land === l.code;
                  return (
                    <button key={l.code} className="land-card" data-active={active ? '1' : '0'} onClick={() => update('land', l.code)} style={{
                      appearance: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 10,
                      background: active ? WARMTEO.signal : 'rgba(255,255,255,0.04)',
                      color: active ? WARMTEO.ink : '#fff',
                      border: `1px solid ${active ? WARMTEO.signal : WARMTEO.lineDark}`,
                      fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                      textAlign: 'left',
                      transition: 'all 0.18s ease',
                    }}>
                      <FlagStripes stripes={l.stripes} />
                      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {l.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile: native dropdown */}
              <div className="land-select-mobile" style={{ position: 'relative', marginBottom: 16 }}>
                <select
                  className="form-select"
                  value={data.land}
                  onChange={(e) => update('land', e.target.value)}
                  style={{
                    ...inputStyle,
                    appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
                    paddingRight: 48, cursor: 'pointer',
                    color: data.land ? '#fff' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  <option value="">Bundesland wählen…</option>
                  {BUNDESLAENDER.map((l) => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                  <option value="bundesweit">Bundesweit / mehrere Länder</option>
                </select>
                <div style={{
                  position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)',
                  pointerEvents: 'none', color: WARMTEO.signal, fontSize: 14,
                  fontFamily: 'var(--font-mono)', fontWeight: 700,
                }}>▾</div>
              </div>

              <input
                type="text"
                inputMode="numeric"
                name="postal-code"
                autoComplete="postal-code"
                required
                placeholder="PLZ (5 Ziffern, z.B. 80331)"
                value={data.plz}
                onChange={(e) => update('plz', e.target.value.replace(/\D/g, '').slice(0, 5))}
                className="form-input" style={{ ...inputStyle, borderColor: errors.plz ? WARMTEO.danger : inputStyle.borderColor }}
              />
              {errors.plz && <div style={errorStyle}>{errors.plz}</div>}
              {errors.land && <div style={{ ...errorStyle, marginTop: 8 }}>{errors.land}</div>}
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={formLabel}>{fc.step3}</div>
              <h3 style={formH}>{fc.hStep3}</h3>
              {submitState === 'success' ? (
                <div style={{
                  padding: '32px 28px', borderRadius: 16,
                  background: 'rgba(31,138,76,0.12)', border: `1.5px solid ${WARMTEO.mint}`,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 42, marginBottom: 12 }}>✓</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
                    Danke, {data.name.split(' ')[0] || 'wir haben Ihre Anfrage'}!
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14.5, lineHeight: 1.55 }}>
                    {fc.successLead}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="form-row">
                    <div>
                      <input type="text" placeholder="Firma / Betrieb" value={data.firma} onChange={(e) => update('firma', e.target.value)} className="form-input" style={{ ...inputStyle, borderColor: errors.firma ? WARMTEO.danger : inputStyle.borderColor, width: '100%' }} />
                      {errors.firma && <div style={errorStyle}>{errors.firma}</div>}
                    </div>
                    <div>
                      <input type="text" placeholder="Vor- und Nachname" value={data.name} onChange={(e) => update('name', e.target.value)} className="form-input" style={{ ...inputStyle, borderColor: errors.name ? WARMTEO.danger : inputStyle.borderColor, width: '100%' }} />
                      {errors.name && <div style={errorStyle}>{errors.name}</div>}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="form-row">
                    <div>
                      <input type="email" placeholder="E-Mail" value={data.email} onChange={(e) => update('email', e.target.value)} className="form-input" style={{ ...inputStyle, borderColor: errors.email ? WARMTEO.danger : inputStyle.borderColor, width: '100%' }} />
                      {errors.email && <div style={errorStyle}>{errors.email}</div>}
                    </div>
                    <div>
                      <input type="tel" placeholder="Telefon / WhatsApp" value={data.phone} onChange={(e) => update('phone', e.target.value)} className="form-input" style={{ ...inputStyle, borderColor: errors.phone ? WARMTEO.danger : inputStyle.borderColor, width: '100%' }} />
                      {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
                    </div>
                  </div>
                  {submitState === 'error' && (
                    <div style={{
                      padding: '12px 14px', borderRadius: 10,
                      background: 'rgba(229,57,53,0.10)', border: `1px solid ${WARMTEO.danger}`,
                      color: '#ffb4b1', fontSize: 13, fontFamily: 'var(--font-sans)',
                    }}>
                      Ups — Übermittlung fehlgeschlagen ({submitError}). Bitte erneut versuchen oder per WhatsApp.
                    </div>
                  )}
                  {/* GDPR notice — passive (consent by submission) */}
                  <div style={{
                    fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.55,
                    color: 'rgba(255,255,255,0.55)', marginTop: 6,
                  }}>
                    Mit dem Absenden willigen Sie ein, dass Ihre Angaben zur Bearbeitung der Anfrage gespeichert und verarbeitet werden. Details in der{' '}
                    <a href="Datenschutz.html" target="_blank" rel="noreferrer noopener" style={{ color: WARMTEO.signal, textDecoration: 'underline' }}>Datenschutzerklärung</a>.
                    Widerruf jederzeit per E-Mail an info@warmteo.de möglich.
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-sans)', fontSize: 12, lineHeight: 1.55,
                    color: 'rgba(255,255,255,0.45)', marginTop: 14,
                  }}>
                    Zum Spam-Schutz nutzen wir{' '}
                    <strong style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Google reCAPTCHA</strong>{' '}
                    (läuft im Hintergrund; kein sichtbarer Checkbox). Diese Website ist geschützt durch reCAPTCHA. Es gelten die{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer noopener" style={{ color: WARMTEO.signal, textDecoration: 'underline' }}>
                      Datenschutzerklärung
                    </a>{' '}und{' '}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer noopener" style={{ color: WARMTEO.signal, textDecoration: 'underline' }}>
                      Nutzungsbedingungen
                    </a>{' '}
                    von Google.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Nav */}
          {step > 0 && submitState !== 'success' && (
            <div style={{
              marginTop: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingTop: 24, borderTop: `1px solid ${WARMTEO.lineDark}`,
              flexWrap: 'wrap', gap: 12,
            }}>
              <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={submitState === 'loading'} style={{
                appearance: 'none', background: 'transparent',
                border: `1px solid rgba(255,255,255,0.4)`,
                borderRadius: 12,
                color: '#fff',
                padding: '12px 18px',
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13.5,
                cursor: submitState === 'loading' ? 'not-allowed' : 'pointer',
                opacity: submitState === 'loading' ? 0.5 : 1,
              }}>← Zurück</button>

              {step < 2 ? (
                <PrimaryCTA onClick={() => { if (validateStep(step)) setStep((s) => Math.min(2, s + 1)); }}>Weiter</PrimaryCTA>
              ) : (
                <PrimaryCTA large onClick={submitForm} disabled={submitState === 'loading'}>
                  {submitState === 'loading' ? 'Wird übermittelt…' : formCTA}
                </PrimaryCTA>
              )}
            </div>
          )}
        </div>

        {/* WhatsApp alt — muted, secondary to form */}
        <div style={{
          marginTop: 28, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
          padding: '18px 22px', borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.03)',
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 999,
            background: 'rgba(37,211,102,0.14)',
            display: 'grid', placeItems: 'center',
            border: '1px solid rgba(37,211,102,0.28)',
            flex: '0 0 auto',
          }}>
            <WhatsAppGlyph size={18} color="#25D366" />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.005em' }}>
              Lieber direkt schreiben?
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              WhatsApp an Justin · Antwort meist binnen 1 Stunde
            </div>
          </div>
          <a href="https://wa.me/?text=Hallo%20Justin" target="_blank" style={{
            textDecoration: 'none',
            background: 'transparent', color: 'rgba(255,255,255,0.85)',
            padding: '10px 16px', borderRadius: 999,
            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13.5,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            border: '1px solid rgba(255,255,255,0.18)',
            transition: 'all 0.18s ease',
          }} className="wa-cta-btn">
            <WhatsAppGlyph size={13} color="#25D366" /> Chat starten
          </a>
        </div>
      </div>
    </section>
  );
}


const formLabel = {
  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em',
  textTransform: 'uppercase', color: WARMTEO.signal, marginBottom: 8, fontWeight: 600,
};
const formH = {
  fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700,
  letterSpacing: '-0.02em', color: '#fff', margin: '0 0 24px',
};
const inputStyle = {
  width: '100%', appearance: 'none',
  background: WARMTEO.ink3, color: '#fff',
  border: `1.5px solid ${WARMTEO.lineDark}`,
  padding: '16px 18px',
  fontFamily: 'var(--font-sans)', fontSize: 16,
  outline: 'none', boxSizing: 'border-box',
};
const errorStyle = {
  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em',
  color: '#ff8a87', marginTop: 6, fontWeight: 600,
};

// ────────── Footer ──────────
function Footer() {
  const colLabel = {
    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.42)', marginBottom: 14,
  };
  const linkStyle = {
    display: 'block', color: 'rgba(255,255,255,0.78)', textDecoration: 'none',
    fontSize: 14, lineHeight: 1.85, transition: 'color 0.15s',
  };
  const onEnter = (e) => (e.currentTarget.style.color = WARMTEO.signal);
  const onLeave = (e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.78)');

  return (
    <footer style={{ background: WARMTEO.ink2, color: '#fff', padding: '64px 32px 28px', borderTop: `1px solid ${WARMTEO.lineDark}` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>

        <div className="footer-cols" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40 }}>
          {/* Brand col */}
          <div>
            <div style={{ marginBottom: 16, lineHeight: 0 }}>
              <img
                src={bust('assets/warmteo-logo.png')}
                alt="Warmteo"
                style={{ height: 56, width: 'auto', display: 'block' }}
                decoding="async"
              />
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0, maxWidth: 280 }}>
              Wir sind die Montagepartner für Heizungsbauer und Wärmepumpen-Anbieter in Deutschland. Über 7.000 erfolgreiche Installationen.
            </p>
          </div>

          {/* Kontakt */}
          <div>
            <div style={colLabel}>Kontakt</div>
            <a href="tel:+4991195423189" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>+49 911 9542 3189</a>
            <a href="mailto:info@warmteo.de" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>info@warmteo.de</a>
            <span style={{ ...linkStyle, color: 'rgba(255,255,255,0.55)' }}>Mo–Fr · 8–18 Uhr</span>
          </div>

          {/* Programm */}
          <div>
            <div style={colLabel}>Programm</div>
            <a href="#angebot" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>Aktion 500 €</a>
            <a href="#partner" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>Partner-Programm</a>
            <a href="#faq" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>FAQ</a>
          </div>

          {/* Rechtliches */}
          <div>
            <div style={colLabel}>Rechtliches</div>
            <a href="Impressum.html" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>Impressum</a>
            <a href="Datenschutz.html" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>Datenschutz</a>
            <a href="Datenschutz-Bewerber.html" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>Datenschutz Bewerber</a>
            <a href="AGB.html" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>AGB</a>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14,
          paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)',
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.42)',
        }}>
          <span>© 2026 Warmteo Deutschland GmbH · Alle Rechte vorbehalten</span>
        </div>

      </div>
    </footer>
  );
}

// ────────── Helpers ──────────
function headingStyle(tone) {
  return {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(34px, 4.5vw, 56px)',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    lineHeight: 1.05,
    color: tone === 'dark' ? '#fff' : WARMTEO.ink,
    margin: '0 0 16px',
    textWrap: 'balance',
  };
}
function paraStyle(tone) {
  return {
    fontFamily: 'var(--font-sans)',
    fontSize: 17, lineHeight: 1.55,
    color: tone === 'dark' ? 'rgba(255,255,255,0.7)' : WARMTEO.ink3,
  };
}

Object.assign(window, {
  RealitySection,
  ComparisonSection,
  CostSection,
  ProofSection,
  FAQSection,
  FormSection,
  Footer,
  InlineCTA,
  SectionCTA,
});
