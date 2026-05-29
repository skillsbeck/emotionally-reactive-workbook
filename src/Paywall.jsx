import { useState } from 'react';
import { supabase } from './supabase';

const T = {
  navy: '#1e3a5f', cream: '#f5f0e8', creamDark: '#ede6d8',
  gold: '#c8a84e', warmGray: '#a39887',
  textDark: '#2c2418', textMid: '#5a4e3e', textLight: '#8a7e6e', white: '#fff',
  green: '#5a9a6a',
};
const F = {
  heading: "'Playfair Display', Georgia, serif",
  body: "'Source Serif 4', Georgia, serif",
  label: "'DM Sans', 'Helvetica Neue', sans-serif",
};

const features = [
  "All 30 daily pages — teaching, reflection prompts, and practices",
  "Go Deeper sections — extended explanations, real examples, and bonus prompts",
  "Auto-saving entries that sync across all your devices",
  "Progress tracking with completion status for every day",
  "Your Emotional Reactivity Score assessment",
  "Before & After report showing your measurable change",
];

export default function Paywall({ user, onSignOut }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, userEmail: user.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Could not connect to payment system. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-block', background: T.navy, padding: '5px 16px', borderRadius: 20, marginBottom: 16 }}>
            <span style={{ fontFamily: F.label, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: T.gold, textTransform: 'uppercase' }}>30-Day System</span>
          </div>
          <h1 style={{ fontFamily: F.heading, fontSize: 28, fontWeight: 700, color: T.navy, margin: '0 0 8px', lineHeight: 1.2 }}>
            Stop Being<br />Emotionally Reactive
          </h1>
          <p style={{ fontFamily: F.body, fontSize: 15, color: T.textMid, margin: '0 0 4px', lineHeight: 1.6 }}>
            Understand Your Triggers. Stop Automatic Reactions.
          </p>
          <p style={{ fontFamily: F.label, fontSize: 12, color: T.textLight }}>By Riley Hunt</p>
        </div>

        {/* Purchase card */}
        <div style={{ background: T.white, borderRadius: 14, padding: 28, boxShadow: '0 2px 20px rgba(30,58,95,0.08)', marginBottom: 20 }}>
          {/* What's included */}
          <p style={{ fontFamily: F.label, fontSize: 11, letterSpacing: 2, color: T.textLight, textTransform: 'uppercase', margin: '0 0 16px' }}>What You Get</p>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
              <span style={{ color: T.green, fontSize: 14, marginTop: 1, flexShrink: 0 }}>✓</span>
              <span style={{ fontFamily: F.body, fontSize: 14, color: T.textMid, lineHeight: 1.5 }}>{f}</span>
            </div>
          ))}

          <div style={{ height: 1, background: `${T.warmGray}20`, margin: '24px 0' }} />

          {/* Price */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
              <span style={{ fontFamily: F.heading, fontSize: 40, fontWeight: 700, color: T.navy }}>$29</span>
              <span style={{ fontFamily: F.label, fontSize: 13, color: T.textLight }}>one-time</span>
            </div>
            <p style={{ fontFamily: F.label, fontSize: 12, color: T.textLight, margin: '4px 0 0' }}>Lifetime access. No subscription.</p>
          </div>

          {error && (
            <div style={{ background: '#c45c4a10', border: '1px solid #c45c4a30', borderRadius: 6, padding: '10px 14px', marginBottom: 16 }}>
              <p style={{ fontFamily: F.label, fontSize: 12, color: '#c45c4a', margin: 0 }}>{error}</p>
            </div>
          )}

          <button onClick={handlePurchase} disabled={loading} style={{
            width: '100%', padding: '14px 24px', fontFamily: F.label, fontSize: 15, fontWeight: 600,
            color: T.white, background: T.navy, border: 'none', borderRadius: 8,
            cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
          }}>
            {loading ? 'Connecting to checkout...' : 'Get Access →'}
          </button>

          <p style={{ fontFamily: F.label, fontSize: 11, color: T.textLight, textAlign: 'center', margin: '12px 0 0' }}>
            Secure checkout powered by Stripe
          </p>
        </div>

        {/* Free preview mention */}
        <div style={{ background: `${T.gold}10`, borderLeft: `3px solid ${T.gold}`, borderRadius: '0 8px 8px 0', padding: '14px 18px', marginBottom: 20 }}>
          <p style={{ fontFamily: F.body, fontSize: 14, color: T.textMid, margin: 0, lineHeight: 1.6 }}>
            <strong>Not sure yet?</strong> Take the free Emotional Reactivity Score assessment first — it shows you exactly where your patterns are and what the workbook addresses.
          </p>
        </div>

        {/* Account info */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: F.label, fontSize: 11, color: T.textLight, margin: '0 0 6px' }}>
            Signed in as {user.email}
          </p>
          <button onClick={onSignOut} style={{
            fontFamily: F.label, fontSize: 11, color: T.textLight, background: 'none', border: 'none',
            cursor: 'pointer', textDecoration: 'underline',
          }}>Sign out</button>
        </div>
      </div>
    </div>
  );
}
