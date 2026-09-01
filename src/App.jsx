import React, { useState, useEffect, useRef, useCallback } from 'react'

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY

const SYSTEM_PROMPT = `You are Vaibhav Shrivastava, a Software Engineering Lead at Manifest Global (Cialfo), speaking in first person in a conversational, friendly but professional tone. Answer questions as if you are Vaibhav himself.

Key facts:
- Software Engineering Lead at Cialfo since August 2026 — own the UI repository end-to-end and am a key driver of the company's AI initiatives. Previously Senior Software Engineer there (Apr 2025–Aug 2026) and Frontend Engineer (Jul 2023–Apr 2025).
- Cialfo: Series B EdTech SaaS ($77M raised), 310,000+ students, 1,000+ universities, 105+ countries.
- Currently architecting Claude-powered agentic pipelines enabling PMs & designers (3–5 non-engineers) to generate and ship production code independently — ~75% velocity increase, days to hours.
- Main focus spans the UI and agentic repos: build internal tools and apply them across the UI, and lead the agentic chat experience end-to-end.
- Built an automated quality framework in Claude Code that tests the UI, agentic, and API repos against 130 benchmark questions plus their follow-ups, then auto-remediates failures until reaching a 100% pass rate.
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
  userBg:    '#2c2114',
  aiBg:      '#1f1810',
}
// aliases kept so shared data/logic stay readable
P.emerald = P.amber
P.orange = P.amber
P.blue = P.copper
P.purple = P.rose

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; overflow-x: hidden; }

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #17120e;
  color: #f6efe4;
  font-size: 15px;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  position: relative;
}

/* warm ambient glows */
body::before, body::after {
  content: '';
  position: fixed;
  z-index: 0;
  pointer-events: none;
  filter: blur(30px);
}
body::before {
  top: -240px; left: -160px;
  width: 720px; height: 620px;
  background: radial-gradient(ellipse at center, rgba(230,169,92,0.20) 0%, rgba(230,169,92,0.06) 42%, transparent 70%);
}
body::after {
  bottom: -300px; right: -180px;
  width: 760px; height: 680px;
  background: radial-gradient(ellipse at center, rgba(215,138,86,0.16) 0%, rgba(217,140,154,0.05) 45%, transparent 72%);
}

.display { font-family: 'Sora', 'Inter', sans-serif; }
.mono { font-family: 'JetBrains Mono', monospace; }

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #3c3228; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #55483a; }

a { text-decoration: none; color: inherit; }
button { cursor: pointer; font-family: inherit; }
input { font-family: inherit; }
input::placeholder { color: #6f6455; }

@keyframes bl { 50% { opacity: 0; } }
.blink { animation: bl 1s step-end infinite; }

/* warm gradient wordmark */
@keyframes gradientShift { from { background-position: 0% center; } to { background-position: 200% center; } }
.gradient-text {
  background: linear-gradient(100deg, #e6a95c 0%, #d78a56 35%, #d98c9a 65%, #e6a95c 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 7s linear infinite;
}

/* entrance */
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
.stagger > * { animation: fadeUp .7s cubic-bezier(.2,.7,.3,1) both; }
.stagger > *:nth-child(2){ animation-delay: .08s; }
.stagger > *:nth-child(3){ animation-delay: .16s; }
.stagger > *:nth-child(4){ animation-delay: .24s; }
.stagger > *:nth-child(5){ animation-delay: .32s; }

/* scroll reveal */
.reveal { opacity: 0; transform: translateY(26px); transition: opacity .7s cubic-bezier(.2,.7,.3,1), transform .7s cubic-bezier(.2,.7,.3,1); }
.reveal.in { opacity: 1; transform: none; }

/* buttons */
.btn {
  position: relative; overflow: hidden;
  border-radius: 11px; font-size: 14px; font-weight: 600;
  padding: 11px 22px; letter-spacing: .01em;
  transition: transform .18s cubic-bezier(.2,.7,.3,1), box-shadow .22s ease, filter .22s ease, background .22s ease, border-color .22s ease;
}
.btn:hover { transform: translateY(-2px); filter: brightness(1.05); }
.btn:active { transform: translateY(0) scale(.98); transition-duration: .06s; }
.btn::after {
  content: ''; position: absolute; top: 0; bottom: 0; left: -80%; width: 45%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,.28), transparent);
  transform: skewX(-20deg); pointer-events: none; transition: left .55s ease;
}
.btn:hover::after { left: 130%; }

.chip {
  transition: transform .16s cubic-bezier(.2,.7,.3,1), background .18s, border-color .18s, color .18s;
}
.chip:hover { transform: translateY(-2px); }

.skill-tag { transition: transform .15s cubic-bezier(.2,.7,.3,1), filter .15s ease, background .15s ease; cursor: default; }
.skill-tag:hover { transform: translateY(-2px); filter: brightness(1.22); }

.link-underline { position: relative; }
.link-underline::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -5px; height: 2px; border-radius: 2px;
  background: linear-gradient(90deg, #e6a95c, #d98c9a);
  transform: scaleX(0); transform-origin: left;
  transition: transform .25s cubic-bezier(.2,.7,.3,1);
}
.link-underline:hover::after { transform: scaleX(1); }

@keyframes pulseDot { 0% { box-shadow: 0 0 0 0 rgba(230,169,92,.5);} 70% { box-shadow: 0 0 0 7px rgba(230,169,92,0);} 100% { box-shadow: 0 0 0 0 rgba(230,169,92,0);} }
.pulse-dot { animation: pulseDot 2.4s ease-out infinite; }
@keyframes micPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(230,169,92,.5);} 70% { box-shadow: 0 0 0 9px rgba(230,169,92,0);} }
.mic-live { animation: micPulse 1.2s ease-out infinite; }

/* nav */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  background: rgba(23,18,14,0.72);
  border-bottom: 1px solid rgba(255,224,190,0.07);
}
.nav-inner { max-width: 1140px; margin: 0 auto; padding: 0 clamp(18px,4vw,32px); height: 64px; display: flex; align-items: center; justify-content: space-between; }
.nav-links { display: flex; gap: 30px; }
.nav-link { background: none; border: none; font-size: 14px; font-weight: 500; letter-spacing: .01em; color: #a2937f; transition: color .2s; }

/* floating avatar */
@keyframes floaty { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-10px);} }
.avatar-wrap {
  position: relative; width: 190px; height: 234px; flex-shrink: 0;
  border-radius: 22px; padding: 2px;
  background: linear-gradient(150deg, #e6a95c, #d78a56 50%, #d98c9a);
  box-shadow: 0 26px 60px -22px rgba(0,0,0,0.7), 0 0 60px rgba(230,169,92,0.18);
  animation: floaty 6.5s ease-in-out infinite;
}
.avatar-inner { position: relative; width: 100%; height: 100%; border-radius: 20px; overflow: hidden; background: #241c15; }
.avatar-inner img { width: 100%; height: 100%; object-fit: cover; object-position: center 16%; display: block; filter: saturate(1.02) contrast(1.05); }
.avatar-fade { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 60%, rgba(23,18,14,0.55) 100%); }
.avatar-badge {
  position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 7px; white-space: nowrap;
  background: rgba(23,18,14,0.82); backdrop-filter: blur(8px);
  border: 1px solid rgba(230,169,92,0.4); border-radius: 20px;
  padding: 5px 13px; font-size: 11px; font-weight: 500; color: #e6a95c;
}
.avatar-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #e6a95c; }

/* ── bento grid ─────────────────────────────────────────────── */
.bento {
  position: relative; z-index: 1;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  max-width: 1140px;
  margin: 0 auto;
  padding: 96px clamp(18px,4vw,32px) 40px;
  grid-template-areas:
    "hero hero hero hero hero hero hero st1 st1 st1 st2 st2"
    "hero hero hero hero hero hero hero agent agent agent agent agent"
    "chat chat chat chat chat chat chat skills skills skills skills skills"
    "chat chat chat chat chat chat chat skills skills skills skills skills"
    "about about about about eval eval eval eval code code code code"
    "time time time time time time time time time time time time";
}
.tile {
  position: relative;
  background: linear-gradient(158deg, rgba(255,238,214,0.055), rgba(255,238,214,0.015));
  border: 1px solid rgba(255,224,190,0.09);
  border-radius: 22px;
  padding: 26px 28px;
  overflow: hidden;
  min-width: 0;
  backdrop-filter: blur(6px);
  box-shadow: 0 30px 60px -34px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,240,220,0.06);
  transition: transform .32s cubic-bezier(.2,.7,.3,1), border-color .32s ease, box-shadow .32s ease, opacity .6s ease;
}
.tile:hover {
  transform: translateY(-5px);
  border-color: rgba(230,169,92,0.34);
  box-shadow: 0 44px 84px -36px rgba(0,0,0,0.85), 0 0 0 1px rgba(230,169,92,0.14), inset 0 1px 0 rgba(255,240,220,0.09);
}
.tile-accent::before {
  content: ''; position: absolute; top: 0; left: 24px; right: 24px; height: 2px; border-radius: 2px;
  background: var(--accent, #e6a95c); opacity: .85;
}
.eyebrow { font-size: 10.5px; letter-spacing: .18em; font-weight: 600; text-transform: uppercase; }

.hero-grid { display: flex; align-items: center; gap: 30px; }
.hero-name { font-size: 52px; font-weight: 700; line-height: 1.04; letter-spacing: -0.02em; }
.hero-buttons { display: flex; flex-wrap: wrap; gap: 10px; }

@media (max-width: 960px) {
  .bento { grid-template-columns: 1fr; grid-template-areas: none; gap: 14px; padding-top: 88px; }
  .tile { grid-area: auto !important; }
  .hero-grid { flex-direction: column-reverse; text-align: center; align-items: center; gap: 24px; }
  .hero-buttons { justify-content: center; }
  .nav-links { display: none; }
  .hero-name { font-size: 44px; }
}

@media (prefers-reduced-motion: reduce) {
  .stagger > *, .pulse-dot, .mic-live, .gradient-text, .avatar-wrap { animation: none; }
  .btn, .skill-tag, .link-underline::after, .reveal, .tile { transition: none; }
  .btn:hover, .skill-tag:hover, .tile:hover { transform: none; }
  .reveal { opacity: 1; transform: none; }
}
`

