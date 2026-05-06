// Warmteo LP — Header + Hero + Offer Sticker
// Depends on globals exported by components.jsx

const HEADER_H = 80; // bar height; keep in sync with Hero section paddingTop below

// ────────── Sticky Header ──────────
function Header({ variant, onCTA, onVariantChange }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const segBtn = (key, label) => (
    <button
      type="button"
      onClick={() => onVariantChange(key)}
      style={{
        padding: '6px 11px',
        fontFamily: 'var(--font-mono)',
        fontSize: 9.5,
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        background: variant === key ? WARMTEO.ink : 'transparent',
        color: variant === key ? '#fff' : WARMTEO.ink2,
        transition: 'background 0.15s ease, color 0.15s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: HEADER_H,
      background: '#fff',
      borderBottom: scrolled ? `1px solid ${WARMTEO.line}` : '1px solid transparent',
      transition: 'border-color 0.2s',
    }}>
      <div className="hd-bar" style={{
        maxWidth: 1280, margin: '0 auto', height: '100%',
        padding: '0 32px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
        alignItems: 'center',
        columnGap: 16,
      }}>
        <div className="hd-brand" style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', minWidth: 0 }}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{
              lineHeight: 0,
              textDecoration: 'none',
              display: 'block',
              flexShrink: 0,
            }}
            aria-label="Warmteo"
          >
            <img
              src="assets/warmteo-logo.png"
              alt="Warmteo"
              style={{
                height: 64,
                width: 'auto',
                display: 'block',
                filter: 'invert(1)',
              }}
              decoding="async"
            />
          </a>
        </div>
        <nav
          className="hd-nav-links"
          aria-label="Hauptnavigation"
          style={{
            display: 'flex', alignItems: 'center', gap: 24,
            justifySelf: 'center',
          }}
        >
          <a href="#realitaet" style={navLink}>Team</a>
          <a href="#vergleich" style={navLink}>Vergleich</a>
          <a href="#proof" style={navLink}>Referenzen</a>
          <a href="#faq" style={navLink}>FAQ</a>
        </nav>

        {/* switcher + CTA: separate from centered links so layout stays balanced */}
        <div className="hd-right" style={{ display: 'flex', alignItems: 'center', gap: 16, justifySelf: 'end' }}>
          {onVariantChange && (
            <div
              className="hd-variant-switch"
              role="group"
              aria-label="Landing-Variante (provisorisch)"
              title="Provisorischer Wechsel Aktion / Partner"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: 3,
                background: 'rgba(11,13,17,0.05)',
                borderRadius: 10,
                border: `1px solid ${WARMTEO.line}`,
                flexShrink: 0,
              }}
            >
              {segBtn('aktion', '500 €')}
              {segBtn('partner', 'Partner')}
            </div>
          )}
          <button
            type="button"
            onClick={onCTA}
            className="hd-bar-cta"
            style={{
              appearance: 'none', border: `1.5px solid ${WARMTEO.ink}`,
              background: WARMTEO.signal, color: WARMTEO.ink,
              padding: '10px 16px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
              cursor: 'pointer',
              boxShadow: '0 6px 18px -6px rgba(255,214,10,0.7)',
              flexShrink: 0,
            }}
          >
            {variant === 'aktion' ? 'Verfügbarkeit prüfen' : 'Partner werden'}
          </button>
        </div>
      </div>
    </header>
  );
}
const navLink = {
  fontFamily: 'var(--font-sans)', fontSize: 13.5, color: WARMTEO.ink2,
  textDecoration: 'none', fontWeight: 500,
};

