import { useState, useEffect } from 'react';
import { days, weeks } from './data';

/* ── Theme ── */
const T = {
  navy: '#1e3a5f', navyLight: '#2a4d73', cream: '#f5f0e8', creamDark: '#ede6d8',
  gold: '#c8a84e', goldMuted: '#b89a3e', warmGray: '#a39887',
  textDark: '#2c2418', textMid: '#5a4e3e', textLight: '#8a7e6e', white: '#fff',
  deeperBg: '#f9f6f0', deeperBorder: '#e8e0d0',
};
const F = {
  heading: "'Playfair Display', Georgia, serif",
  body: "'Source Serif 4', Georgia, serif",
  label: "'DM Sans', 'Helvetica Neue', sans-serif",
};

/* ── Storage ── */
const KEY = 'rh_book1_v2';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const save = (d) => localStorage.setItem(KEY, JSON.stringify(d));

/* ── Shared Components ── */
function Header({ left, right, onHome }) {
  return (
    <div style={{ background: T.navy, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {onHome && <button onClick={onHome} style={{ background: 'none', border: 'none', color: T.gold, fontSize: 16, cursor: 'pointer', padding: '0 4px' }}>←</button>}
        <span style={{ fontFamily: F.label, fontSize: 12, letterSpacing: 2, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>{left}</span>
      </div>
      <span style={{ fontFamily: F.label, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: T.white, textTransform: 'uppercase' }}>{right}</span>
    </div>
  );
}

function SectionLabel({ children, variant = 'primary' }) {
  const p = variant === 'primary';
  return (
    <div style={{ display: 'inline-block', background: p ? T.navy : 'transparent', border: p ? 'none' : `1.5px solid ${T.gold}`, padding: p ? '7px 16px' : '5px 14px', borderRadius: 3, marginBottom: p ? 16 : 12, marginTop: 4 }}>
      <span style={{ fontFamily: F.label, fontSize: 11, fontWeight: 600, letterSpacing: 2.5, color: p ? T.gold : T.goldMuted, textTransform: 'uppercase' }}>{children}</span>
    </div>
  );
}

function ReflectLabel({ children }) {
  return (
    <div style={{ display: 'inline-block', background: T.navyLight, padding: '6px 14px', borderRadius: 3, marginBottom: 10, marginTop: 4 }}>
      <span style={{ fontFamily: F.label, fontSize: 10.5, fontWeight: 600, letterSpacing: 2, color: T.gold, textTransform: 'uppercase' }}>{children}</span>
    </div>
  );
}

function Body({ children, style = {} }) {
  return <p style={{ fontFamily: F.body, fontSize: 17, lineHeight: 1.78, color: T.textDark, margin: '0 0 16px', ...style }}>{children}</p>;
}

function Prompt({ children }) {
  return <p style={{ fontFamily: F.body, fontSize: 15.5, lineHeight: 1.6, color: T.textDark, fontWeight: 600, margin: '0 0 10px' }}>{children}</p>;
}

function PermissionMarker({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: `${T.gold}12`, borderLeft: `3px solid ${T.gold}`, borderRadius: '0 6px 6px 0', margin: '0 0 24px' }}>
      <span style={{ fontSize: 15, color: T.gold }}>✦</span>
      <span style={{ fontFamily: F.body, fontSize: 14, color: T.textMid, fontStyle: 'italic' }}>{text}</span>
    </div>
  );
}

function TextArea({ value, onChange, placeholder = 'Write here...', rows = 4 }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{
        width: '100%', padding: 14, fontFamily: F.body, fontSize: 15, lineHeight: 1.7,
        color: T.textDark, background: T.white, border: `1.5px solid ${T.warmGray}35`, borderRadius: 8,
        resize: 'vertical', outline: 'none', boxSizing: 'border-box', marginBottom: 20,
        transition: 'border-color 0.2s',
      }}
      onFocus={e => { e.target.style.borderColor = T.gold; e.target.style.boxShadow = `0 0 0 3px ${T.gold}15`; }}
      onBlur={e => { e.target.style.borderColor = `${T.warmGray}35`; e.target.style.boxShadow = 'none'; }}
    />
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14, cursor: 'pointer' }}>
      <div onClick={onChange} style={{
        width: 22, height: 22, borderRadius: 5, border: `2px solid ${checked ? T.navy : T.warmGray}`,
        background: checked ? T.navy : 'transparent', flexShrink: 0, marginTop: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
      }}>
        {checked && <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <span style={{ fontFamily: F.body, fontSize: 15, color: T.textDark, lineHeight: 1.5, userSelect: 'none' }}>{label}</span>
    </label>
  );
}

