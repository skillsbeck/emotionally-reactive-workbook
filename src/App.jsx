import { useState, useEffect, useRef, useCallback } from 'react';
import { days, weeks } from './data';
import { supabase } from './supabase';

/* ── Theme ── */
const T = {
  navy: '#1e3a5f', navyLight: '#2a4d73', cream: '#f5f0e8', creamDark: '#ede6d8',
  gold: '#c8a84e', goldMuted: '#b89a3e', warmGray: '#a39887',
  textDark: '#2c2418', textMid: '#5a4e3e', textLight: '#8a7e6e', white: '#fff',
  deeperBg: '#f9f6f0', deeperBorder: '#e8e0d0', green: '#5a9a6a', red: '#c45c4a',
};
const F = {
  heading: "'Playfair Display', Georgia, serif",
  body: "'Source Serif 4', Georgia, serif",
  label: "'DM Sans', 'Helvetica Neue', sans-serif",
};

/* ── Storage ── */
const KEY = 'rh_book1_v2';
const loadLocal = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const saveLocal = (d) => localStorage.setItem(KEY, JSON.stringify(d));

async function saveCloud(userId, data) {
  if (!supabase || !userId) return;
  await supabase.from('user_progress').upsert({ user_id: userId, data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
}
async function loadCloud(userId) {
  if (!supabase || !userId) return null;
  const { data } = await supabase.from('user_progress').select('data').eq('user_id', userId).single();
  return data?.data || null;
}
function mergeData(local, cloud) {
  if (!cloud) return local;
  if (!local || Object.keys(local).length === 0) return cloud;
  const merged = { ...local };
  for (const key of Object.keys(cloud)) {
    if (!merged[key]) { merged[key] = cloud[key]; continue; }
    if (typeof cloud[key] === 'object' && typeof merged[key] === 'object') {
      merged[key] = { ...merged[key] };
      for (const field of Object.keys(cloud[key])) {
        const cv = cloud[key][field]; const lv = merged[key][field];
        if (cv === true) merged[key][field] = true;
        else if (typeof cv === 'string' && typeof lv === 'string') merged[key][field] = cv.length >= lv.length ? cv : lv;
        else if (cv && !lv) merged[key][field] = cv;
      }
    }
  }
  return merged;
}

/* ══════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════ */
function LandingPage({ onGetStarted }) {
  const features = [
    "30 daily pages with teaching, reflection prompts, and practices",
    "Go Deeper sections with extended explanations and bonus prompts",
    "Auto-saving entries that sync across all your devices",
    "Progress tracking for every day",
    "Emotional Reactivity Score assessment",
    "Before & After report showing your measurable change",
  ];
  return (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(170deg, #142d4a 0%, ${T.navy} 50%, ${T.navyLight} 100%)`, padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: `${T.gold}20`, padding: '5px 18px', borderRadius: 20, marginBottom: 20, border: `1px solid ${T.gold}30` }}>
            <span style={{ fontFamily: F.label, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: T.gold, textTransform: 'uppercase' }}>30-Day Interactive Workbook</span>
          </div>
          <h1 style={{ fontFamily: F.heading, fontSize: 44, fontWeight: 700, color: T.white, margin: '0 0 16px', lineHeight: 1.15 }}>Stop Being<br/>Emotionally Reactive</h1>
          <p style={{ fontFamily: F.body, fontSize: 18, color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, margin: '0 0 32px' }}>Understand your triggers. See the pattern. Build the tools to choose how you respond — instead of reacting on autopilot.</p>
          <button onClick={onGetStarted} style={{ fontFamily: F.label, fontSize: 16, fontWeight: 600, padding: '16px 40px', color: T.navy, background: T.gold, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Get Access — $29</button>
          <p style={{ fontFamily: F.label, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 12 }}>One-time payment · Lifetime access · By Riley Hunt</p>
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: T.white, padding: '64px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontFamily: F.heading, fontSize: 28, fontWeight: 700, color: T.navy, margin: '0 0 28px' }}>Four Weeks. One Pattern at a Time.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[{ n: 1, t: 'See It', d: 'Map your triggers, body signals, and the environments feeding your reactions.', c: T.gold },
              { n: 2, t: 'Feel It', d: 'Go underneath the reaction to the fears, stories, and unmet needs driving it.', c: '#4a7fa5' },
              { n: 3, t: 'Shift It', d: 'Build practical tools — a pause, a breath, a way to name and choose.', c: T.green },
              { n: 4, t: 'Live It', d: 'Take everything into your relationships, work, and the moments that matter.', c: T.red },
            ].map(w => (
              <div key={w.n} style={{ padding: 20, borderRadius: 12, background: T.creamDark }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 16, background: `${w.c}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: F.label, fontSize: 14, fontWeight: 700, color: w.c }}>{w.n}</span>
                  </div>
                  <span style={{ fontFamily: F.label, fontSize: 13, fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: 1 }}>{w.t}</span>
                </div>
                <p style={{ fontFamily: F.body, fontSize: 14, color: T.textMid, lineHeight: 1.6, margin: 0 }}>{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What you get */}
      <div style={{ background: T.cream, padding: '64px 24px' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <h2 style={{ fontFamily: F.heading, fontSize: 28, fontWeight: 700, color: T.navy, margin: '0 0 24px' }}>What You Get</h2>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
              <span style={{ color: T.green, fontSize: 14, marginTop: 2 }}>✓</span>
              <span style={{ fontFamily: F.body, fontSize: 15, color: T.textDark, lineHeight: 1.6 }}>{f}</span>
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button onClick={onGetStarted} style={{ fontFamily: F.label, fontSize: 15, fontWeight: 600, padding: '14px 36px', color: T.white, background: T.navy, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Get Access — $29</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#142d4a', padding: '24px', textAlign: 'center' }}>
        <span style={{ fontFamily: F.label, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Riley Hunt · Pine Tree Publishers · © 2026</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   AUTH PAGE
   ══════════════════════════════════════════════ */
function AuthPage({ onSuccess, onBack }) {
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (mode === 'login') {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        onSuccess(data.session);
      } else {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        if (data.session) {
          onSuccess(data.session);
        } else {
          setError('Account created. Check your email to confirm, then sign in.');
          setMode('login');
        }
      }
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: '12px 14px', fontFamily: F.body, fontSize: 15, color: T.textDark, border: `1.5px solid ${T.warmGray}35`, borderRadius: 8, outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontFamily: F.heading, fontSize: 26, fontWeight: 700, color: T.navy, margin: '0 0 6px' }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p style={{ fontFamily: F.label, fontSize: 13, color: T.textMid, margin: 0 }}>
            {mode === 'login' ? 'Sign in to access your workbook' : 'Create an account to get started'}
          </p>
        </div>

        <div style={{ background: T.white, borderRadius: 12, padding: 28, boxShadow: '0 2px 16px rgba(30,58,95,0.06)' }}>
          <form onSubmit={handle}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: F.label, fontSize: 12, fontWeight: 600, color: T.textMid, display: 'block', marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: F.label, fontSize: 12, fontWeight: 600, color: T.textMid, display: 'block', marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={inputStyle} />
              {mode === 'signup' && <p style={{ fontFamily: F.label, fontSize: 11, color: T.textLight, margin: '6px 0 0' }}>At least 6 characters</p>}
            </div>

            {error && <div style={{ background: `${T.red}10`, border: `1px solid ${T.red}30`, borderRadius: 6, padding: '10px 14px', marginBottom: 16 }}><p style={{ fontFamily: F.label, fontSize: 12, color: T.red, margin: 0 }}>{error}</p></div>}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px 24px', fontFamily: F.label, fontSize: 14, fontWeight: 600,
              color: T.white, background: T.navy, border: 'none', borderRadius: 8,
              cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1,
            }}>{loading ? 'Working...' : mode === 'login' ? 'Sign In' : 'Create Account & Continue'}</button>
          </form>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              style={{ fontFamily: F.label, fontSize: 12, color: T.navy, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              {mode === 'login' ? 'Create an account' : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={onBack} style={{ fontFamily: F.label, fontSize: 12, color: T.textLight, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>← Back to details</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PURCHASE PAGE (starts Stripe checkout)
   ══════════════════════════════════════════════ */
function PurchasePage({ user, onSignOut }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startCheckout = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, userEmail: user.email }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { setError(data.error || 'Checkout failed. Please try again.'); setLoading(false); }
    } catch { setError('Could not connect to checkout. Please try again.'); setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: T.navy, padding: '5px 16px', borderRadius: 20, marginBottom: 16 }}>
          <span style={{ fontFamily: F.label, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: T.gold, textTransform: 'uppercase' }}>Almost There</span>
        </div>
        <h1 style={{ fontFamily: F.heading, fontSize: 26, fontWeight: 700, color: T.navy, margin: '0 0 8px' }}>Complete Your Purchase</h1>
        <p style={{ fontFamily: F.body, fontSize: 15, color: T.textMid, lineHeight: 1.6, margin: '0 0 28px' }}>
          One-time payment of $29 for lifetime access to the full 30-day interactive workbook.
        </p>

        {error && <div style={{ background: `${T.red}10`, border: `1px solid ${T.red}30`, borderRadius: 6, padding: '10px 14px', marginBottom: 16, textAlign: 'left' }}><p style={{ fontFamily: F.label, fontSize: 12, color: T.red, margin: 0 }}>{error}</p></div>}

        <button onClick={startCheckout} disabled={loading} style={{
          padding: '16px 40px', fontFamily: F.label, fontSize: 16, fontWeight: 600,
          color: T.white, background: T.navy, border: 'none', borderRadius: 8,
          cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1,
        }}>{loading ? 'Connecting to checkout...' : 'Pay $29 — Get Access →'}</button>
        <p style={{ fontFamily: F.label, fontSize: 11, color: T.textLight, marginTop: 10 }}>Secure checkout powered by Stripe</p>

        <div style={{ marginTop: 28 }}>
          <span style={{ fontFamily: F.label, fontSize: 11, color: T.textLight }}>Signed in as {user.email}</span>
          <span style={{ color: T.textLight, margin: '0 8px' }}>·</span>
          <button onClick={onSignOut} style={{ fontFamily: F.label, fontSize: 11, color: T.textLight, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Sign out</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PROCESSING PAGE (waiting for webhook)
   ══════════════════════════════════════════════ */
function ProcessingPage() {
  return (
    <div style={{ minHeight: '100vh', background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
      <div>
        <div style={{ fontSize: 36, marginBottom: 16 }}>✓</div>
        <h2 style={{ fontFamily: F.heading, fontSize: 26, fontWeight: 700, color: T.navy, margin: '0 0 8px' }}>Payment received!</h2>
        <p style={{ fontFamily: F.label, fontSize: 14, color: T.textMid }}>Setting up your access... this takes a few seconds.</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   WORKBOOK COMPONENTS (Teaching, Reflect, Practice, etc.)
   ══════════════════════════════════════════════ */
function Body({ children, style: s = {} }) { return <p style={{ fontFamily: F.body, fontSize: 17, lineHeight: 1.78, color: T.textDark, margin: '0 0 16px', ...s }}>{children}</p>; }
function Prompt({ children }) { return <p style={{ fontFamily: F.body, fontSize: 15.5, lineHeight: 1.6, color: T.textDark, fontWeight: 600, margin: '0 0 10px' }}>{children}</p>; }

function TextArea({ value, onChange, placeholder = 'Write here...', rows = 4 }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{ width: '100%', padding: 14, fontFamily: F.body, fontSize: 15, lineHeight: 1.7, color: T.textDark, background: T.white, border: `1.5px solid ${T.warmGray}35`, borderRadius: 8, resize: 'vertical', outline: 'none', boxSizing: 'border-box', marginBottom: 20 }} />;
}

function Check({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14, cursor: 'pointer' }}>
      <div onClick={onChange} style={{ width: 22, height: 22, borderRadius: 5, border: `2px solid ${checked ? T.navy : T.warmGray}`, background: checked ? T.navy : 'transparent', flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {checked && <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <span style={{ fontFamily: F.body, fontSize: 15, color: T.textDark, lineHeight: 1.5, userSelect: 'none' }}>{label}</span>
    </label>
  );
}

function Btn({ children, onClick, variant = 'primary', disabled, style: s = {} }) {
  const p = variant === 'primary';
  return <button onClick={onClick} disabled={disabled} style={{ fontFamily: F.label, fontSize: 13, fontWeight: 600, padding: '10px 22px', borderRadius: 6, cursor: disabled ? 'default' : 'pointer', color: disabled ? T.warmGray : (p ? T.white : T.navy), background: disabled ? 'transparent' : (p ? T.navy : 'transparent'), border: `1.5px solid ${disabled ? T.warmGray + '40' : (p ? T.navy : T.navy + '30')}`, transition: 'all 0.15s', ...s }}>{children}</button>;
}

function GoDeeper({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ margin: '24px 0', border: `1.5px solid ${T.deeperBorder}`, borderRadius: 10, overflow: 'hidden', background: T.deeperBg }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, color: T.gold }}>◆</span>
          <span style={{ fontFamily: F.label, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, color: T.navy, textTransform: 'uppercase' }}>{title}</span>
        </div>
        <span style={{ fontFamily: F.label, fontSize: 18, color: T.textLight, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▾</span>
      </button>
      {open && <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${T.deeperBorder}` }}>{children}</div>}
    </div>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', background: T.creamDark, borderBottom: `1px solid ${T.warmGray}20`, overflowX: 'auto' }}>
      {tabs.map((t, i) => (
        <button key={i} onClick={() => onChange(i)} style={{ fontFamily: F.label, fontSize: 13, fontWeight: active === i ? 700 : 400, padding: '14px 20px', flex: 1, color: active === i ? T.navy : T.textLight, background: active === i ? T.cream : 'transparent', border: 'none', borderBottom: active === i ? `3px solid ${T.gold}` : '3px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}>{t}</button>
      ))}
    </div>
  );
}

function TeachingText({ text }) {
  return text.split('\n\n').map((p, i) => {
    const lines = p.split('\n');
    if (lines.every(l => l.startsWith('"') || l.trim() === ''))
      return <div key={i} style={{ borderLeft: `3px solid ${T.warmGray}45`, paddingLeft: 20, margin: '20px 0' }}>{lines.filter(l => l.trim()).map((line, j) => <Body key={j} style={{ fontStyle: 'italic', color: T.textMid, marginBottom: 6 }}>{line}</Body>)}</div>;
    if (lines.length > 3 && lines.every(l => l.length < 60))
      return <div key={i} style={{ borderLeft: `3px solid ${T.warmGray}30`, paddingLeft: 20, margin: '16px 0' }}>{lines.filter(l => l.trim()).map((line, j) => <Body key={j} style={{ marginBottom: 4, fontSize: 16 }}>{line}</Body>)}</div>;
    return <Body key={i}>{p}</Body>;
  });
}

function TeachingPage({ day }) {
  return (
    <div style={{ padding: '32px 24px 40px' }}>
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontFamily: F.heading, fontSize: 60, fontWeight: 700, color: `${T.navy}12`, lineHeight: 1, display: 'block' }}>{day.day_number}</span>
        <h2 style={{ fontFamily: F.heading, fontSize: 26, fontWeight: 700, color: T.textDark, margin: '-8px 0 4px', lineHeight: 1.3 }}>{day.day_title}</h2>
        <div style={{ height: 2, width: 56, background: T.gold, marginBottom: 24 }} />
      </div>
      <div style={{ display: 'inline-block', background: T.navy, padding: '7px 16px', borderRadius: 3, marginBottom: 16 }}><span style={{ fontFamily: F.label, fontSize: 11, fontWeight: 600, letterSpacing: 2.5, color: T.gold, textTransform: 'uppercase' }}>What Is Actually Happening</span></div>
      <TeachingText text={day.teaching_text} />
      {day.why_this_matters && (
        <GoDeeper title="Go Deeper — Why This Matters">
          <Body style={{ marginTop: 16 }}>{day.why_this_matters}</Body>
          {day.example && (<><div style={{ fontFamily: F.label, fontSize: 10, fontWeight: 700, letterSpacing: 2, color: T.goldMuted, textTransform: 'uppercase', marginTop: 20, marginBottom: 8 }}>Real Example</div><div style={{ background: T.white, borderRadius: 8, padding: 16, border: `1px solid ${T.deeperBorder}` }}><Body style={{ margin: 0, fontSize: 15, color: T.textMid }}>{day.example}</Body></div></>)}
        </GoDeeper>
      )}
      <div style={{ height: 1, background: `linear-gradient(to right, ${T.gold}50, transparent)`, margin: '28px 0' }} />
      <div style={{ background: T.navy, borderRadius: 8, padding: '16px 20px' }}><span style={{ fontFamily: F.label, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: T.gold, textTransform: 'uppercase' }}>Today's Reminder</span><p style={{ fontFamily: F.body, fontSize: 15, color: 'rgba(255,255,255,0.92)', margin: '8px 0 0', lineHeight: 1.6 }}>{day.todays_reminder}</p></div>
    </div>
  );
}

function ReflectPage({ day, entries, onUpdate }) {
  let deeperPrompts = []; try { deeperPrompts = JSON.parse(day.deeper_prompts || '[]'); } catch {}
  return (
    <div style={{ padding: '32px 24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: `${T.gold}12`, borderLeft: `3px solid ${T.gold}`, borderRadius: '0 6px 6px 0', margin: '0 0 24px' }}><span style={{ fontSize: 15, color: T.gold }}>✦</span><span style={{ fontFamily: F.body, fontSize: 14, color: T.textMid, fontStyle: 'italic' }}>{day.todays_note}</span></div>
      {[['Notice', day.reflect_notice, 'notice'], ['Look Closer', day.reflect_look_closer, 'closer'], ['Connect', day.reflect_connect, 'connect']].map(([label, prompt, key]) => (
        <div key={key}>
          <div style={{ display: 'inline-block', background: T.navyLight, padding: '6px 14px', borderRadius: 3, marginBottom: 10, marginTop: 4 }}><span style={{ fontFamily: F.label, fontSize: 10.5, fontWeight: 600, letterSpacing: 2, color: T.gold, textTransform: 'uppercase' }}>{label}</span></div>
          <Prompt>{prompt}</Prompt>
          <TextArea value={entries[key] || ''} onChange={v => onUpdate({ ...entries, [key]: v })} />
        </div>
      ))}
      {deeperPrompts.length > 0 && (
        <GoDeeper title="Go Deeper — More Prompts">
          <p style={{ fontFamily: F.label, fontSize: 12, color: T.textLight, margin: '16px 0', fontStyle: 'italic' }}>Optional. Use if today's prompts left something unfinished.</p>
          {deeperPrompts.map((p, i) => (<div key={i} style={{ marginBottom: 16 }}><Prompt>{p}</Prompt><TextArea value={entries[`deeper_${i}`] || ''} onChange={v => onUpdate({ ...entries, [`deeper_${i}`]: v })} rows={3} placeholder="Optional..." /></div>))}
        </GoDeeper>
      )}
    </div>
  );
}

function PracticePage({ day, entries, onUpdate }) {
  const feels = [1,2,3,4,5,6].map(n => ({ k: `f${n}`, l: day[`today_i_feel_${n}`] }));
  const micros = [1,2,3].map(n => ({ k: `m${n}`, l: day[`micro_win_${n}`] }));
  const toggle = (k) => onUpdate({ ...entries, [k]: !entries[k] });
  return (
    <div style={{ padding: '32px 24px 40px' }}>
      <div style={{ background: T.creamDark, borderRadius: 8, padding: '18px 20px', marginBottom: 20 }}>
        <span style={{ fontFamily: F.label, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: T.goldMuted, textTransform: 'uppercase' }}>Today's Practice</span>
        <p style={{ fontFamily: F.body, fontSize: 15.5, color: T.textDark, margin: '10px 0 0', lineHeight: 1.65 }}>{day.todays_practice}</p>
      </div>
      {day.try_this && (<GoDeeper title="Go Deeper — Try This Instead (or Also)"><Body style={{ marginTop: 16, fontSize: 15 }}>{day.try_this}</Body><TextArea value={entries.try_this || ''} onChange={v => onUpdate({ ...entries, try_this: v })} placeholder="Notes..." rows={3} /></GoDeeper>)}
      <div style={{ background: T.creamDark, borderRadius: 8, padding: '18px 20px', marginBottom: 24 }}>
        <span style={{ fontFamily: F.label, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: T.goldMuted, textTransform: 'uppercase' }}>One Thing I Learned Today</span>
        <TextArea value={entries.learned || ''} onChange={v => onUpdate({ ...entries, learned: v })} placeholder="What I discovered..." rows={3} />
      </div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ flex: '1 1 220px' }}><span style={{ fontFamily: F.label, fontSize: 11, fontWeight: 700, letterSpacing: 2, color: T.navy, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Micro-Wins</span>{micros.map(m => <Check key={m.k} label={m.l} checked={!!entries[m.k]} onChange={() => toggle(m.k)} />)}</div>
        <div style={{ flex: '1 1 220px' }}><span style={{ fontFamily: F.label, fontSize: 11, fontWeight: 700, letterSpacing: 2, color: T.navy, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Today I Feel</span>{feels.map(f => <Check key={f.k} label={f.l} checked={!!entries[f.k]} onChange={() => toggle(f.k)} />)}</div>
      </div>
      <div style={{ background: T.navy, borderRadius: 8, padding: '16px 20px' }}><span style={{ fontFamily: F.label, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: T.gold, textTransform: 'uppercase' }}>Looking Ahead</span><p style={{ fontFamily: F.body, fontSize: 15, color: 'rgba(255,255,255,0.92)', margin: '8px 0 0', lineHeight: 1.6 }}>{day.looking_ahead}</p></div>
    </div>
  );
}

function DayView({ dayNum, userData, setUserData, onHome, onNav }) {
  const [tab, setTab] = useState(0);
  const day = days.find(d => parseInt(d.day_number) === dayNum);
  if (!day) return null;
  const dk = `day_${dayNum}`;
  const entries = userData[dk] || {};
  const update = (u) => setUserData({ ...userData, [dk]: u });
  const markDone = () => setUserData({ ...userData, [dk]: { ...entries, completed: true }, lastDay: dayNum });
  return (
    <div>
      <div style={{ background: T.navy, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><button onClick={onHome} style={{ background: 'none', border: 'none', color: T.gold, fontSize: 16, cursor: 'pointer' }}>←</button><span style={{ fontFamily: F.label, fontSize: 12, letterSpacing: 2, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Week {day.week_number} · {day.week_theme}</span></div>
        <span style={{ fontFamily: F.label, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: T.white, textTransform: 'uppercase' }}>Day {day.day_number}</span>
      </div>
      <Tabs tabs={['Teaching', 'Reflect', 'Practice']} active={tab} onChange={setTab} />
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {tab === 0 && <TeachingPage day={day} />}
        {tab === 1 && <ReflectPage day={day} entries={entries} onUpdate={update} />}
        {tab === 2 && <PracticePage day={day} entries={entries} onUpdate={update} />}
      </div>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="secondary" disabled={dayNum <= 1} onClick={() => { onNav(dayNum - 1); setTab(0); }}>← Day {dayNum - 1}</Btn>
          <Btn variant="secondary" disabled={dayNum >= 30} onClick={() => { onNav(dayNum + 1); setTab(0); }}>Day {dayNum + 1} →</Btn>
        </div>
        {!entries.completed ? <Btn onClick={markDone}>Mark Complete ✓</Btn> : <span style={{ fontFamily: F.label, fontSize: 13, color: T.gold, fontWeight: 600 }}>✓ Day {dayNum} Complete</span>}
      </div>
    </div>
  );
}

function HomeView({ userData, onSelect, user, onSignOut }) {
  const done = Array.from({ length: 30 }, (_, i) => userData[`day_${i + 1}`]?.completed).filter(Boolean).length;
  const pct = Math.round((done / 30) * 100);
  const wks = [{ t: 'SEE IT', s: 'Awareness', r: [1,7] }, { t: 'FEEL IT', s: 'Origin', r: [8,14] }, { t: 'SHIFT IT', s: 'Interruption', r: [15,21] }, { t: 'LIVE IT', s: 'Identity', r: [22,30] }];
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ display: 'inline-block', background: T.navy, padding: '5px 16px', borderRadius: 20, marginBottom: 16 }}><span style={{ fontFamily: F.label, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: T.gold, textTransform: 'uppercase' }}>30-Day System</span></div>
        <h1 style={{ fontFamily: F.heading, fontSize: 30, fontWeight: 700, color: T.navy, margin: '0 0 6px', lineHeight: 1.2 }}>Stop Being<br/>Emotionally Reactive</h1>
        <p style={{ fontFamily: F.label, fontSize: 13, color: T.textMid, margin: 0 }}>Understand Your Triggers. Stop Automatic Reactions.</p>
      </div>
      <div style={{ background: T.white, borderRadius: 12, padding: 24, marginBottom: 36, boxShadow: '0 2px 16px rgba(30,58,95,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}><span style={{ fontFamily: F.label, fontSize: 13, fontWeight: 600, color: T.navy }}>Your Progress</span><span style={{ fontFamily: F.label, fontSize: 24, fontWeight: 700, color: T.navy }}>{pct}%</span></div>
        <div style={{ height: 10, background: T.creamDark, borderRadius: 5, overflow: 'hidden' }}><div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(to right, ${T.navy}, ${T.gold})`, borderRadius: 5, transition: 'width 0.5s ease' }} /></div>
        <p style={{ fontFamily: F.label, fontSize: 12, color: T.textLight, margin: '8px 0 0' }}>{done} of 30 days completed</p>
      </div>
      {wks.map((wk, wi) => { const [start, end] = wk.r; const weekDone = Array.from({ length: end - start + 1 }, (_, i) => userData[`day_${start + i}`]?.completed).filter(Boolean).length; const total = end - start + 1; return (
        <div key={wi} style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontFamily: F.label, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: T.navy, textTransform: 'uppercase' }}>Week {wi + 1}</span><span style={{ fontFamily: F.label, fontSize: 11, color: T.gold, fontWeight: 600 }}>{wk.t}</span></div>
            <span style={{ fontFamily: F.label, fontSize: 11, color: T.textLight }}>{weekDone}/{total}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(82px, 1fr))', gap: 8 }}>
            {Array.from({ length: total }, (_, i) => { const dn = start + i; const d = days.find(x => parseInt(x.day_number) === dn); const c = userData[`day_${dn}`]?.completed; return (
              <button key={dn} onClick={() => onSelect(dn)} style={{ padding: '14px 8px 12px', borderRadius: 10, border: `1.5px solid ${c ? T.navy + '60' : T.warmGray + '30'}`, background: c ? `${T.navy}08` : T.white, cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontFamily: F.label, fontSize: 20, fontWeight: 700, color: c ? T.navy : T.textMid, lineHeight: 1 }}>{dn}</div>
                <div style={{ fontFamily: F.label, fontSize: 9, color: T.textLight, marginTop: 4, lineHeight: 1.3, minHeight: 22 }}>{d?.day_title?.split(' ').slice(0, 3).join(' ')}</div>
                {c && <div style={{ fontSize: 11, color: T.gold, marginTop: 3 }}>✓</div>}
              </button>
            ); })}
          </div>
        </div>
      ); })}
      <div style={{ textAlign: 'center', marginTop: 40, paddingTop: 24, borderTop: `1px solid ${T.warmGray}20` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}><div style={{ width: 8, height: 8, borderRadius: 4, background: T.green }} /><span style={{ fontFamily: F.label, fontSize: 11, color: T.textMid }}>Signed in as {user.email}</span></div>
        <p style={{ fontFamily: F.label, fontSize: 11, color: T.textLight, margin: '0 0 8px' }}>Your progress saves automatically across all your devices.</p>
        <button onClick={onSignOut} style={{ fontFamily: F.label, fontSize: 11, color: T.textLight, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Sign out</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   APP — Controls the entire flow
   ══════════════════════════════════════════════ */
export default function App() {
  const [session, setSession] = useState(undefined);
  const [access, setAccess] = useState(undefined);
  const [page, setPage] = useState('landing');
  const [userData, setUserData] = useState(loadLocal);
  const [currentDay, setCurrentDay] = useState(1);
  const [syncing, setSyncing] = useState(false);
  const saveTimer = useRef(null);

  // Auth listener
  useEffect(() => {
    if (!supabase) { setSession(null); return; }
    supabase.auth.getSession().then(({ data: { session: s } }) => setSession(s));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  // When session changes: check access + load cloud data
  useEffect(() => {
    if (!session?.user?.id) { setAccess(null); return; }

    // Check access
    fetch('/.netlify/functions/check-access', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id }),
    }).then(r => r.json()).then(d => {
      setAccess(d.hasAccess);
      if (d.hasAccess) setPage('workbook');
      else setPage('purchase');
    }).catch(() => setAccess(false));

    // Load cloud data
    setSyncing(true);
    loadCloud(session.user.id).then(cd => {
      if (cd) { const m = mergeData(loadLocal(), cd); setUserData(m); saveLocal(m); }
      setSyncing(false);
    });
  }, [session?.user?.id]);

  // Handle post-payment redirect (?paid=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('paid')) {
      setPage('processing');
      window.history.replaceState({}, '', '/');
      let attempts = 0;
      const iv = setInterval(async () => {
        attempts++;
        if (!session?.user?.id) return;
        try {
          const res = await fetch('/.netlify/functions/check-access', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session.user.id }),
          });
          const d = await res.json();
          if (d.hasAccess || attempts >= 15) {
            clearInterval(iv);
            setAccess(true);
            setPage('workbook');
          }
        } catch { if (attempts >= 15) { clearInterval(iv); setAccess(true); setPage('workbook'); } }
      }, 2000);
      return () => clearInterval(iv);
    }
  }, [session?.user?.id]);

  // Save with debounced cloud sync
  const saveData = useCallback((next) => {
    setUserData(next); saveLocal(next);
    if (session?.user?.id) {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => saveCloud(session.user.id, next), 1500);
    }
  }, [session?.user?.id]);

  const openDay = (dn) => { setCurrentDay(dn); setPage('day'); window.scrollTo(0, 0); };
  const handleSignOut = async () => { if (supabase) await supabase.auth.signOut(); setSession(null); setAccess(null); setPage('landing'); };

  // ── Render ──
  return (
    <div style={{ minHeight: '100vh', background: T.cream }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: ${T.cream}; -webkit-font-smoothing: antialiased; }
        ::selection { background: ${T.gold}30; }
        button:hover:not(:disabled) { opacity: 0.88; }
        @media (max-width: 500px) { h1 { font-size: 24px !important; } h2 { font-size: 22px !important; } }
      `}</style>

      {page === 'landing' && <LandingPage onGetStarted={() => { if (session) { if (access) setPage('workbook'); else setPage('purchase'); } else setPage('auth'); }} />}
      {page === 'auth' && <AuthPage onSuccess={(s) => { setSession(s); /* useEffect handles the rest */ }} onBack={() => setPage('landing')} />}
      {page === 'purchase' && session && <PurchasePage user={session.user} onSignOut={handleSignOut} />}
      {page === 'processing' && <ProcessingPage />}
      {page === 'workbook' && session && (
        <>
          {syncing && <div style={{ background: T.navy, padding: '6px 24px', textAlign: 'center' }}><span style={{ fontFamily: F.label, fontSize: 11, color: T.gold }}>Syncing...</span></div>}
          <HomeView userData={userData} onSelect={openDay} user={session.user} onSignOut={handleSignOut} />
        </>
      )}
      {page === 'day' && session && <DayView dayNum={currentDay} userData={userData} setUserData={saveData} onHome={() => { setPage('workbook'); window.scrollTo(0, 0); }} onNav={(dn) => { setCurrentDay(dn); window.scrollTo(0, 0); }} />}
    </div>
  );
}