// ─── DATA ───────────────────────────────────────────────────────────────────────
const EXPERIENCE = [
  { role: 'Software Engineering Lead', company: 'Manifest Global (Cialfo)', period: 'Aug 2026 – Present', current: true, color: P.amber },
  { role: 'Senior Software Engineer', company: 'Manifest Global (Cialfo)', period: 'Apr 2025 – Aug 2026', current: false, color: P.copper },
  { role: 'Frontend Engineer', company: 'Manifest Global (Cialfo)', period: 'Jul 2023 – Apr 2025', current: false, color: P.rose },
  { role: 'Software Engineer – Frontend', company: 'MAQ Software', period: 'May 2022 – Jun 2023', current: false, color: P.sand },
  { role: 'Application Development Associate', company: 'Accenture', period: 'Jul 2021 – Mar 2022', current: false, color: P.textMuted },
]

const SKILLS = [
  { category: 'Frontend', color: P.amber, items: ['Angular', 'TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Tailwind CSS', 'Angular Material', 'RxJS'] },
  { category: 'Cloud / Backend', color: P.copper, items: ['Cloudflare Workers', 'Wrangler', 'Serverless API Design'] },
  { category: 'AI & Agentic', color: P.rose, items: ['Claude Code', 'Claude Routines', 'LangChain', 'LangGraph', 'Agentic Workflows', 'No-dev Pipelines', 'Cloudflare RAG', 'Tool Integrations'] },
  { category: 'Testing & Analytics', color: P.sand, items: ['Jasmine', 'Karma', 'Jest', 'Unit Testing (91%+)', 'Evals', 'Automated Code Review', 'Segment'] },
]

