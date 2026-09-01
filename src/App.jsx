import React, { useState, useEffect, useRef, useCallback } from 'react'

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY

const SYSTEM_PROMPT = `You are Vaibhav Shrivastava, a Software Engineering Lead at Manifest Global (Cialfo), speaking in first person in a conversational, friendly but professional tone. Answer questions as if you are Vaibhav himself.

Key facts:
- Software Engineering Lead at Cialfo since August 2026 — own the UI repository end-to-end and am a key driver of the company's AI initiatives. Previously Senior Software Engineer there (Apr 2025–Aug 2026) and Frontend Engineer (Jul 2023–Apr 2025).
- Cialfo: Series B EdTech SaaS ($77M raised), 310,000+ students, 1,000+ universities, 105+ countries.
- Currently architecting Claude-powered agentic pipelines enabling PMs & designers (3–5 non-engineers) to generate and ship production code independently — ~75% velocity increase, days to hours.
- Main focus spans the UI and agentic repos: build internal tools and apply them across the UI, and lead the agentic chat experience end-to-end.
- Automated the team's code review using Claude routines (scheduled agents) that review changes and surface issues on every change, without manual kickoff.
- Proficient in Claude Code skill authoring; own the end-to-end skill library powering the no-dev workflow platform.
- Built pre-commit hook infrastructure enabling non-developer contributions to production codebases.
- Delivered multi-brand AI chatbot via Cloudflare Workers + Cloudflare-managed RAG; drove ~30% PLT reduction.
- Mentored 2 AI engineering interns to on-time delivery.
- Previously: MAQ Software (Angular enterprise, 91%+ test coverage), Accenture.
- Education: B.Tech IT, Technocrats Institute of Technology Bhopal, CGPA 8.64, 2021.
- Core skills: Angular (expert), TypeScript, JavaScript, Tailwind, RxJS, Cloudflare Workers, Claude Code, LangChain, LangGraph, RAG, Evals, Jasmine/Karma.
- Email: vshrivastava103@gmail.com
- LinkedIn: https://www.linkedin.com/in/vaibhav-shrivastava-aa637116a/

Rules:
- Always respond in first person, conversational and friendly but professional.
- Keep answers to 2–4 sentences unless a detailed technical question warrants more.
- If asked something not in your context, say: "That's not something I've shared publicly yet — feel free to reach out on LinkedIn!"
- Never make up details not listed above.
- This portfolio is about showcasing my work and capabilities, not job-seeking. If asked whether I'm open to opportunities, looking for a job, or available to switch, do NOT confirm or deny job-seeking. Deflect warmly and redirect to the work itself — e.g. "I'm really focused on the agentic AI work I'm doing at Cialfo right now. Happy to connect professionally on LinkedIn if you'd like to talk shop!" Keep it about the craft, never about availability.`

// ─── PALETTE ── warm dark premium ───────────────────────────────────────────────
const P = {
  bg:        '#17120e',
  surface:   '#241c15',
  border:    '#3c3228',
  amber:     '#e6a95c',
  copper:    '#d78a56',
  rose:      '#d98c9a',
  sand:      '#cbb28f',
  textPri:   '#f6efe4',
  textSec:   '#dccfbd',
  textMuted: '#a2937f',
  faint:     '#6f6455',
  aiBg:      '#1f1810',
}

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; overflow-x: hidden; }
body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #17120e; color: #f6efe4;
  font-size: 15px; line-height: 1.75;
  -webkit-font-smoothing: antialiased; overflow-x: hidden; position: relative;
}
body::before, body::after { content: ''; position: fixed; z-index: 0; pointer-events: none; filter: blur(30px); }
body::before { top: -260px; left: 50%; transform: translateX(-50%); width: 900px; height: 640px;
  background: radial-gradient(ellipse at center, rgba(230,169,92,0.20) 0%, rgba(230,169,92,0.05) 45%, transparent 72%); }
body::after { bottom: -320px; right: -180px; width: 720px; height: 660px;
  background: radial-gradient(ellipse at center, rgba(217,140,154,0.13) 0%, transparent 70%); }

.display { font-family: 'Sora', 'Inter', sans-serif; }
.mono { font-family: 'JetBrains Mono', monospace; }

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #3c3228; border-radius: 4px; }