// ────────── Offer Sticker ──────────
// Big, prominent, animated. The KEY hero element per feedback.
function OfferSticker({ variant }) {
  const isAktion = variant === 'aktion';

  // Aktion countdown to 31.05
  const [time, setTime] = useState(() => calcCountdown());
  useEffect(() => {
    if (!isAktion) return;
    const t = setInterval(() => setTime(calcCountdown()), 1000);
    return () => clearInterval(t);
  }, [isAktion]);

  function calcCountdown() {
    const now = new Date();
    const target = new Date(now.getFullYear(), 4, 31, 23, 59, 59);
    if (target < now) target.setFullYear(target.getFullYear() + 1);
    const diff = Math.max(0, target - now);
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff / 3600000) % 24),
      m: Math.floor((diff / 60000) % 60),
      s: Math.floor((diff / 1000) % 60),
    };
  }

  if (isAktion) {
    return (
      <div style={{
        position: 'relative',
        background: WARMTEO.ink,
        border: `2px solid ${WARMTEO.signal}`,
        borderRadius: 22,
        boxShadow: '0 0 0 6px rgba(255,214,10,0.18), 0 30px 60px -20px rgba(0,0,0,0.5)',
        padding: '20px 22px',
        display: 'flex', alignItems: 'stretch', gap: 22,
        flexWrap: 'wrap',
      }}>
        {/* Pulsing dot */}
        <div style={{
          position: 'absolute', top: 14, right: 16,
          display: 'none', alignItems: 'center', gap: 8,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', background: WARMTEO.signal,
            animation: 'pulse 1.6s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: WARMTEO.signal,
          }}>LIVE</span>
        </div>

        <div style={{ flex: '1 1 240px', minWidth: 220, paddingTop: 4 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: WARMTEO.signal, marginBottom: 8,
          }}>Aktions-Bonus · Mai</div>
          <div style={{
            fontFamily: 'var(--font-display)', color: '#fff',
            fontSize: 30, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em',
          }}>
            <span style={{ color: WARMTEO.signal, fontSize: 38 }}>500 €</span> Rabatt
            <div style={{ fontSize: 17, fontWeight: 500, color: 'rgba(255,255,255,0.78)', marginTop: 6, letterSpacing: 0 }}>
              auf jede Montage bis 31.05.
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: 8,
          borderLeft: '1px solid rgba(255,255,255,0.12)',
          paddingLeft: 22, alignItems: 'center',
        }}>
          {[
            { v: time.d, l: 'Tage' },
            { v: time.h, l: 'Std' },
            { v: time.m, l: 'Min' },
            { v: time.s, l: 'Sek' },
          ].map((u, i) => (
            <div key={i} style={{
              minWidth: 56, textAlign: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '8px 6px',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 22,
                color: '#fff', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
              }}>{String(u.v).padStart(2, '0')}</div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em',
                color: 'rgba(255,255,255,0.5)', marginTop: 4, textTransform: 'uppercase',
              }}>{u.l}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Partner sticker — refined
  // Partner sticker — refined, lighter, mobile-friendly
  return (
    <div style={{
      position: 'relative',
      background: WARMTEO.ink,
      border: `1.5px solid ${WARMTEO.mint}`,
      borderRadius: 18,
      boxShadow: '0 0 0 4px rgba(183,228,199,0.14), 0 22px 50px -22px rgba(0,0,0,0.45)',
      padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: 16,
      flexWrap: 'wrap',
      overflow: 'hidden',
    }} className="offer-sticker-partner">
      {/* decorative big 10 in background */}
      <div aria-hidden style={{
        position: 'absolute', right: -16, top: -8, bottom: -8,
        width: 160, opacity: 0.04, pointerEvents: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 150,
        color: WARMTEO.mint, lineHeight: 1, letterSpacing: '-0.05em',
      }}>10</div>

      <div style={{
        flex: '0 0 auto',
        position: 'relative',
        background: WARMTEO.mint, color: WARMTEO.mintDeep,
        width: 70, height: 70, display: 'grid', placeItems: 'center',
        borderRadius: 14,
        border: `1.5px solid ${WARMTEO.mintDeep}`,
      }} className="offer-sticker-badge">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.6l-5.9 3.07 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z"/>
        </svg>
      </div>

      <div style={{ flex: '1 1 220px', minWidth: 180, position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: WARMTEO.mint, marginBottom: 8,
          background: 'rgba(183,228,199,0.08)', padding: '3px 8px', borderRadius: 999,
          border: '1px solid rgba(183,228,199,0.22)',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: WARMTEO.mint }} />
          Partner-Deal
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', color: '#fff',
          fontSize: 'clamp(17px, 2.2vw, 21px)', fontWeight: 700,
          lineHeight: 1.2, letterSpacing: '-0.018em',
        }}>
          Jede <span style={{ color: WARMTEO.mint }}>10. Installation</span> ist <span style={{
            background: WARMTEO.mint, color: WARMTEO.mintDeep, padding: '0 7px', borderRadius: 5,
            display: 'inline-block', transform: 'rotate(-1.2deg)',
          }}>kostenlos.</span>
        </div>
      </div>
    </div>
  );
}

