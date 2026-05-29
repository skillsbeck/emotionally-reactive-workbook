import { useState } from 'react';
import { supabase } from './supabase';

const T = {
  navy: '#1e3a5f', cream: '#f5f0e8', gold: '#c8a84e',
  textDark: '#2c2418', textMid: '#5a4e3e', textLight: '#8a7e6e',
  warmGray: '#a39887', white: '#fff', error: '#c45c4a', success: '#5a9a6a',
};
const F = {
  heading: "'Playfair Display', Georgia, serif",
  body: "'Source Serif 4', Georgia, serif",
  label: "'DM Sans', 'Helvetica Neue', sans-serif",
};

export default function Auth({ onSignIn }) {
  const [mode, setMode] = useState('login'); // login, signup, reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage('');
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    onSignIn(data.session);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage('');
    const { data, error: err } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
   if (data.session) {
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage('');
    const { error: err } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (err) { setError(err.message); return; }
    setMessage('Password reset email sent. Check your inbox.');
  };

  return (
    <div style={{ minHeight: '100vh', background: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 400, width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-block', background: T.navy, padding: '5px 16px', borderRadius: 20, marginBottom: 16 }}>
            <span style={{ fontFamily: F.label, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: T.gold, textTransform: 'uppercase' }}>30-Day System</span>
          </div>
          <h1 style={{ fontFamily: F.heading, fontSize: 26, fontWeight: 700, color: T.navy, margin: '0 0 6px', lineHeight: 1.2 }}>
            Stop Being<br/>Emotionally Reactive
          </h1>
          <p style={{ fontFamily: F.label, fontSize: 13, color: T.textMid, margin: 0 }}>
            {mode === 'login' ? 'Sign in to continue your work' : mode === 'signup' ? 'Create an account to save your progress' : 'Reset your password'}
          </p>
        </div>

        {/* Form */}
        <div style={{ background: T.white, borderRadius: 12, padding: 28, boxShadow: '0 2px 16px rgba(30,58,95,0.06)' }}>
          <form onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handleReset}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: F.label, fontSize: 12, fontWeight: 600, color: T.textMid, display: 'block', marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                style={{
                  width: '100%', padding: '12px 14px', fontFamily: F.body, fontSize: 15, color: T.textDark,
                  border: `1.5px solid ${T.warmGray}35`, borderRadius: 8, outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = T.gold}
                onBlur={e => e.target.style.borderColor = `${T.warmGray}35`}
              />
            </div>

            {mode !== 'reset' && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: F.label, fontSize: 12, fontWeight: 600, color: T.textMid, display: 'block', marginBottom: 6 }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                  style={{
                    width: '100%', padding: '12px 14px', fontFamily: F.body, fontSize: 15, color: T.textDark,
                    border: `1.5px solid ${T.warmGray}35`, borderRadius: 8, outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = T.gold}
                  onBlur={e => e.target.style.borderColor = `${T.warmGray}35`}
                />
                {mode === 'signup' && (
                  <p style={{ fontFamily: F.label, fontSize: 11, color: T.textLight, margin: '6px 0 0' }}>At least 6 characters</p>
                )}
              </div>
            )}

            {error && (
              <div style={{ background: `${T.error}10`, border: `1px solid ${T.error}30`, borderRadius: 6, padding: '10px 14px', marginBottom: 16 }}>
                <p style={{ fontFamily: F.label, fontSize: 12, color: T.error, margin: 0 }}>{error}</p>
              </div>
            )}

            {message && (
              <div style={{ background: `${T.success}10`, border: `1px solid ${T.success}30`, borderRadius: 6, padding: '10px 14px', marginBottom: 16 }}>
                <p style={{ fontFamily: F.label, fontSize: 12, color: T.success, margin: 0 }}>{message}</p>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px 24px', fontFamily: F.label, fontSize: 14, fontWeight: 600,
              color: T.white, background: T.navy, border: 'none', borderRadius: 8, cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
            }}>
              {loading ? 'Working...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>

          {/* Mode switches */}
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            {mode === 'login' && (
              <>
                <button onClick={() => { setMode('signup'); setError(''); setMessage(''); }}
                  style={{ fontFamily: F.label, fontSize: 12, color: T.navy, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Create an account
                </button>
                <span style={{ color: T.textLight, margin: '0 8px' }}>·</span>
                <button onClick={() => { setMode('reset'); setError(''); setMessage(''); }}
                  style={{ fontFamily: F.label, fontSize: 12, color: T.textLight, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Forgot password?
                </button>
              </>
            )}
            {mode === 'signup' && (
              <button onClick={() => { setMode('login'); setError(''); setMessage(''); }}
                style={{ fontFamily: F.label, fontSize: 12, color: T.navy, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Already have an account? Sign in
              </button>
            )}
            {mode === 'reset' && (
              <button onClick={() => { setMode('login'); setError(''); setMessage(''); }}
                style={{ fontFamily: F.label, fontSize: 12, color: T.navy, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Back to sign in
              </button>
            )}
          </div>
        </div>

        {/* Privacy note */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <p style={{ fontFamily: F.label, fontSize: 11, color: T.textLight, margin: 0 }}>
            Your entries are encrypted and private. We never share your data.
          </p>
        </div>
      </div>
    </div>
  );
}