a { text-decoration: none; color: inherit; }
button { cursor: pointer; font-family: inherit; }
input { font-family: inherit; }
input::placeholder { color: #6f6455; }

@keyframes bl { 50% { opacity: 0; } }
.blink { animation: bl 1s step-end infinite; }

@keyframes gradientShift { from { background-position: 0% center; } to { background-position: 200% center; } }
.gradient-text {
  background: linear-gradient(100deg, #e6a95c 0%, #d78a56 35%, #d98c9a 65%, #e6a95c 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: gradientShift 7s linear infinite;
}

@keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
.stagger > * { animation: fadeUp .7s cubic-bezier(.2,.7,.3,1) both; }
.stagger > *:nth-child(2){ animation-delay: .08s; }
.stagger > *:nth-child(3){ animation-delay: .16s; }
.stagger > *:nth-child(4){ animation-delay: .24s; }
.stagger > *:nth-child(5){ animation-delay: .32s; }
.msg-in { animation: fadeUp .45s cubic-bezier(.2,.7,.3,1) both; }

.btn {
  position: relative; overflow: hidden; border-radius: 11px; font-size: 14px; font-weight: 600;
  padding: 11px 22px; letter-spacing: .01em;
  transition: transform .18s cubic-bezier(.2,.7,.3,1), box-shadow .22s ease, filter .22s ease;
}
.btn:hover { transform: translateY(-2px); filter: brightness(1.05); }
.btn:active { transform: translateY(0) scale(.98); transition-duration: .06s; }
.btn::after { content: ''; position: absolute; top: 0; bottom: 0; left: -80%; width: 45%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,.28), transparent);
  transform: skewX(-20deg); pointer-events: none; transition: left .55s ease; }
.btn:hover::after { left: 130%; }

.chip {
  border-radius: 22px; font-size: 13px; padding: 8px 15px; font-weight: 500;
  background: rgba(255,238,214,0.035); border: 1px solid rgba(255,224,190,0.13); color: #dccfbd;
  transition: transform .16s cubic-bezier(.2,.7,.3,1), background .18s, border-color .18s, color .18s;
  display: inline-flex; align-items: center; gap: 7px;
}
.chip:hover { transform: translateY(-2px); background: rgba(230,169,92,0.12); border-color: rgba(230,169,92,0.4); color: #f6efe4; }
.chip-accent { background: rgba(230,169,92,0.10); border-color: rgba(230,169,92,0.3); color: #e6a95c; }

.skill-tag { transition: transform .15s cubic-bezier(.2,.7,.3,1), filter .15s ease; cursor: default; }
.skill-tag:hover { transform: translateY(-2px); filter: brightness(1.22); }

.link-underline { position: relative; }
.link-underline::after { content: ''; position: absolute; left: 0; right: 0; bottom: -5px; height: 2px; border-radius: 2px;
  background: linear-gradient(90deg, #e6a95c, #d98c9a); transform: scaleX(0); transform-origin: left; transition: transform .25s cubic-bezier(.2,.7,.3,1); }
.link-underline:hover::after { transform: scaleX(1); }

@keyframes pulseDot { 0% { box-shadow: 0 0 0 0 rgba(230,169,92,.5);} 70% { box-shadow: 0 0 0 7px rgba(230,169,92,0);} 100% { box-shadow: 0 0 0 0 rgba(230,169,92,0);} }
.pulse-dot { animation: pulseDot 2.4s ease-out infinite; }
@keyframes micPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(230,169,92,.5);} 70% { box-shadow: 0 0 0 9px rgba(230,169,92,0);} }
.mic-live { animation: micPulse 1.2s ease-out infinite; }

.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  background: rgba(23,18,14,0.72); border-bottom: 1px solid rgba(255,224,190,0.07);
}
.nav-inner { max-width: 820px; margin: 0 auto; padding: 0 clamp(16px,4vw,28px); height: 60px; display: flex; align-items: center; justify-content: space-between; }
.nav-links { display: flex; gap: 22px; align-items: center; }
.nav-link { background: none; border: none; font-size: 13.5px; font-weight: 500; color: #a2937f; transition: color .2s; }

@keyframes floaty { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-7px);} }
.avatar {
  width: 84px; height: 84px; border-radius: 50%; padding: 2px; flex-shrink: 0;
  background: linear-gradient(150deg, #e6a95c, #d78a56 55%, #d98c9a);
  box-shadow: 0 16px 40px -14px rgba(0,0,0,0.7), 0 0 44px rgba(230,169,92,0.22);
  animation: floaty 6s ease-in-out infinite;
}
.avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; object-position: center 18%; display: block; }