// ────────── HERO ──────────
function Hero({ variant, onCTA, onWA }) {
  const isAktion = variant === 'aktion';
  const headline = isAktion
    ? <>Ihre Montagekapazitäten — <Marker>gelöst in 48 Stunden.</Marker></>
    : <>Skalieren Sie Ihr <Marker>Wärmepumpen-Business</Marker> ohne Personalnot.</>;
  const sub = isAktion
    ? 'Wir übernehmen Ihre Aufträge. Profi-Montageteams mit Erfahrung aus 2.000+ Installationen sind sofort einsatzbereit.'
    : 'Erfahrene Montage-Subunternehmer für ganz Deutschland. Sofort verfügbar, eingespielt und zuverlässig.';

  return (
    <section style={{
      position: 'relative',
      paddingTop: HEADER_H,
      background: WARMTEO.ink,
      overflow: 'hidden',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* Full-bleed hero art (black left + photo right in asset) */}
      <div
        className="hero-bg"
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      />

      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '64px 32px 96px',
        position: 'relative', zIndex: 1,
        width: '100%',
      }}>
        <div style={{ maxWidth: 880 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: isAktion ? 'clamp(38px, 5.4vw, 76px)' : 'clamp(34px, 4.4vw, 62px)',
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: '-0.028em',
            color: '#fff',
            margin: 0,
            textWrap: 'balance',
          }}>
            {headline}
          </h1>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 18, lineHeight: 1.55,
            color: 'rgba(255,255,255,0.78)', marginTop: 24, marginBottom: 32,
            maxWidth: 560,
            textWrap: 'pretty',
          }}>{sub}</p>

          {/* OFFER STICKER */}
          <div style={{ marginBottom: 36, maxWidth: 640 }}>
            <OfferSticker variant={variant} />
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <PrimaryCTA large onClick={onCTA}>
              {isAktion ? 'Verfügbarkeit prüfen' : 'Partnerschaft anfragen'}
            </PrimaryCTA>
            <SecondaryCTA dark large onClick={onWA} icon={<WhatsAppGlyph size={20} />}>
              WhatsApp
            </SecondaryCTA>
          </div>

          {/* Trust row — animated stat cards */}
          <HeroTrustRow />
        </div>
      </div>
    </section>
  );
}

function HeroTrustRow() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const installs = useCountUp(2000, { duration: 1800, start: inView });
  const states = useCountUp(16, { duration: 1100, start: inView });

  const stats = [
    [`${installs.toLocaleString('de-DE')}+`, 'Installationen'],
    ['48–72h', 'Anfahrt'],
    [`${states}/16`, 'Bundesländer'],
  ];

  return (
    <div ref={ref} style={{
      marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 32,
    }}>
      {stats.map(([v, l], i) => (
        <div key={i} style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(8px)',
          transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
        }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
            color: '#fff', lineHeight: 1, letterSpacing: '-0.01em',
            fontVariantNumeric: 'tabular-nums',
          }}>{v}</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: 4,
          }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Header, Hero, OfferSticker, AktionStickyBar, PartnerStickyBar });

// ────────── Aktion Sticky Bar (desktop) ──────────
// Compact dismissible countdown that appears once user scrolls past hero.
function AktionStickyBar({ variant, onCTA }) {
  const [time, setTime] = useState(() => calcCountdownGlobal());
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem('warmteo:aktion-bar-closed') === '1'; } catch (_) { return false; }
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (variant !== 'aktion') return;
    const t = setInterval(() => setTime(calcCountdownGlobal()), 1000);
    return () => clearInterval(t);
  }, [variant]);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.7;
      const form = document.getElementById('form');
      let nearForm = false;
      if (form) {
        const rect = form.getBoundingClientRect();
        // hide once form is within ~200px of viewport bottom
        nearForm = rect.top < window.innerHeight - 120;
      }
      setVisible(past && !nearForm);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function calcCountdownGlobal() {
    const now = new Date();
    const target = new Date(now.getFullYear(), 4, 31, 23, 59, 59);
    if (target < now) target.setFullYear(now.getFullYear() + 1);
    const diff = Math.max(0, target - now);
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff / 3600000) % 24),
      m: Math.floor((diff / 60000) % 60),
      s: Math.floor((diff / 1000) % 60),
    };
  }

  if (variant !== 'aktion' || dismissed) return null;

  const close = () => {
    setDismissed(true);
    try { sessionStorage.setItem('warmteo:aktion-bar-closed', '1'); } catch (_) {}
  };

  return (
    <div
      className="aktion-sticky"
      data-show={visible ? '1' : '0'}
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 95,
        background: WARMTEO.signal,
        border: `2px solid ${WARMTEO.ink}`,
        borderRadius: 18,
        boxShadow: '0 0 0 5px rgba(255,214,10,0.30), 0 22px 60px -18px rgba(0,0,0,0.45)',
        padding: '14px 16px 14px 18px',
        alignItems: 'center', gap: 18,
        cursor: 'pointer',
        transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.25s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        pointerEvents: visible ? 'auto' : 'none',
        maxWidth: 'calc(100vw - 48px)',
      }}
      onClick={() => onCTA && onCTA()}
    >
      <div style={{ paddingRight: 4 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: WARMTEO.ink, marginBottom: 4, fontWeight: 700,
          opacity: 0.75,
        }}>Aktions-Bonus · Mai</div>
        <div style={{
          fontFamily: 'var(--font-display)', color: WARMTEO.ink,
          fontSize: 19, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.015em',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ fontSize: 24, fontWeight: 800 }}>500 €</span> Rabatt
        </div>
      </div>

      <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(11,13,17,0.18)' }} />

      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { v: time.d, l: 'T' },
          { v: time.h, l: 'Std' },
          { v: time.m, l: 'Min' },
          { v: time.s, l: 'Sek' },
        ].map((u, i) => (
          <div key={i} style={{
            minWidth: 40, textAlign: 'center',
            background: WARMTEO.ink,
            border: `1px solid ${WARMTEO.ink}`,
            borderRadius: 9,
            padding: '6px 4px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15,
              color: '#fff', fontVariantNumeric: 'tabular-nums', lineHeight: 1,
            }}>{String(u.v).padStart(2, '0')}</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 7.5, letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.55)', marginTop: 3, textTransform: 'uppercase',
            }}>{u.l}</div>
          </div>
        ))}
      </div>

      <button
        aria-label="Schließen"
        onClick={(e) => { e.stopPropagation(); close(); }}
        style={{
          appearance: 'none', background: 'rgba(11,13,17,0.08)',
          border: '1px solid rgba(11,13,17,0.25)', borderRadius: 999,
          width: 26, height: 26, cursor: 'pointer',
          display: 'grid', placeItems: 'center',
          color: WARMTEO.ink,
          fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, lineHeight: 1,
          marginLeft: 4, padding: 0,
          transition: 'all 0.18s ease',
        }}
        className="aktion-sticky-close"
      >×</button>
    </div>
  );
}