function NavyCard({ label, children }) {
  return (
    <div style={{ background: T.navy, borderRadius: 8, padding: '16px 20px', marginTop: 8 }}>
      <span style={{ fontFamily: F.label, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: T.gold, textTransform: 'uppercase' }}>{label}</span>
      <p style={{ fontFamily: F.body, fontSize: 15, color: 'rgba(255,255,255,0.92)', margin: '8px 0 0', lineHeight: 1.6 }}>{children}</p>
    </div>
  );
}

function Btn({ children, onClick, variant = 'primary', disabled, style: s = {} }) {
  const p = variant === 'primary';
  return (
    <button onClick={onClick} disabled={disabled} style={{
      fontFamily: F.label, fontSize: 13, fontWeight: 600, padding: '10px 22px', borderRadius: 6, cursor: disabled ? 'default' : 'pointer',
      color: disabled ? T.warmGray : (p ? T.white : T.navy), background: disabled ? 'transparent' : (p ? T.navy : 'transparent'),
      border: `1.5px solid ${disabled ? T.warmGray + '40' : (p ? T.navy : T.navy + '30')}`, transition: 'all 0.15s', ...s,
    }}>{children}</button>
  );
}

function Divider() { return <div style={{ height: 1, background: `linear-gradient(to right, ${T.gold}50, transparent)`, margin: '28px 0' }} />; }

/* ── Go Deeper Panel ── */
function GoDeeper({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ margin: '24px 0', border: `1.5px solid ${T.deeperBorder}`, borderRadius: 10, overflow: 'hidden', background: T.deeperBg }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
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

/* ── Tabs ── */
function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 0, background: T.creamDark, borderBottom: `1px solid ${T.warmGray}20`, overflowX: 'auto' }}>
      {tabs.map((t, i) => (
        <button key={i} onClick={() => onChange(i)} style={{
          fontFamily: F.label, fontSize: 13, fontWeight: active === i ? 700 : 400, padding: '14px 20px', flex: 1,
          color: active === i ? T.navy : T.textLight, background: active === i ? T.cream : 'transparent',
          border: 'none', borderBottom: active === i ? `3px solid ${T.gold}` : '3px solid transparent',
          cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
        }}>{t}</button>
      ))}
    </div>
  );
}

/* ── Render paragraphs with block quotes ── */
function TeachingText({ text }) {
  const paragraphs = text.split('\n\n');
  return paragraphs.map((p, i) => {
    const lines = p.split('\n');
    const isQuote = lines.every(l => l.startsWith('"') || l.startsWith('\"') || l.trim() === '');
    const isList = lines.length > 2 && lines.every(l => l.length < 60);
    if (isQuote) {
      return <div key={i} style={{ borderLeft: `3px solid ${T.warmGray}45`, paddingLeft: 20, margin: '20px 0' }}>
        {lines.filter(l => l.trim()).map((line, j) => <Body key={j} style={{ fontStyle: 'italic', color: T.textMid, marginBottom: 6 }}>{line}</Body>)}
      </div>;
    }
    if (isList && lines.length > 3) {
      return <div key={i} style={{ borderLeft: `3px solid ${T.warmGray}30`, paddingLeft: 20, margin: '16px 0' }}>
        {lines.filter(l => l.trim()).map((line, j) => <Body key={j} style={{ marginBottom: 4, fontSize: 16 }}>{line}</Body>)}
      </div>;
    }
    return <Body key={i}>{p}</Body>;
  });
}

/* ── Teaching Page ── */
function TeachingPage({ day }) {
  const ext = day.why_this_matters;
  const example = day.example;
  return (
    <div style={{ padding: '32px 24px 40px' }}>
      {/* Day number + title */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ fontFamily: F.heading, fontSize: 60, fontWeight: 700, color: `${T.navy}12`, lineHeight: 1, display: 'block' }}>{day.day_number}</span>
        <h2 style={{ fontFamily: F.heading, fontSize: 26, fontWeight: 700, color: T.textDark, margin: '-8px 0 4px', lineHeight: 1.3 }}>{day.day_title}</h2>
        <div style={{ height: 2, width: 56, background: T.gold, marginBottom: 24 }} />
      </div>

      <SectionLabel>What Is Actually Happening</SectionLabel>
      <TeachingText text={day.teaching_text} />

      {/* Go Deeper: Why + Example */}
      {ext && (
        <GoDeeper title="Go Deeper — Why This Matters">
          <Body style={{ marginTop: 16 }}>{ext}</Body>
          {example && (
            <>
              <div style={{ fontFamily: F.label, fontSize: 10, fontWeight: 700, letterSpacing: 2, color: T.goldMuted, textTransform: 'uppercase', marginTop: 20, marginBottom: 8 }}>Real Example</div>
              <div style={{ background: T.white, borderRadius: 8, padding: 16, border: `1px solid ${T.deeperBorder}` }}>
                <Body style={{ margin: 0, fontSize: 15, color: T.textMid }}>{example}</Body>
              </div>
            </>
          )}
        </GoDeeper>
      )}

      <Divider />
      <NavyCard label="Today's Reminder">{day.todays_reminder}</NavyCard>
    </div>
  );
}