/* stage — centered conversation */
.stage { position: relative; z-index: 1; height: 100dvh; display: flex; flex-direction: column; padding-top: 60px; }
.scroll { flex: 1 1 auto; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth; }
.scroll-inner { max-width: 820px; margin: 0 auto; padding: 26px clamp(16px,4vw,28px) 14px; }

.hero-id { text-align: center; margin-bottom: 26px; display: flex; flex-direction: column; align-items: center; }
.hero-name { font-size: 46px; font-weight: 700; line-height: 1.05; letter-spacing: -0.02em; }

.msg-card {
  background: linear-gradient(158deg, rgba(255,238,214,0.055), rgba(255,238,214,0.015));
  border: 1px solid rgba(255,224,190,0.1); border-radius: 18px; padding: 20px 22px;
  box-shadow: 0 22px 50px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,240,220,0.05);
}
.stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }

/* dock — input + topics, pinned below the scroll area (never overlaps messages) */
.dock { flex: 0 0 auto; z-index: 20; background: #17120e; border-top: 1px solid rgba(255,224,190,0.08); }
.dock-inner { max-width: 820px; margin: 0 auto; padding: 12px clamp(16px,4vw,28px) 16px; display: flex; flex-direction: column; gap: 10px; }
.dock-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }

@media (max-width: 640px) {
  .hero-name { font-size: 38px; }
  .stat-grid { grid-template-columns: 1fr 1fr; }
  .nav-links a[data-hide] { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .stagger > *, .msg-in, .pulse-dot, .mic-live, .gradient-text, .avatar { animation: none; }
  .btn, .chip, .skill-tag, .link-underline::after { transition: none; }
  .btn:hover, .chip:hover, .skill-tag:hover { transform: none; }
}
`

// ─── DATA ───────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '~75%', label: 'Delivery velocity gain', color: P.amber },
  { value: '~30%', label: 'Page-load-time reduction', color: P.copper },
  { value: '5+ yrs', label: 'Engineering experience', color: P.rose },
  { value: '310K+', label: 'Students on the platform', color: P.sand },
]

const WORK = [
  { title: 'Agentic AI pipelines', body: "Claude-powered pipelines that let PMs & designers ship production-ready code independently — the core of Cialfo's no-dev workflow platform.", color: P.amber },
  { title: 'Claude Code skill library', body: 'Own the end-to-end skill library powering the no-dev workflow platform, plus pre-commit infrastructure that lets non-developers contribute to production safely.', color: P.copper },
  { title: 'Code review on autopilot', body: 'Claude routines review every change and surface issues automatically — no manual kickoff.', color: P.rose },
  { title: 'Multi-brand AI chatbot', body: 'Delivered production chatbot features on Cloudflare Workers with managed RAG; drove a ~30% page-load-time reduction.', color: P.sand },
]

const SKILLS = [
  { category: 'Frontend', color: P.amber, items: ['Angular', 'TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Tailwind CSS', 'Angular Material', 'RxJS'] },
  { category: 'Cloud / Backend', color: P.copper, items: ['Cloudflare Workers', 'Wrangler', 'Serverless API Design'] },
  { category: 'AI & Agentic', color: P.rose, items: ['Claude Code', 'Claude Routines', 'LangChain', 'LangGraph', 'Agentic Workflows', 'No-dev Pipelines', 'Cloudflare RAG', 'Tool Integrations'] },
  { category: 'Testing & Analytics', color: P.sand, items: ['Jasmine', 'Karma', 'Jest', 'Unit Testing (91%+)', 'Evals', 'Automated Code Review', 'Segment'] },
]

const EXPERIENCE = [
  { role: 'Software Engineering Lead', company: 'Manifest Global (Cialfo)', period: 'Aug 2026 – Present', current: true, color: P.amber },
  { role: 'Senior Software Engineer', company: 'Manifest Global (Cialfo)', period: 'Apr 2025 – Aug 2026', current: false, color: P.copper },
  { role: 'Frontend Engineer', company: 'Manifest Global (Cialfo)', period: 'Jul 2023 – Apr 2025', current: false, color: P.rose },
  { role: 'Software Engineer – Frontend', company: 'MAQ Software', period: 'May 2022 – Jun 2023', current: false, color: P.sand },
  { role: 'Application Development Associate', company: 'Accenture', period: 'Jul 2021 – Mar 2022', current: false, color: P.textMuted },
]

const ABOUT = "I'm a Software Engineering Lead at Cialfo — a Series B EdTech SaaS ($77M raised) serving 310,000+ students and 1,000+ universities across 105+ countries. I own the UI codebase and drive the company's AI-front work, building systems that let non-engineers ship production code."

const SUGGESTED_PROMPTS = [
  'Tell me about your AI workflow work',
  "What's your biggest achievement?",
  'How do you approach system design?',
]

// topics that reveal rich cards inside the conversation
const TOPICS = [
  { key: 'work', label: 'My work' },
  { key: 'stats', label: 'The numbers' },
  { key: 'skills', label: 'My stack' },
  { key: 'timeline', label: 'Experience' },
  { key: 'about', label: 'About me' },
]

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="display" style={{ border: 'none', background: 'none', fontSize: 16, fontWeight: 700, color: P.textPri, display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(150deg, #e6a95c, #d98c9a)', color: '#1c130c', fontSize: 12, fontWeight: 700 }}>V</span>
          Vaibhav
        </button>
        <div className="nav-links">
          <a className="nav-link link-underline" data-hide href="mailto:vshrivastava103@gmail.com">Email</a>
          <a className="nav-link link-underline" href="https://www.linkedin.com/in/vaibhav-shrivastava-aa637116a/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="nav-link link-underline" href="/Vaibhav_Shrivastava_Resume.pdf" target="_blank" rel="noopener noreferrer">Résumé</a>
        </div>
      </div>
    </nav>
  )
}

// ─── RICH CARDS (revealed inside the conversation) ──────────────────────────────
function CardShell({ children }) {
  return (
    <div className="msg-in" style={{ alignSelf: 'flex-start', maxWidth: '92%', display: 'flex', gap: 10, width: '100%' }}>
      <VAvatar />
      <div className="msg-card" style={{ flex: 1 }}>{children}</div>
    </div>
  )
}

function VAvatar() {
  return (
    <span className="display" style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(150deg, #e6a95c, #d98c9a)', color: '#1c130c', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>V</span>
  )
}

function CardHeader({ label, color }) {
  return <div style={{ fontSize: 10.5, letterSpacing: '.16em', fontWeight: 600, textTransform: 'uppercase', color, marginBottom: 14 }}>{label}</div>
}

function StatsCard() {
  return (
    <CardShell>
      <CardHeader label="By the numbers" color={P.amber} />
      <div className="stat-grid">
        {STATS.map((s, i) => (
          <div key={i}>
            <div className="display" style={{ fontSize: 30, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: P.textMuted, fontSize: 12.5, marginTop: 5 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

function WorkCard() {
  return (
    <CardShell>
      <CardHeader label="What I build" color={P.amber} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {WORK.map((w, i) => (
          <div key={i} style={{ borderLeft: `2px solid ${w.color}`, paddingLeft: 13 }}>
            <div className="display" style={{ color: P.textPri, fontSize: 14.5, fontWeight: 600, marginBottom: 4 }}>{w.title}</div>
            <div style={{ color: P.textMuted, fontSize: 13, lineHeight: 1.65, fontWeight: 300 }}>{w.body}</div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

function SkillsCard() {
  return (
    <CardShell>
      <CardHeader label="My stack" color={P.rose} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {SKILLS.map((cat, i) => (
          <div key={i}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '.08em', color: cat.color, marginBottom: 7, textTransform: 'uppercase' }}>{cat.category}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {cat.items.map((it, j) => (
                <span key={j} className="skill-tag" style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}33`, borderRadius: 8, padding: '4px 10px', fontSize: 11.5, color: cat.color, fontWeight: 500 }}>{it}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