// ────────── Partner Sticky Bar (desktop) ──────────
// Compact dismissible deal-badge that appears once user scrolls past hero.
function PartnerStickyBar({ variant, onCTA }) {
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem('warmteo:partner-bar-closed') === '1'; } catch (_) { return false; }
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.7;
      const form = document.getElementById('form');
      let nearForm = false;
      if (form) {
        const rect = form.getBoundingClientRect();
        nearForm = rect.top < window.innerHeight - 120;
      }
      setVisible(past && !nearForm);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (variant !== 'partner' || dismissed) return null;

  const close = () => {
    setDismissed(true);
    try { sessionStorage.setItem('warmteo:partner-bar-closed', '1'); } catch (_) {}
  };

  return (
    <div
      className="aktion-sticky"
      data-show={visible ? '1' : '0'}
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 95,
        background: WARMTEO.ink,
        border: `2px solid ${WARMTEO.mint}`,
        borderRadius: 18,
        boxShadow: '0 0 0 5px rgba(183,228,199,0.20), 0 22px 60px -18px rgba(0,0,0,0.55)',
        padding: '14px 16px 14px 14px',
        alignItems: 'center', gap: 14,
        cursor: 'pointer',
        transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.25s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        pointerEvents: visible ? 'auto' : 'none',
        maxWidth: 'calc(100vw - 48px)',
      }}
      onClick={() => onCTA && onCTA()}
    >
      {/* Deal icon badge */}
      <div style={{
        flex: '0 0 auto',
        background: WARMTEO.mint, color: WARMTEO.mintDeep,
        width: 50, height: 50, display: 'grid', placeItems: 'center',
        borderRadius: 12,
        border: `1.5px solid ${WARMTEO.mintDeep}`,
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.6l-5.9 3.07 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z"/>
        </svg>
      </div>

      <div style={{ paddingRight: 4 }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: WARMTEO.mint, marginBottom: 4, fontWeight: 700,
          opacity: 0.85,
        }}>Partner-Deal</div>
        <div style={{
          fontFamily: 'var(--font-display)', color: '#fff',
          fontSize: 17, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.015em',
          whiteSpace: 'nowrap',
        }}>
          Jede <span style={{ color: WARMTEO.mint }}>10. Montage</span> gratis
        </div>
      </div>

      <button
        aria-label="Schließen"
        onClick={(e) => { e.stopPropagation(); close(); }}
        style={{
          appearance: 'none', background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.22)', borderRadius: 999,
          width: 26, height: 26, cursor: 'pointer',
          display: 'grid', placeItems: 'center',
          color: '#fff',
          fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, lineHeight: 1,
          marginLeft: 2, padding: 0,
          transition: 'all 0.18s ease',
        }}
        className="aktion-sticky-close"
      >×</button>
    </div>
  );
}