/* ── Reflect Page ── */
function ReflectPage({ day, entries, onUpdate }) {
  let deeperPrompts = [];
  try { deeperPrompts = JSON.parse(day.deeper_prompts || '[]'); } catch {}

  return (
    <div style={{ padding: '32px 24px 40px' }}>
      <PermissionMarker text={day.todays_note} />

      <ReflectLabel>Notice</ReflectLabel>
      <Prompt>{day.reflect_notice}</Prompt>
      <TextArea value={entries.notice || ''} onChange={v => onUpdate({ ...entries, notice: v })} />

      <ReflectLabel>Look Closer</ReflectLabel>
      <Prompt>{day.reflect_look_closer}</Prompt>
      <TextArea value={entries.closer || ''} onChange={v => onUpdate({ ...entries, closer: v })} />

      <ReflectLabel>Connect</ReflectLabel>
      <Prompt>{day.reflect_connect}</Prompt>
      <TextArea value={entries.connect || ''} onChange={v => onUpdate({ ...entries, connect: v })} />

      {/* Go Deeper: Additional prompts */}
      {deeperPrompts.length > 0 && (
        <GoDeeper title="Go Deeper — More Prompts">
          <p style={{ fontFamily: F.label, fontSize: 12, color: T.textLight, margin: '16px 0 16px', fontStyle: 'italic' }}>
            These are optional. Use them if today's core prompts left something unfinished.
          </p>
          {deeperPrompts.map((prompt, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <Prompt>{prompt}</Prompt>
              <TextArea
                value={entries[`deeper_${i}`] || ''} onChange={v => onUpdate({ ...entries, [`deeper_${i}`]: v })}
                rows={3} placeholder="Optional..."
              />
            </div>
          ))}
        </GoDeeper>
      )}
    </div>
  );
}