function TimelineCard() {
  return (
    <CardShell>
      <CardHeader label="Experience" color={P.copper} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {EXPERIENCE.map((e, i) => (
          <div key={i} style={{ borderLeft: `2px solid ${e.color}`, paddingLeft: 13 }}>
            {e.current && <span className="mono" style={{ fontSize: 9, color: e.color, letterSpacing: '.08em', fontWeight: 600 }}>● CURRENT</span>}
            <div className="display" style={{ color: e.color, fontSize: 13.5, fontWeight: 600, marginTop: e.current ? 3 : 0 }}>{e.role}</div>
            <div style={{ color: P.textSec, fontSize: 12.5 }}>{e.company} <span style={{ color: P.faint }}>·</span> <span className="mono" style={{ color: P.textMuted, fontSize: 11 }}>{e.period}</span></div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

function AboutCard() {
  return (
    <CardShell>
      <CardHeader label="About me" color={P.amber} />
      <p style={{ color: P.textSec, fontSize: 13.5, lineHeight: 1.75, fontWeight: 300 }}>{ABOUT}</p>
    </CardShell>
  )
}

const CARDS = { stats: StatsCard, work: WorkCard, skills: SkillsCard, timeline: TimelineCard, about: AboutCard }

// ─── BUBBLES ────────────────────────────────────────────────────────────────────
function UserBubble({ content }) {
  return (
    <div className="msg-in" style={{
      alignSelf: 'flex-end', maxWidth: '80%',
      background: 'linear-gradient(150deg, rgba(230,169,92,0.20), rgba(215,138,86,0.14))',
      border: '1px solid rgba(230,169,92,0.3)', borderRadius: '14px 14px 4px 14px',
      padding: '11px 16px', color: P.textPri, fontSize: 14, lineHeight: 1.7,
    }}>{content}</div>
  )
}

function AiBubble({ content }) {
  return (
    <div className="msg-in" style={{ alignSelf: 'flex-start', maxWidth: '84%', display: 'flex', gap: 10 }}>
      <VAvatar />
      <div style={{ background: P.aiBg, border: `1px solid ${P.border}`, borderRadius: '4px 14px 14px 14px', padding: '11px 16px', color: P.textSec, fontSize: 14, lineHeight: 1.75, fontWeight: 300 }}>{content}</div>
    </div>
  )
}

// ─── CHAT INPUT ───────────────────────────────────────────────────────────────
function ChatInput({ input, setInput, onSend, onKey, disabled, micSupported, listening, transcribing, onMic, ttsSupported, voiceOn, onToggleVoice }) {
  const [focused, setFocused] = useState(false)
  const iconBtn = (active, color) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
    background: active ? `${color}22` : 'transparent', border: `1px solid ${active ? color : 'rgba(255,224,190,0.14)'}`,
    color: active ? color : P.textMuted, transition: 'background .2s, border-color .2s, color .2s',
  })
  const ready = input.trim() && !disabled
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 9,
      background: 'rgba(36,28,21,0.85)', backdropFilter: 'blur(10px)',
      border: `1px solid ${listening ? P.amber : (focused ? 'rgba(230,169,92,0.45)' : 'rgba(255,224,190,0.13)')}`,
      borderRadius: 16, padding: '9px 11px',
      boxShadow: '0 20px 44px -22px rgba(0,0,0,0.7)',
      transition: 'border-color 0.2s', opacity: disabled ? 0.65 : 1,
    }}>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={onKey}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={listening ? 'Listening… speak, then pause' : transcribing ? 'Transcribing…' : (micSupported ? 'Ask me anything, or tap the mic…' : 'Ask me anything…')}
        disabled={disabled}
        style={{ flex: 1, minWidth: 0, background: 'none', border: 'none', outline: 'none', fontSize: 14.5, color: P.textPri, paddingLeft: 8 }}
      />
      {ttsSupported && (
        <button onClick={onToggleVoice} title={voiceOn ? 'Voice replies: on' : 'Voice replies: off'} aria-label="Toggle voice replies" style={iconBtn(voiceOn, P.copper)}>
          {voiceOn
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>}
        </button>
      )}
      {micSupported && (
        <button onClick={onMic} disabled={disabled || transcribing} title={listening ? 'Tap to stop' : transcribing ? 'Transcribing…' : 'Speak'} aria-label="Speak your question" className={listening ? 'mic-live' : undefined} style={iconBtn(listening || transcribing, P.amber)}>
          {transcribing
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></path></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/></svg>}
        </button>
      )}
      <button onClick={onSend} disabled={disabled} className="btn" style={{
        background: ready ? 'linear-gradient(100deg, #e6a95c, #d78a56)' : 'transparent',
        border: `1px solid ${ready ? 'transparent' : 'rgba(255,224,190,0.14)'}`,
        color: ready ? '#1c130c' : P.textMuted, fontSize: 13, fontWeight: 600, padding: '9px 18px', borderRadius: 11, flexShrink: 0,
      }}>Send</button>
    </div>
  )
}

