// Warmteo LP — shared UI primitives
// All component files share a global scope (Babel scripts), so we export to window at the end.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ────────── Brand tokens ──────────
const WARMTEO = {
  signal: '#ffd60a',
  signal50: '#fffbe6',
  signal600: '#c79d00',
  ink: '#0b0d11',
  ink2: '#14171d',
  ink3: '#1c2029',
  ink4: '#262b35',
  bone: '#f6f6f4',
  bone2: '#ececea',
  line: '#e5e5e3',
  lineDark: '#2a2f3a',
  mint: '#b7e4c7',
  mintDeep: '#1f6b3b',
  safety: '#ff6a00',
  danger: '#e0392f',
  whatsapp: '#25D366',
};

// ────────── Photo placeholder ──────────
// "industrial striped" placeholder per default-aesthetic guidance
function PhotoSlot({ label, ratio = '4/3', tone = 'dark', stamp, src, alt, className = '', style = {} }) {
  const isDark = tone === 'dark';
  const bg = isDark ? WARMTEO.ink2 : WARMTEO.bone2;
  const stripe = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const fg = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(11,13,17,0.55)';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const hasImg = Boolean(src);
  return (
    <div
      className={`photo-slot ${className}`}
      style={{
        position: 'relative',
        aspectRatio: ratio,
        background: hasImg ? bg : `repeating-linear-gradient(135deg, ${bg} 0 14px, ${stripe} 14px 28px)`,
        border: `1px solid ${border}`,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        ...style,
      }}>
      {hasImg && (
        <img
          src={src}
          alt={alt || label || ''}
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center', display: 'block',
          }}
        />
      )}
      {!hasImg && (
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em',
        color: fg, textTransform: 'uppercase', textAlign: 'center', padding: 16,
      }}>
        <div>
          <div style={{ opacity: 0.6, fontSize: 9, marginBottom: 4 }}>// FOTO</div>
          <div style={{ fontWeight: 600, fontSize: 11 }}>{label}</div>
        </div>
      </div>
      )}
      {stamp && (
        <div style={{
          position: 'absolute', left: 12, bottom: 12,
          background: WARMTEO.ink, color: '#fff',
          padding: '4px 8px', fontFamily: 'var(--font-mono)', fontSize: 9,
          letterSpacing: '0.14em', textTransform: 'uppercase',
        }}>
          ● {stamp}
        </div>
      )}
    </div>
  );
}

// ────────── Mono tag (technical sticker) ──────────
function MonoTag({ children, color, bg, style = {} }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em',
      textTransform: 'uppercase', fontWeight: 500,
      color: color || WARMTEO.ink, background: bg || 'transparent',
      padding: bg ? '6px 10px' : 0,
      ...style,
    }}>{children}</span>
  );
}

// ────────── Section header (small) ──────────
function SectionEyebrow({ num, label, dark = false }) {
  return null;
}

// ────────── Count-up hook ──────────
function useCountUp(target, { duration = 1400, start = false } = {}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf, t0;
    const tick = (t) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return val;
}

// ────────── In-view hook ──────────
function useInView(opts = { threshold: 0.3 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, opts);
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

// ────────── Highlighter (marker) ──────────
function Marker({ children, onDark = false }) {
  return (
    <span style={{
      background: WARMTEO.signal,
      color: WARMTEO.ink,
      padding: '0 0.15em',
      boxDecorationBreak: 'clone',
      WebkitBoxDecorationBreak: 'clone',
    }}>{children}</span>
  );
}

// ────────── Primary CTA ──────────
function PrimaryCTA({ children, onClick, large = false, style = {}, disabled = false }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 0 0 2px ' + WARMTEO.ink + ', 0 18px 40px -10px rgba(255,214,10,0.65), 0 0 0 6px rgba(255,214,10,0.18)';
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 0 0 2px ' + WARMTEO.ink + ', 0 10px 28px -8px rgba(255,214,10,0.45), 0 0 0 4px rgba(255,214,10,0.12)';
      }}
      style={{
        appearance: 'none',
        border: 'none',
        background: WARMTEO.signal,
        color: WARMTEO.ink,
        padding: large ? '20px 28px' : '16px 22px',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: large ? 17 : 15,
        letterSpacing: '-0.005em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 0 0 2px ' + WARMTEO.ink + ', 0 10px 28px -8px rgba(255,214,10,0.45), 0 0 0 4px rgba(255,214,10,0.12)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease',
        ...style,
      }}>
      {children}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </button>
  );
}

// ────────── Secondary CTA ──────────
function SecondaryCTA({ children, onClick, dark = false, large = false, icon = null, style = {} }) {
  return (
    <button onClick={onClick} style={{
      appearance: 'none',
      background: 'transparent',
      border: `1.5px solid ${dark ? 'rgba(255,255,255,0.4)' : WARMTEO.ink}`,
      color: dark ? '#fff' : WARMTEO.ink,
      padding: large ? '20px 28px' : '15px 20px',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: large ? 17 : 14.5,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      transition: 'background 0.15s',
      ...style,
    }}
      onMouseEnter={(e) => e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      {icon}{children}
    </button>
  );
}

// ────────── WhatsApp Glyph ──────────
function WhatsAppGlyph({ size = 18, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color || WARMTEO.whatsapp}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
    </svg>
  );
}

Object.assign(window, {
  WARMTEO, PhotoSlot, MonoTag, SectionEyebrow,
  useCountUp, useInView, Marker, PrimaryCTA, SecondaryCTA, WhatsAppGlyph,
});