const SUGGESTED_PROMPTS = [
  'Tell me about your AI workflow work',
  "What's your biggest achievement?",
  'What stack do you use daily?',
  'How do you approach system design?',
]

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ active }) {
  const links = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'chat', label: 'Chat' },
  ]
  return (
    <nav className="nav">
      <div className="nav-inner">
        <button onClick={() => scrollToSection('hero')} className="display" style={{ border: 'none', background: 'none', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', color: P.textPri, display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(150deg, #e6a95c, #d98c9a)', color: '#1c130c', fontSize: 13, fontWeight: 700 }}>V</span>
          Vaibhav
        </button>
        <div className="nav-links">
          {links.map(l => (
            <button key={l.id} className="nav-link link-underline" onClick={() => scrollToSection(l.id)} style={{ color: active === l.id ? P.amber : P.textMuted }}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

// ─── TILE ───────────────────────────────────────────────────────────────────────
function Tile({ area, id, accent, reveal, children, className = '', style = {} }) {
  const s = { gridArea: area, ...style }
  if (accent) s['--accent'] = accent
  return (
    <div id={id} className={`tile${accent ? ' tile-accent' : ''}${reveal ? ' reveal' : ''} ${className}`} style={s}>
      {children}
    </div>
  )
}

function HeroTile() {
  return (
    <Tile area="hero" id="hero" style={{ padding: '34px 36px' }}>
      <div className="hero-grid">
        <div className="stagger" style={{ flex: 1, minWidth: 0 }}>
          <div className="eyebrow" style={{ color: P.amber, marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(230,169,92,0.10)', border: '1px solid rgba(230,169,92,0.28)', borderRadius: 30, padding: '5px 13px' }}>
            <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: P.amber, display: 'inline-block' }} />
            Agentic AI · UI Engineering
          </div>
          <h1 className="display hero-name">
            <span style={{ color: P.textPri }}>Vaibhav</span><br />
            <span className="gradient-text">Shrivastava</span>
          </h1>
          <div style={{ color: P.textSec, fontSize: 15, margin: '16px 0 14px', fontWeight: 500 }}>
            Software Engineering Lead <span style={{ color: P.faint }}>·</span> Noida, India <span style={{ color: P.faint }}>·</span> 5+ yrs
          </div>
          <p style={{ color: P.textMuted, lineHeight: 1.8, marginBottom: 26, fontWeight: 300, fontSize: 14.5, maxWidth: 440 }}>
            Leading UI and agentic AI work at Cialfo — multiplying team output by letting PMs and designers prototype and ship, without compromising code quality.
          </p>
          <div className="hero-buttons">
            <a href="mailto:vshrivastava103@gmail.com">
              <button className="btn" style={{ background: 'linear-gradient(100deg, #e6a95c, #d78a56)', color: '#1c130c', border: 'none', boxShadow: '0 10px 24px -10px rgba(230,169,92,0.6)' }}>Get in touch</button>
            </a>
            <a href="https://www.linkedin.com/in/vaibhav-shrivastava-aa637116a/" target="_blank" rel="noopener noreferrer">
              <button className="btn" style={{ background: 'rgba(255,238,214,0.05)', color: P.textSec, border: '1px solid rgba(255,224,190,0.16)' }}>LinkedIn</button>
            </a>
            <a href="/Vaibhav_Shrivastava_Resume.pdf" target="_blank" rel="noopener noreferrer">
              <button className="btn" style={{ background: 'rgba(255,238,214,0.05)', color: P.textSec, border: '1px solid rgba(255,224,190,0.16)' }}>Résumé</button>
            </a>
            <button className="btn" onClick={() => scrollToSection('chat')} style={{ background: 'rgba(217,140,154,0.10)', color: P.rose, border: '1px solid rgba(217,140,154,0.34)' }}>Ask me anything</button>
          </div>
        </div>
        <div className="avatar-wrap">
          <div className="avatar-inner">
            <img src="/avatar.png" alt="Vaibhav Shrivastava" />
            <div className="avatar-fade" />
            <div className="avatar-badge"><span className="avatar-badge-dot pulse-dot" />Agentic AI · Frontend</div>
          </div>
        </div>
      </div>
    </Tile>
  )
}

function StatTile({ area, value, label, sub, accent }) {
  return (
    <Tile area={area} accent={accent} reveal>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <div className="display" style={{ fontSize: 44, fontWeight: 700, color: accent, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
        <div style={{ color: P.textSec, fontSize: 13.5, marginTop: 12, fontWeight: 500 }}>{label}</div>
        {sub && <div className="mono" style={{ color: P.textMuted, fontSize: 11, marginTop: 5 }}>{sub}</div>}
      </div>
    </Tile>
  )
}

function WorkTile({ area, tag, title, body, accent }) {
  return (
    <Tile area={area} accent={accent} reveal>
      <div className="eyebrow" style={{ color: accent, marginBottom: 12 }}>{tag}</div>
      <div className="display" style={{ color: P.textPri, fontSize: 18, fontWeight: 600, marginBottom: 10, letterSpacing: '-0.01em' }}>{title}</div>
      <p style={{ color: P.textMuted, fontSize: 13.5, lineHeight: 1.72, fontWeight: 300 }}>{body}</p>
    </Tile>
  )
}

function AboutTile() {
  return (
    <Tile area="about" id="about" accent={P.amber} reveal>
      <div className="eyebrow" style={{ color: P.amber, marginBottom: 14 }}>About</div>
      <p style={{ color: P.textSec, fontSize: 14, lineHeight: 1.8, fontWeight: 300 }}>
        Software Engineering Lead at <span style={{ color: P.textPri, fontWeight: 500 }}>Cialfo</span> — a Series B EdTech SaaS ($77M raised) serving 310,000+ students and 1,000+ universities across 105+ countries. I own the UI codebase and drive the company's AI-front work, building systems that let non-engineers ship production code.
      </p>
    </Tile>
  )
}

function SkillsTile() {
  return (
    <Tile area="skills" id="skills" accent={P.rose} reveal>
      <div className="eyebrow" style={{ color: P.rose, marginBottom: 18 }}>Skills</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {SKILLS.map((cat, i) => (
          <div key={i}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: cat.color, marginBottom: 8, fontWeight: 500, textTransform: 'uppercase' }}>{cat.category}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {cat.items.map((it, j) => (
                <span key={j} className="skill-tag" style={{ display: 'inline-block', background: `${cat.color}18`, border: `1px solid ${cat.color}33`, borderRadius: 8, padding: '4px 11px', fontSize: 12, color: cat.color, fontWeight: 500 }}>{it}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Tile>
  )
}

function TimelineTile() {
  return (
    <Tile area="time" id="experience" accent={P.copper} reveal>
      <div className="eyebrow" style={{ color: P.copper, marginBottom: 18 }}>Experience</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {EXPERIENCE.map((exp, i) => (
          <div key={i} style={{ flex: '1 1 178px', minWidth: 155, borderLeft: `2px solid ${exp.color}`, paddingLeft: 14 }}>
            {exp.current && <span className="mono" style={{ fontSize: 9, color: exp.color, letterSpacing: '0.08em', fontWeight: 600 }}>● CURRENT</span>}
            <div className="display" style={{ color: exp.color, fontSize: 13, fontWeight: 600, marginTop: exp.current ? 4 : 0 }}>{exp.role}</div>
            <div style={{ color: P.textSec, fontSize: 12.5, fontWeight: 500 }}>{exp.company}</div>
            <div className="mono" style={{ color: P.textMuted, fontSize: 10.5, marginTop: 3 }}>{exp.period}</div>
          </div>
        ))}
      </div>
    </Tile>
  )
}

// ─── CHAT ───────────────────────────────────────────────────────────────────────
function ChatTile() {
  return (
    <Tile area="chat" id="chat" accent={P.amber} reveal>
      <ChatSection />
    </Tile>
  )
}

function ChatSection() {
  const [messages, setMessages] = useState([])
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)
  const nextId = useRef(0)

  const [listening, setListening] = useState(false)
  const [voiceOn, setVoiceOn] = useState(false)
  const voiceOnRef = useRef(false)
  const recognitionRef = useRef(null)
  const micSupported = typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const speakText = useCallback((text) => {
    if (!voiceOnRef.current || !('speechSynthesis' in window)) return
    try {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 1.03
      u.pitch = 1
      u.lang = 'en-US'
      window.speechSynthesis.speak(u)
    } catch { /* ignore */ }
  }, [])

  const toggleVoice = useCallback(() => {
    setVoiceOn(v => {
      const next = !v
      voiceOnRef.current = next
      if (!next && 'speechSynthesis' in window) window.speechSynthesis.cancel()
      return next
    })
  }, [])

  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel() }, [])

  useEffect(() => {
    if (messages.length === 0 && !loading && !isTyping) return
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingText, loading, isTyping])

  const animateTyping = useCallback((text, onDone) => {
    setIsTyping(true)
    setTypingText('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setTypingText(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setIsTyping(false)
        onDone()
      }
    }, 18)
  }, [])

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading || isTyping) return

    if ('speechSynthesis' in window) window.speechSynthesis.cancel()

    const userMsg = { role: 'user', content: text, id: nextId.current++ }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const newHistory = [...history, { role: 'user', content: text }]

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...newHistory],
          max_tokens: 800,
          temperature: 0.75,
          reasoning_effort: 'low',
          include_reasoning: false,
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
  }, [history, loading, isTyping, animateTyping, speakText])

  const handleKey = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }, [input, sendMessage])

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    if (recognitionRef.current) { try { recognitionRef.current.stop() } catch { /* ignore */ } return }
    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setInput(transcript)
      sendMessage(transcript)
    }
    rec.onend = () => { setListening(false); recognitionRef.current = null }
    rec.onerror = () => { setListening(false); recognitionRef.current = null }
    recognitionRef.current = rec
    setListening(true)
    try { rec.start() } catch { setListening(false); recognitionRef.current = null }
  }, [sendMessage])

  const showSuggestions = messages.length === 0 && !loading && !isTyping

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
        <div className="display eyebrow" style={{ color: P.amber, letterSpacing: '0.16em' }}>Ask me anything</div>
        <div className="mono" style={{ fontSize: 10, color: P.textMuted }}>Groq · voice-enabled</div>
      </div>

      {showSuggestions && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {SUGGESTED_PROMPTS.map((p, i) => (
            <SuggestionChip key={i} text={p} onClick={() => sendMessage(p)} />
          ))}
        </div>
      )}

      <div style={{
        background: 'rgba(0,0,0,0.22)',
        border: '1px solid rgba(255,224,190,0.08)',
        borderRadius: 16,
        flex: 1,
        minHeight: 200,
        maxHeight: 420,
        overflowY: 'auto',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        marginBottom: 12,
      }}>
        {messages.length === 0 && !loading && !isTyping && (
          <div style={{ margin: 'auto', textAlign: 'center' }}>
            <span style={{ color: P.faint, fontSize: 13.5 }}>Type or speak to start the conversation</span>
          </div>
        )}

        {messages.map(msg =>
          msg.role === 'user'
            ? <UserBubble key={msg.id} content={msg.content} />
            : <AiBubble key={msg.id} content={msg.content} />
        )}

        {loading && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
            <div style={{
              background: P.aiBg, border: `1px solid ${P.border}`,
              borderRadius: '4px 14px 14px 14px', padding: '12px 16px',
              color: P.textMuted, fontSize: 14,
            }}>
              thinking<span className="blink">_</span>
            </div>
          </div>
        )}

        {isTyping && typingText && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
            <div style={{
              background: P.aiBg, border: `1px solid ${P.border}`,
              borderRadius: '4px 14px 14px 14px', padding: '12px 16px',
              color: P.textSec, fontSize: 14, lineHeight: 1.75, fontWeight: 300,
            }}>
              {typingText}<span className="blink" style={{ fontSize: 12 }}>_</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        onSend={() => sendMessage(input)}
        onKey={handleKey}
        disabled={loading || isTyping}
        micSupported={micSupported}
        listening={listening}
        onMic={startListening}
        ttsSupported={ttsSupported}
        voiceOn={voiceOn}
        onToggleVoice={toggleVoice}
      />
    </div>
  )
}