// ─── APP (the conversation is the site) ─────────────────────────────────────────
export default function App() {
  const [messages, setMessages] = useState([])
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef(null)
  const scrollRef = useRef(null)
  const nextId = useRef(0)

  const [listening, setListening] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [voiceOn, setVoiceOn] = useState(false)
  const voiceOnRef = useRef(false)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const micStreamRef = useRef(null)
  const stopTimerRef = useRef(null)
  const audioCtxRef = useRef(null)
  const vadIntervalRef = useRef(null)
  const voiceRef = useRef(null)
  const audioRef = useRef(null)
  const micSupported = typeof window !== 'undefined' && typeof navigator !== 'undefined' && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && 'MediaRecorder' in window
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const started = messages.length > 0 || loading || isTyping

  // pick the most natural Indian-English male voice available on the viewer's device
  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    const pick = () => {
      const voices = window.speechSynthesis.getVoices()
      if (!voices.length) return
      const has = (v, ...kw) => kw.some(k => (v.name || '').toLowerCase().includes(k))
      const inIN = voices.filter(v => v.lang === 'en-IN' || v.lang === 'hi-IN')
      const enNatural = voices.filter(v => (v.lang || '').startsWith('en') && has(v, 'natural', 'online'))
      voiceRef.current =
        voices.find(v => v.lang === 'en-IN' && has(v, 'prabhat', 'ravi', 'madhur')) ||
        voices.find(v => has(v, 'prabhat', 'ravi', 'madhur')) ||
        inIN.find(v => has(v, 'natural', 'online')) ||
        inIN.find(v => v.lang === 'en-IN') ||
        (enNatural.find(v => has(v, 'male')) || enNatural[0]) ||
        voices.find(v => (v.lang || '').startsWith('en')) ||
        voices[0] || null
    }
    pick()
    window.speechSynthesis.onvoiceschanged = pick
    return () => { try { window.speechSynthesis.onvoiceschanged = null } catch { /* ignore */ } }
  }, [])

  const stopSpeaking = useCallback(() => {
    try { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null } } catch { /* ignore */ }
    if ('speechSynthesis' in window) { try { window.speechSynthesis.cancel() } catch { /* ignore */ } }
  }, [])

  // device (Web Speech) fallback — synthetic, used only if no neural TTS is configured
  const deviceSpeak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return
    try {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      if (voiceRef.current) { u.voice = voiceRef.current; u.lang = voiceRef.current.lang || 'en-IN' }
      else u.lang = 'en-IN'
      u.rate = 0.98; u.pitch = 1
      window.speechSynthesis.speak(u)
    } catch { /* ignore */ }
  }, [])

  const playBlob = useCallback(async (blob) => {
    const url = URL.createObjectURL(blob)
    const a = new Audio(url)
    audioRef.current = a
    a.onended = () => { URL.revokeObjectURL(url); if (audioRef.current === a) audioRef.current = null }
    await a.play()
  }, [])

  // natural neural voice (Groq Orpheus, uses the existing key) → serverless provider → device voice
  const speakText = useCallback(async (text) => {
    if (!voiceOnRef.current) return
    stopSpeaking()
    // phonetic spelling for the voice only (on-screen text stays "Cialfo")
    const spoken = text.replace(/Cialfo/gi, 'See-alfo')
    // 1) Groq Orpheus TTS — natural, no new account (needs one-time model terms acceptance on the Groq org)
    if (GROQ_KEY) {
      try {
        const r = await fetch('https://api.groq.com/openai/v1/audio/speech', {
          method: 'POST',
          headers: { Authorization: `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'canopylabs/orpheus-v1-english', voice: 'daniel', input: spoken, response_format: 'wav' }),
        })
        if (r.ok) { const blob = await r.blob(); if (voiceOnRef.current && blob && blob.size > 0) { await playBlob(blob); return } }
      } catch { /* fall through */ }
    }
    // 2) optional serverless neural provider (ElevenLabs / Google / Azure, if a key is configured)
    try {
      const r = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: spoken }) })
      if (r.ok) {
        const blob = await r.blob()
        if (voiceOnRef.current && blob && blob.size > 0 && (blob.type || '').includes('audio')) { await playBlob(blob); return }
      }
    } catch { /* fall through */ }
    // 3) device (Web Speech) voice — synthetic fallback
    if (voiceOnRef.current) deviceSpeak(spoken)
  }, [stopSpeaking, deviceSpeak, playBlob])

  const toggleVoice = useCallback(() => {
    setVoiceOn(v => {
      const next = !v
      voiceOnRef.current = next
      if (!next) stopSpeaking()
      return next
    })
  }, [stopSpeaking])

  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel() }, [])

  useEffect(() => {
    if (!started) return
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, typingText, loading, isTyping, started])

  const animateTyping = useCallback((text, onDone) => {
    setIsTyping(true); setTypingText('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setTypingText(text.slice(0, i))
      if (i >= text.length) { clearInterval(interval); setIsTyping(false); onDone() }
    }, 16)
  }, [])

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading || isTyping) return
    stopSpeaking()

    setMessages(prev => [...prev, { role: 'user', content: text, id: nextId.current++ }])
    setInput('')
    setLoading(true)
    const newHistory = [...history, { role: 'user', content: text }]

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...newHistory],
          max_tokens: 800, temperature: 0.75, reasoning_effort: 'low', include_reasoning: false,
        }),
      })
      const data = await res.json()
      const reply = data?.choices?.[0]?.message?.content || 'Something went wrong — please try again.'
      setHistory([...newHistory, { role: 'assistant', content: reply }])
      setLoading(false)
      speakText(reply)
      animateTyping(reply, () => {
        setMessages(prev => [...prev, { role: 'ai', content: reply, id: nextId.current++ }])
        setTypingText('')
      })
    } catch {
      setLoading(false)
      setMessages(prev => [...prev, { role: 'ai', content: 'Network error — try again!', id: nextId.current++ }])
    }
  }, [history, loading, isTyping, animateTyping, speakText, stopSpeaking])

  const revealTopic = useCallback((key) => {
    stopSpeaking()
    setMessages(prev => [...prev, { role: 'card', kind: key, id: nextId.current++ }])
  }, [stopSpeaking])

  const handleKey = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }, [input, sendMessage])

  const transcribe = useCallback(async (blob) => {
    if (!GROQ_KEY || !blob || blob.size < 800) { setTranscribing(false); return }
    setTranscribing(true)
    try {
      const fd = new FormData()
      fd.append('file', blob, 'audio.webm')
      fd.append('model', 'whisper-large-v3-turbo')
      fd.append('response_format', 'json')
      fd.append('language', 'en')
      fd.append('temperature', '0')
      fd.append('prompt', 'Conversation with Vaibhav Shrivastava, a Software Engineering Lead at Cialfo (Manifest Global) working on agentic AI, Claude, Claude Code, LangChain, LangGraph, RAG, and UI engineering. Names: Vaibhav, Shrivastava, Cialfo.')
      const r = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST', headers: { Authorization: `Bearer ${GROQ_KEY}` }, body: fd,
      })
      const data = await r.json().catch(() => ({}))
      const text = (data.text || '').trim()
      setTranscribing(false)
      if (text) { setInput(text); sendMessage(text) }
    } catch { setTranscribing(false) }
  }, [sendMessage])

  // record mic → transcribe with Groq Whisper (far better than the browser recognizer)
  const startListening = useCallback(async () => {
    // already recording → stop and transcribe
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      try { recorderRef.current.stop() } catch { /* ignore */ }
      return
    }
    if (!micSupported) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      micStreamRef.current = stream
      const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(m => window.MediaRecorder.isTypeSupported?.(m)) || ''
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream)
      chunksRef.current = []
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunksRef.current.push(e.data) }
      rec.onstop = () => {
        if (stopTimerRef.current) { clearTimeout(stopTimerRef.current); stopTimerRef.current = null }
        if (vadIntervalRef.current) { clearInterval(vadIntervalRef.current); vadIntervalRef.current = null }
        try { audioCtxRef.current?.close() } catch { /* ignore */ }
        audioCtxRef.current = null
        setListening(false)
        try { micStreamRef.current?.getTracks().forEach(t => t.stop()) } catch { /* ignore */ }
        micStreamRef.current = null
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' })
        recorderRef.current = null
        transcribe(blob)
      }
      recorderRef.current = rec
      rec.start()
      setListening(true)

      // voice-activity detection: auto-stop ~1.1s after the user stops talking
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext
        const ctx = new Ctx()
        audioCtxRef.current = ctx
        const src = ctx.createMediaStreamSource(stream)
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 2048
        src.connect(analyser)
        const buf = new Uint8Array(analyser.fftSize)
        const startedAt = Date.now()
        let spokeAt = 0, lastLoud = 0
        const stopNow = () => { try { recorderRef.current && recorderRef.current.state === 'recording' && recorderRef.current.stop() } catch { /* ignore */ } }
        vadIntervalRef.current = setInterval(() => {
          analyser.getByteTimeDomainData(buf)
          let sum = 0
          for (let i = 0; i < buf.length; i++) { const x = (buf[i] - 128) / 128; sum += x * x }
          const rms = Math.sqrt(sum / buf.length)
          const now = Date.now()
          if (rms > 0.045) { lastLoud = now; if (!spokeAt) spokeAt = now }
          const maxed = now - startedAt > 15000
          const silenceAfterSpeech = spokeAt && (now - lastLoud > 1000)
          const noSpeech = !spokeAt && (now - startedAt > 6000)
          if (maxed || silenceAfterSpeech || noSpeech) stopNow()
        }, 100)
      } catch {
        // no analyser → fall back to a plain 12s safety cap
        stopTimerRef.current = setTimeout(() => { try { rec.state === 'recording' && rec.stop() } catch { /* ignore */ } }, 12000)
      }
    } catch {
      setListening(false)
      try { micStreamRef.current?.getTracks().forEach(t => t.stop()) } catch { /* ignore */ }
      micStreamRef.current = null
    }
  }, [micSupported, transcribe])

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Nav />
      <main className="stage">
        <div className="scroll" ref={scrollRef} style={!started ? { display: 'flex', flexDirection: 'column', justifyContent: 'center' } : undefined}>
          <div className="scroll-inner">
          {/* identity */}
          <div className="hero-id stagger">
            <div className="avatar"><img src="/avatar.png" alt="Vaibhav Shrivastava" /></div>
            <div style={{ marginTop: 18, fontSize: 10.5, letterSpacing: '.18em', fontWeight: 600, textTransform: 'uppercase', color: P.amber }}>Software Engineering Lead · Cialfo</div>
            <h1 className="display hero-name" style={{ marginTop: 12 }}>
              Hi, I'm <span className="gradient-text">Vaibhav</span>
            </h1>
            <p style={{ color: P.textMuted, fontSize: 15, fontWeight: 300, marginTop: 14, maxWidth: 480, lineHeight: 1.7 }}>
              I lead UI and agentic AI at Cialfo. Instead of scrolling a résumé — just ask me anything, by text or voice. Or tap a topic to explore.
            </p>
            {!started && (
              <div className="dock-chips" style={{ marginTop: 22 }}>
                {SUGGESTED_PROMPTS.map((p, i) => (
                  <button key={i} className="chip" onClick={() => sendMessage(p)}>{p}</button>
                ))}
              </div>
            )}
          </div>

          {/* conversation stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map(msg => {
              if (msg.role === 'user') return <UserBubble key={msg.id} content={msg.content} />
              if (msg.role === 'card') { const C = CARDS[msg.kind]; return C ? <C key={msg.id} /> : null }
              return <AiBubble key={msg.id} content={msg.content} />
            })}

            {loading && (
              <div className="msg-in" style={{ alignSelf: 'flex-start', display: 'flex', gap: 10 }}>
                <VAvatar />
                <div style={{ background: P.aiBg, border: `1px solid ${P.border}`, borderRadius: '4px 14px 14px 14px', padding: '11px 16px', color: P.textMuted, fontSize: 14 }}>thinking<span className="blink">_</span></div>
              </div>
            )}
            {isTyping && typingText && (
              <div className="msg-in" style={{ alignSelf: 'flex-start', maxWidth: '84%', display: 'flex', gap: 10 }}>
                <VAvatar />
                <div style={{ background: P.aiBg, border: `1px solid ${P.border}`, borderRadius: '4px 14px 14px 14px', padding: '11px 16px', color: P.textSec, fontSize: 14, lineHeight: 1.75, fontWeight: 300 }}>{typingText}<span className="blink" style={{ fontSize: 12 }}>_</span></div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          </div>
        </div>

        {/* dock: topics + input, pinned below the scroll area */}
        <div className="dock">
          <div className="dock-inner">
            <div className="dock-chips">
              {TOPICS.map(t => (
                <button key={t.key} className="chip chip-accent" onClick={() => revealTopic(t.key)}>{t.label}</button>
              ))}
            </div>
            <ChatInput
              input={input} setInput={setInput}
              onSend={() => sendMessage(input)} onKey={handleKey}
              disabled={loading || isTyping}
              micSupported={micSupported} listening={listening} transcribing={transcribing} onMic={startListening}
              ttsSupported={ttsSupported} voiceOn={voiceOn} onToggleVoice={toggleVoice}
            />
            <div style={{ textAlign: 'center', color: P.faint, fontSize: 11 }}>
              © 2026 Vaibhav Shrivastava · Groq-powered · voice-enabled
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