/* ── Practice Page ── */
function PracticePage({ day, entries, onUpdate }) {
  const feels = [
    { k: 'f1', l: day.today_i_feel_1 }, { k: 'f2', l: day.today_i_feel_2 }, { k: 'f3', l: day.today_i_feel_3 },
    { k: 'f4', l: day.today_i_feel_4 }, { k: 'f5', l: day.today_i_feel_5 }, { k: 'f6', l: day.today_i_feel_6 },
  ];
  const micros = [{ k: 'm1', l: day.micro_win_1 }, { k: 'm2', l: day.micro_win_2 }, { k: 'm3', l: day.micro_win_3 }];
  const toggle = (k) => onUpdate({ ...entries, [k]: !entries[k] });
  const tryThis = day.try_this;

  return (
    <div style={{ padding: '32px 24px 40px' }}>
      {/* Practice */}
      <div style={{ background: T.creamDark, borderRadius: 8, padding: '18px 20px', marginBottom: 20 }}>
        <span style={{ fontFamily: F.label, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: T.goldMuted, textTransform: 'uppercase' }}>Today's Practice</span>
        <p style={{ fontFamily: F.body, fontSize: 15.5, color: T.textDark, margin: '10px 0 0', lineHeight: 1.65 }}>{day.todays_practice}</p>
      </div>

      {/* Go Deeper: Try This */}
      {tryThis && (
        <GoDeeper title="Go Deeper — Try This Instead (or Also)">
          <Body style={{ marginTop: 16, fontSize: 15 }}>{tryThis}</Body>
          <TextArea value={entries.try_this || ''} onChange={v => onUpdate({ ...entries, try_this: v })} placeholder="Notes from this exercise..." rows={3} />
        </GoDeeper>
      )}

      {/* One Thing Learned */}
      <div style={{ background: T.creamDark, borderRadius: 8, padding: '18px 20px', marginBottom: 24 }}>
        <span style={{ fontFamily: F.label, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, color: T.goldMuted, textTransform: 'uppercase' }}>One Thing I Learned Today</span>
        <p style={{ fontFamily: F.label, fontSize: 12, fontStyle: 'italic', color: T.textLight, margin: '6px 0 10px' }}>Not what I did — what I discovered about myself.</p>
        <TextArea value={entries.learned || ''} onChange={v => onUpdate({ ...entries, learned: v })} placeholder="What I discovered..." rows={3} />
      </div>

      {/* Micro-wins + Today I Feel side by side */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ flex: '1 1 220px' }}>
          <span style={{ fontFamily: F.label, fontSize: 11, fontWeight: 700, letterSpacing: 2, color: T.navy, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Micro-Win Checklist</span>
          {micros.map(m => <Check key={m.k} label={m.l} checked={!!entries[m.k]} onChange={() => toggle(m.k)} />)}
        </div>
        <div style={{ flex: '1 1 220px' }}>
          <span style={{ fontFamily: F.label, fontSize: 11, fontWeight: 700, letterSpacing: 2, color: T.navy, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Today I Feel</span>
          {feels.map(f => <Check key={f.k} label={f.l} checked={!!entries[f.k]} onChange={() => toggle(f.k)} />)}
        </div>
      </div>

      <NavyCard label="Looking Ahead">{day.looking_ahead}</NavyCard>
    </div>
  );
}

/* ── Day View ── */
function DayView({ dayNum, userData, setUserData, onHome, onNav }) {
  const [tab, setTab] = useState(0);
  const day = days.find(d => parseInt(d.day_number) === dayNum);
  if (!day) return null;

  const dk = `day_${dayNum}`;
  const entries = userData[dk] || {};
  const update = (u) => { const n = { ...userData, [dk]: u }; setUserData(n); save(n); };
  const markDone = () => { const n = { ...userData, [dk]: { ...entries, completed: true }, lastDay: dayNum }; setUserData(n); save(n); };

  return (
    <div>
      <Header left={`Week ${day.week_number} · ${day.week_theme}`} right={`Day ${day.day_number}`} onHome={onHome} />
      <Tabs tabs={['Teaching', 'Reflect', 'Practice']} active={tab} onChange={setTab} />
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {tab === 0 && <TeachingPage day={day} />}
        {tab === 1 && <ReflectPage day={day} entries={entries} onUpdate={update} />}
        {tab === 2 && <PracticePage day={day} entries={entries} onUpdate={update} />}
      </div>
      {/* Bottom nav */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="secondary" disabled={dayNum <= 1} onClick={() => { onNav(dayNum - 1); setTab(0); }}>← Day {dayNum - 1}</Btn>
          <Btn variant="secondary" disabled={dayNum >= 30} onClick={() => { onNav(dayNum + 1); setTab(0); }}>Day {dayNum + 1} →</Btn>
        </div>
        {!entries.completed ? (
          <Btn onClick={markDone}>Mark Complete ✓</Btn>
        ) : (
          <span style={{ fontFamily: F.label, fontSize: 13, color: T.gold, fontWeight: 600 }}>✓ Day {dayNum} Complete</span>
        )}
      </div>
    </div>
  );
}

/* ── Home ── */
function HomeView({ userData, onSelect }) {
  const done = Array.from({ length: 30 }, (_, i) => userData[`day_${i + 1}`]?.completed).filter(Boolean).length;
  const pct = Math.round((done / 30) * 100);
  const wks = [{ t: 'SEE IT', s: 'Awareness', r: [1,7] }, { t: 'FEEL IT', s: 'Origin', r: [8,14] }, { t: 'SHIFT IT', s: 'Interruption', r: [15,21] }, { t: 'LIVE IT', s: 'Identity', r: [22,30] }];

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 60px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ display: 'inline-block', background: T.navy, padding: '5px 16px', borderRadius: 20, marginBottom: 16 }}>
          <span style={{ fontFamily: F.label, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: T.gold, textTransform: 'uppercase' }}>30-Day System</span>
        </div>
        <h1 style={{ fontFamily: F.heading, fontSize: 30, fontWeight: 700, color: T.navy, margin: '0 0 6px', lineHeight: 1.2 }}>Stop Being<br/>Emotionally Reactive</h1>
        <p style={{ fontFamily: F.label, fontSize: 13, color: T.textMid, margin: 0 }}>Understand Your Triggers. Stop Automatic Reactions.</p>
      </div>

      {/* Progress */}
      <div style={{ background: T.white, borderRadius: 12, padding: 24, marginBottom: 36, boxShadow: '0 2px 16px rgba(30,58,95,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ fontFamily: F.label, fontSize: 13, fontWeight: 600, color: T.navy }}>Your Progress</span>
          <span style={{ fontFamily: F.label, fontSize: 24, fontWeight: 700, color: T.navy }}>{pct}%</span>
        </div>
        <div style={{ height: 10, background: T.creamDark, borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(to right, ${T.navy}, ${T.gold})`, borderRadius: 5, transition: 'width 0.5s ease' }} />
        </div>
        <p style={{ fontFamily: F.label, fontSize: 12, color: T.textLight, margin: '8px 0 0' }}>{done} of 30 days completed</p>
      </div>

      {/* Weeks */}
      {wks.map((wk, wi) => {
        const [start, end] = wk.r;
        const weekDone = Array.from({ length: end - start + 1 }, (_, i) => userData[`day_${start + i}`]?.completed).filter(Boolean).length;
        const total = end - start + 1;
        return (
          <div key={wi} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: F.label, fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: T.navy, textTransform: 'uppercase' }}>Week {wi + 1}</span>
                <span style={{ fontFamily: F.label, fontSize: 11, color: T.gold, fontWeight: 600 }}>{wk.t}</span>
                <span style={{ fontFamily: F.label, fontSize: 10, color: T.textLight }}>· {wk.s}</span>
              </div>
              <span style={{ fontFamily: F.label, fontSize: 11, color: T.textLight }}>{weekDone}/{total}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(82px, 1fr))', gap: 8 }}>
              {Array.from({ length: total }, (_, i) => {
                const dn = start + i;
                const d = days.find(x => parseInt(x.day_number) === dn);
                const c = userData[`day_${dn}`]?.completed;
                const has = userData[`day_${dn}`] && Object.keys(userData[`day_${dn}`]).some(k => k !== 'completed' && userData[`day_${dn}`][k]);
                return (
                  <button key={dn} onClick={() => onSelect(dn)} style={{
                    padding: '14px 8px 12px', borderRadius: 10, border: `1.5px solid ${c ? T.navy + '60' : T.warmGray + '30'}`,
                    background: c ? `${T.navy}08` : T.white, cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
                  }}>
                    <div style={{ fontFamily: F.label, fontSize: 20, fontWeight: 700, color: c ? T.navy : T.textMid, lineHeight: 1 }}>{dn}</div>
                    <div style={{ fontFamily: F.label, fontSize: 9, color: T.textLight, marginTop: 4, lineHeight: 1.3, minHeight: 22 }}>
                      {d?.day_title?.split(' ').slice(0, 3).join(' ')}
                    </div>
                    {c && <div style={{ fontSize: 11, color: T.gold, marginTop: 3 }}>✓</div>}
                    {!c && has && <div style={{ width: 6, height: 6, borderRadius: 3, background: T.warmGray, margin: '5px auto 0' }} />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div style={{ textAlign: 'center', marginTop: 40, paddingTop: 24, borderTop: `1px solid ${T.warmGray}20` }}>
        <p style={{ fontFamily: F.label, fontSize: 11, color: T.textLight, margin: '0 0 8px' }}>All entries are saved in your browser. Nothing is sent to a server.</p>
        <button onClick={() => { if (confirm('This will clear all your entries and progress. This cannot be undone. Are you sure?')) { localStorage.removeItem(KEY); window.location.reload(); } }}
          style={{ fontFamily: F.label, fontSize: 11, color: T.textLight, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Reset all progress
        </button>
      </div>
    </div>
  );
}

/* ── App ── */
export default function App() {
  const [userData, setUserData] = useState(load);
  const [view, setView] = useState('home');
  const [currentDay, setCurrentDay] = useState(1);

  const openDay = (dn) => { setCurrentDay(dn); setView('day'); window.scrollTo(0, 0); };
  const goHome = () => { setView('home'); window.scrollTo(0, 0); };

  return (
    <div style={{ minHeight: '100vh', background: T.cream }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: ${T.cream}; -webkit-font-smoothing: antialiased; }
        textarea:focus { border-color: ${T.gold} !important; }
        ::selection { background: ${T.gold}30; }
        button:hover:not(:disabled) { opacity: 0.88; }
        @media (max-width: 500px) {
          h1 { font-size: 24px !important; }
          h2 { font-size: 22px !important; }
        }
      `}</style>
      {view === 'home' && <HomeView userData={userData} onSelect={openDay} />}
      {view === 'day' && <DayView dayNum={currentDay} userData={userData} setUserData={setUserData} onHome={goHome} onNav={openDay} />}
    </div>
  );
}