function SuggestionChip({ text, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      className="chip"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(230,169,92,0.12)' : 'rgba(255,238,214,0.03)',
        border: `1px solid ${hovered ? 'rgba(230,169,92,0.4)' : 'rgba(255,224,190,0.12)'}`,
        color: hovered ? P.textPri : P.textMuted,
        padding: '7px 15px', fontSize: 12.5,
        borderRadius: 20, fontWeight: 400,
      }}
    >
      {text}
    </button>
  )
}

function UserBubble({ content }) {
  return (
    <div style={{
      alignSelf: 'flex-end', maxWidth: '78%',
      background: 'linear-gradient(150deg, rgba(230,169,92,0.20), rgba(215,138,86,0.14))',
      border: '1px solid rgba(230,169,92,0.3)',
      borderRadius: '14px 14px 4px 14px',
      padding: '11px 16px',
      color: P.textPri, fontSize: 14, lineHeight: 1.7,
    }}>
      {content}
    </div>
  )
}

function AiBubble({ content }) {
  return (
    <div style={{ alignSelf: 'flex-start', maxWidth: '82%', display: 'flex', gap: 10 }}>
      <span className="display" style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(150deg, #e6a95c, #d98c9a)', color: '#1c130c', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>V</span>
      <div style={{
        background: P.aiBg, border: `1px solid ${P.border}`,
        borderRadius: '4px 14px 14px 14px',
        padding: '11px 16px',
        color: P.textSec, fontSize: 14, lineHeight: 1.75, fontWeight: 300,
      }}>
        {content}
      </div>
    </div>
  )
}

function ChatInput({ input, setInput, onSend, onKey, disabled, micSupported, listening, onMic, ttsSupported, voiceOn, onToggleVoice }) {
  const [focused, setFocused] = useState(false)
  const iconBtn = (active, color) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
    background: active ? `${color}22` : 'transparent',
    border: `1px solid ${active ? color : 'rgba(255,224,190,0.14)'}`,
    color: active ? color : P.textMuted,
    transition: 'background .2s, border-color .2s, color .2s, transform .15s',
  })
  const ready = input.trim() && !disabled
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'rgba(0,0,0,0.22)',
      border: `1px solid ${listening ? P.amber : (focused ? 'rgba(230,169,92,0.4)' : 'rgba(255,224,190,0.1)')}`,
      borderRadius: 14, padding: '9px 11px',
      transition: 'border-color 0.2s',
      opacity: disabled ? 0.6 : 1,
    }}>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={onKey}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={listening ? 'Listening… speak now' : (micSupported ? 'Type, or tap the mic to speak…' : 'Type your question and press Enter…')}
        disabled={disabled}
        style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: P.textPri, letterSpacing: '0.01em', paddingLeft: 6 }}
      />
      {ttsSupported && (
        <button onClick={onToggleVoice} title={voiceOn ? 'Voice replies: on' : 'Voice replies: off'} aria-label={voiceOn ? 'Turn off voice replies' : 'Turn on voice replies'} style={iconBtn(voiceOn, P.copper)}>
          {voiceOn ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          )}
        </button>
      )}
      {micSupported && (
        <button onClick={onMic} disabled={disabled} title={listening ? 'Listening…' : 'Speak your question'} aria-label="Speak your question" className={listening ? 'mic-live' : undefined} style={iconBtn(listening, P.amber)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
        </button>
      )}
      <button onClick={onSend} disabled={disabled} className="btn" style={{
        background: ready ? 'linear-gradient(100deg, #e6a95c, #d78a56)' : 'transparent',
        border: `1px solid ${ready ? 'transparent' : 'rgba(255,224,190,0.14)'}`,
        color: ready ? '#1c130c' : P.textMuted,
        fontSize: 13, fontWeight: 600, padding: '9px 18px', borderRadius: 10, flexShrink: 0,
      }}>
        Send
      </button>
    </div>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function FooterLink({ href, label, onClick }) {
  const external = href && href.startsWith('http')
  return (
    <a href={href} className="link-underline" onClick={onClick} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} style={{ color: P.textSec, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
      {label}
    </a>
  )
}

function Footer() {
  return (
    <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,224,190,0.07)', padding: '36px clamp(18px,4vw,32px)', marginTop: 8 }}>
      <div className="footer-inner" style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
        <span style={{ color: P.textMuted, fontSize: 13 }}>© 2026 Vaibhav Shrivastava</span>
        <div className="footer-links" style={{ display: 'flex', gap: 24 }}>
          <FooterLink href="mailto:vshrivastava103@gmail.com" label="Email" />
          <FooterLink href="https://www.linkedin.com/in/vaibhav-shrivastava-aa637116a/" label="LinkedIn" />
          <FooterLink href="/Vaibhav_Shrivastava_Resume.pdf" label="Résumé" />
          <FooterLink label="Back to top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} href="#" />
        </div>
      </div>
    </footer>
  )
}

// ─── APP ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const ids = ['hero', 'about', 'experience', 'skills', 'chat']
    const observers = ids.map(id => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-10% 0px -85% 0px', threshold: 0 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Nav active={active} />
      <main className="bento">
        <HeroTile />
        <StatTile area="st1" accent={P.amber} value="~75%" label="Delivery velocity gain" sub="days → hours" />
        <StatTile area="st2" accent={P.copper} value="100%" label="Eval pass rate" sub="130 questions" />
        <WorkTile area="agent" accent={P.amber} tag="Signature work" title="Agentic AI pipelines" body="Claude-powered pipelines that let PMs & designers ship production-ready code independently — the core of Cialfo's no-dev workflow platform." />
        <ChatTile />
        <SkillsTile />
        <AboutTile />
        <WorkTile area="eval" accent={P.rose} tag="Quality engine" title="130-question eval framework" body="An automated Claude Code suite that tests the UI, agentic & API repos against 130 questions plus follow-ups, auto-fixing until a 100% pass rate." />
        <WorkTile area="code" accent={P.copper} tag="Automation" title="Code review on autopilot" body="Claude routines review every change and surface issues automatically — no manual kickoff." />
        <TimelineTile />
      </main>
      <Footer />
    </>
  )
}
