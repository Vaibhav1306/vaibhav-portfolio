import React, { useState, useEffect, useRef, useCallback } from 'react'

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY

const SYSTEM_PROMPT = `You are Vaibhav Shrivastava, a Senior Software Engineer at Manifest Global (Cialfo), speaking in first person in a conversational, friendly but professional tone. Answer questions as if you are Vaibhav himself.

Key facts:
- Senior Software Engineer at Cialfo since April 2025. Previously Frontend Engineer there (Jul 2023–Apr 2025).
- Cialfo: Series B EdTech SaaS ($77M raised), 310,000+ students, 1,000+ universities, 105+ countries.
- Currently architecting Claude-powered agentic pipelines enabling PMs & designers (3–5 non-engineers) to generate and ship production code independently — ~75% velocity increase, days to hours.
- Proficient in Claude Code skill authoring; own the end-to-end skill library powering the no-dev workflow platform.
- Built pre-commit hook infrastructure enabling non-developer contributions to production codebases.
- Delivered multi-brand AI chatbot via Cloudflare Workers + Cloudflare-managed RAG; drove ~30% PLT reduction.
- Mentored 2 AI engineering interns to on-time delivery.
- Previously: MAQ Software (Angular enterprise, 91%+ test coverage), Accenture.
- Education: B.Tech IT, Technocrats Institute of Technology Bhopal, CGPA 8.64, 2021.
- Core skills: Angular (expert), TypeScript, JavaScript, Tailwind, RxJS, Cloudflare Workers, Claude Code, RAG, Jasmine/Karma.
- Email: vshrivastava103@gmail.com
- LinkedIn: https://www.linkedin.com/in/vaibhav-shrivastava-aa637116a/

Rules:
- Always respond in first person, conversational and friendly but professional.
- Keep answers to 2–4 sentences unless a detailed technical question warrants more.
- If asked something not in your context, say: "That's not something I've shared publicly yet — feel free to reach out on LinkedIn!"
- Never make up details not listed above.
- This portfolio is about showcasing my work and capabilities, not job-seeking. If asked whether I'm open to opportunities, looking for a job, or available to switch, do NOT confirm or deny job-seeking. Deflect warmly and redirect to the work itself — e.g. "I'm really focused on the agentic AI work I'm doing at Cialfo right now. Happy to connect professionally on LinkedIn if you'd like to talk shop!" Keep it about the craft, never about availability.`

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', sans-serif;
  background: #0f172a;
  color: #f1f5f9;
  font-size: 15px;
  line-height: 1.8;
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: #0f172a; }
::-webkit-scrollbar-thumb { background: #34d39950; border-radius: 2px; }

@keyframes bl { 50% { opacity: 0; } }
.blink { animation: bl 1s step-end infinite; }

a { text-decoration: none; color: inherit; }
button { cursor: pointer; font-family: inherit; }
input { font-family: inherit; }
input::placeholder { color: #475569; }

.mono { font-family: 'JetBrains Mono', monospace; }

.gradient-text {
  background: linear-gradient(100deg, #34d399 0%, #60a5fa 50%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links { display: flex; gap: 32px; }

.hero-name {
  font-family: 'Inter', sans-serif;
  font-size: 68px;
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.03em;
}

.hero-buttons { display: flex; gap: 12px; flex-wrap: wrap; }

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
  gap: 16px;
}

.exp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-layout {
  display: flex;
  align-items: center;
  gap: 64px;
}

.hero-photo-col {
  flex-shrink: 0;
  position: relative;
}

/* ambient glow behind photo — highlights & ties it into the hero backdrop */
.hero-photo-col::before {
  content: '';
  position: absolute;
  inset: -50px;
  background: radial-gradient(ellipse at center, #34d39933 0%, #60a5fa20 45%, transparent 72%);
  pointer-events: none;
  z-index: 0;
}

.hero-photo-wrap {
  position: relative;
  z-index: 1;
  width: 270px;
  height: 330px;
  border-radius: 20px;
  background: linear-gradient(150deg, #34d39966 0%, #60a5fa44 50%, #c084fc66 100%);
  padding: 1px;
  box-shadow: 0 20px 60px -15px #000000a0, 0 0 70px #34d39933;
}

.hero-photo-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  overflow: hidden;
  background: #1e293b;
}

.hero-photo-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 18%;
  display: block;
  /* crisp & bright, lightly cooled to sit in the palette */
  filter: saturate(0.96) contrast(1.1) brightness(1.05);
}

/* gradient tint — subtle harmonization, kept light for clarity */
.hero-photo-tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(155deg, rgba(52,211,153,0.10) 0%, rgba(96,165,250,0.04) 50%, rgba(192,132,252,0.10) 100%);
  mix-blend-mode: soft-light;
  pointer-events: none;
}

/* bottom fade — gentle edge blend, starts low so the face stays clear */
.hero-photo-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 72%, rgba(15,23,42,0.32) 100%);
  pointer-events: none;
}

.hero-badge {
  position: absolute;
  z-index: 2;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15,23,42,0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid #34d39955;
  border-radius: 20px;
  padding: 6px 15px;
  font-size: 11.5px;
  font-weight: 500;
  color: #34d399;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: linear-gradient(135deg, #34d399, #60a5fa);
  box-shadow: 0 0 8px #34d39988;
}

@media (max-width: 768px) {
  .hero-layout { flex-direction: column-reverse; gap: 36px; align-items: center; }
  .hero-text { text-align: center; }
  .hero-photo-wrap { width: 210px; height: 256px; }
  .hero-buttons { justify-content: center; }
}

@media (max-width: 600px) {
  .nav-links { display: none; }
  .hero-name { font-size: 44px; }
  .hero-buttons { flex-direction: column; align-items: stretch; width: 100%; max-width: 300px; margin: 0 auto; }
  .hero-buttons a, .hero-buttons button { width: 100%; }
  .hero-buttons button { width: 100%; }
  .exp-header { flex-direction: column; align-items: flex-start; }
  .footer-inner { flex-direction: column; text-align: center; gap: 18px; }
}
`

// ─── PALETTE ──────────────────────────────────────────────────────────────────

const P = {
  bg:         '#0f172a',
  surface:    '#1e293b',
  border:     '#334155',
  emerald:    '#34d399',
  blue:       '#60a5fa',
  purple:     '#c084fc',
  orange:     '#fb923c',
  textPri:    '#f1f5f9',
  textSec:    '#e2e8f0',
  textMuted:  '#94a3b8',
  userBg:     '#0d2818',
  aiBg:       '#162032',
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const EXPERIENCE = [
  {
    company: 'Manifest Global (Cialfo)',
    role: 'Senior Software Engineer',
    period: 'Apr 2025 – Present',
    current: true,
    color: P.emerald,
    bullets: [
      'Architected Claude-powered agentic pipelines enabling PMs & designers (3–5 non-engineers) to generate and ship production-ready code prototypes independently — ~75% delivery velocity increase.',
      'Proficient in writing and iteratively optimizing Claude Code skills; owns the end-to-end skill library powering the no-dev workflow platform.',
      'Built pre-commit hook infrastructure and automated validation gates enabling non-developer contributions to production codebases.',
      'Delivered production AI chatbot features across multiple brands using Cloudflare Workers with Cloudflare-managed RAG and tool integrations.',
      'Drove ~30% reduction in Page Load Time (PLT) through Web Vitals profiling, lazy loading strategies, and asset pipeline refactoring.',
      'Leads end-to-end delivery of business-critical projects across Product, Design, Business, and QA.',
      'Mentored two AI engineering interns to on-time delivery of production-ready features.',
    ],
  },
  {
    company: 'Manifest Global (Cialfo)',
    role: 'Frontend Engineer',
    period: 'Jul 2023 – Apr 2025',
    current: false,
    color: P.blue,
    bullets: [
      'Independently owned multiple frontend projects; collaborated directly with PMs and Designers to define MVP scope and present demos to leadership.',
      'Designed and deployed serverless APIs using Cloudflare Workers and Wrangler with CRM workflows and AI-assisted response capabilities.',
      'Built and maintained scalable component library using Angular, Tailwind CSS, and Angular Material.',
      'Implemented Segment-based frontend event tracking for data-driven product decisions.',
    ],
  },
  {
    company: 'MAQ Software',
    role: 'Software Engineer – Frontend',
    period: 'May 2022 – Jun 2023',
    current: false,
    color: P.purple,
    bullets: [
      'Built production-grade Angular applications for enterprise clients with modular architecture and Angular best practices.',
      '91%+ unit test coverage using Jasmine and Karma — mandatory QA sign-off threshold.',
      'Implemented real-time UI features using WebSockets with backend teams.',
    ],
  },
  {
    company: 'Accenture',
    role: 'Application Development Associate',
    period: 'Jul 2021 – Mar 2022',
    current: false,
    color: P.orange,
    bullets: [
      'Contributed to enterprise-scale Angular applications in large Agile delivery workflows.',
    ],
  },
]

const SKILLS = [
  {
    category: 'Frontend',
    color: P.emerald,
    items: ['Angular', 'TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Tailwind CSS', 'Angular Material', 'RxJS', 'FontAwesome'],
  },
  {
    category: 'Cloud / Backend',
    color: P.blue,
    items: ['Cloudflare Workers', 'Wrangler', 'Serverless API Design'],
  },
  {
    category: 'AI & Agentic',
    color: P.purple,
    items: ['Claude Code', 'Agentic Workflows', 'No-dev Pipeline Architecture', 'Cloudflare RAG', 'Tool Integrations'],
  },
  {
    category: 'Testing & Analytics',
    color: P.orange,
    items: ['Jasmine', 'Karma', 'Unit Testing (91%+)', 'Segment Analytics'],
  },
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
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      borderBottom: '1px solid #1e293b',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      background: 'rgba(15,23,42,0.90)',
    }}>
      <div style={{
        maxWidth: 880,
        margin: '0 auto',
        padding: '0 28px',
        height: 58,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={() => scrollToSection('hero')}
          className="mono"
          style={{
            border: 'none',
            fontSize: 14, fontWeight: 500,
            letterSpacing: '0.04em',
            background: 'linear-gradient(90deg, #34d399, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ~/vaibhav<span style={{ WebkitTextFillColor: '#60a5fa' }} className="blink">_</span>
        </button>

        <div className="nav-links">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => scrollToSection(l.id)}
              style={{
                background: 'none', border: 'none',
                fontSize: 14, fontWeight: 500,
                color: active === l.id ? P.emerald : P.textMuted,
                letterSpacing: '0.01em',
                transition: 'color 0.2s',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="hero" style={{ paddingTop: 130, paddingBottom: 88, position: 'relative' }}>
      {/* Soft radial glow */}
      <div style={{
        position: 'absolute',
        top: 80, left: -100,
        width: 700, height: 460,
        background: 'radial-gradient(ellipse, #34d39910 0%, #60a5fa08 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="hero-layout">
        {/* Left: text */}
        <div className="hero-text" style={{ flex: 1, minWidth: 0 }}>
          <div className="mono" style={{
            color: P.emerald, fontSize: 12,
            marginBottom: 28, opacity: 0.65, letterSpacing: '0.1em',
          }}>
            ▶ vaibhav@portfolio:~$ whoami
          </div>

          <h1>
            <div className="hero-name" style={{ color: P.textPri, marginBottom: 6 }}>
              Vaibhav
            </div>
            <div className="hero-name gradient-text" style={{ marginBottom: 24 }}>
              Shrivastava
            </div>
          </h1>

          <div style={{
            color: P.textSec, fontSize: 15,
            marginBottom: 14, fontWeight: 400,
          }}>
            Senior Software Engineer &nbsp;·&nbsp; Noida, India &nbsp;·&nbsp; 5 yrs exp
          </div>

          <p style={{
            color: P.textMuted,
            lineHeight: 1.9, marginBottom: 40,
            fontWeight: 300, fontSize: 15,
          }}>
            Building agentic AI pipelines and no-dev workflows at Cialfo —
            enabling non-engineers to ship production code independently.
          </p>

          <div className="hero-buttons">
            <a href="mailto:vshrivastava103@gmail.com">
              <button style={{
                background: 'linear-gradient(100deg, #34d399, #60a5fa)',
                color: '#071a12',
                border: 'none', padding: '12px 26px',
                fontSize: 14, fontWeight: 600,
                borderRadius: 8,
                boxShadow: '0 0 16px #34d39920',
              }}>
                Get in touch
              </button>
            </a>

            <a
              href="https://www.linkedin.com/in/vaibhav-shrivastava-aa637116a/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button style={{
                background: '#60a5fa14',
                color: P.blue,
                border: `1px solid ${P.blue}60`, padding: '12px 26px',
                fontSize: 14, fontWeight: 500,
                borderRadius: 8,
                transition: 'all 0.2s',
              }}>
                LinkedIn
              </button>
            </a>

            <button
              onClick={() => scrollToSection('chat')}
              style={{
                background: '#c084fc14',
                color: P.purple,
                border: `1px solid ${P.purple}60`, padding: '12px 26px',
                fontSize: 14, fontWeight: 500,
                borderRadius: 8,
                transition: 'all 0.2s',
              }}
            >
              Ask me anything
            </button>
          </div>
        </div>

        {/* Right: photo */}
        <div className="hero-photo-col">
          <div className="hero-photo-wrap">
            <div className="hero-photo-inner">
              <img src="/avatar.png" alt="Vaibhav Shrivastava" />
              <div className="hero-photo-tint" />
              <div className="hero-photo-fade" />
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                Agentic AI · Frontend
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────

function SectionLabel({ label, color }) {
  return (
    <div className="mono" style={{
      fontSize: 11, color,
      letterSpacing: '0.18em', marginBottom: 32, fontWeight: 600,
    }}>
      ──── {label}
    </div>
  )
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function About() {
  const [hovered, setHovered] = useState(false)

  return (
    <section id="about" style={{ paddingTop: 80, paddingBottom: 88, borderTop: '1px solid #1e293b' }}>
      <SectionLabel label="ABOUT" color={P.emerald} />
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: P.surface,
          border: `1px solid ${hovered ? P.emerald + '44' : P.border}`,
          borderRadius: 14,
          padding: '32px 38px',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          boxShadow: hovered ? '0 0 32px #34d39918' : 'none',
        }}
      >
        <div className="mono" style={{ color: '#1e4a2e', fontSize: 12, marginBottom: 24, letterSpacing: '0.05em' }}>
          cat about.md
        </div>
        <p style={{ color: P.textSec, marginBottom: 18, fontWeight: 300, lineHeight: 1.9, fontSize: 15 }}>
          I'm a Senior Software Engineer at{' '}
          <span style={{ color: P.textPri, fontWeight: 500 }}>Cialfo</span> — a Series B
          EdTech SaaS platform serving 310,000+ students and 1,000+ universities across 105+
          countries. I bring 5 years of frontend engineering experience to building systems
          that push what's possible without a traditional dev workflow.
        </p>
        <p style={{ color: P.textSec, marginBottom: 18, fontWeight: 300, lineHeight: 1.9, fontSize: 15 }}>
          My current focus is on{' '}
          <span style={{ color: P.emerald, fontWeight: 500 }}>agentic AI pipelines</span> —
          architecting Claude-powered systems that allow PMs, designers, and other
          non-engineers to independently generate and ship production-ready code. I've also
          built multi-brand AI chatbots on Cloudflare Workers with RAG and driven meaningful
          performance improvements across the platform.
        </p>
        <p style={{ color: P.textSec, fontWeight: 300, lineHeight: 1.9, fontSize: 15 }}>
          I care about the craft: clean architecture, measurable outcomes, and making complex
          systems feel simple. If you want to talk about agentic workflows, no-dev platforms,
          or anything in between — I'm right below.
        </p>
      </div>
    </section>
  )
}

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────

function ExperienceSection() {
  return (
    <section id="experience" style={{ paddingTop: 80, paddingBottom: 88, borderTop: '1px solid #1e293b' }}>
      <SectionLabel label="EXPERIENCE" color={P.blue} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {EXPERIENCE.map((exp, i) => <ExpCard key={i} exp={exp} />)}
      </div>
    </section>
  )
}

function ExpCard({ exp }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: P.surface,
        border: `1px solid ${hovered ? exp.color + '55' : P.border}`,
        borderRadius: 14,
        padding: '26px 30px',
        transition: 'border-color 0.25s, box-shadow 0.25s',
        boxShadow: hovered ? `0 0 28px ${exp.color}18` : 'none',
        borderLeft: `3px solid ${exp.color}`,
      }}
    >
      <div className="exp-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: P.textPri, fontWeight: 600, fontSize: 15 }}>
            {exp.company}
          </span>
          {exp.current && (
            <span style={{
              background: `${exp.color}18`,
              border: `1px solid ${exp.color}44`,
              color: exp.color,
              fontSize: 10,
              padding: '2px 10px',
              borderRadius: 20,
              letterSpacing: '0.08em',
              fontWeight: 600,
            }}>
              current
            </span>
          )}
        </div>
        <span style={{ color: P.textMuted, fontSize: 13 }}>{exp.period}</span>
      </div>

      <div style={{ color: exp.color, fontSize: 14, fontWeight: 500, marginBottom: 18 }}>
        {exp.role}
      </div>

      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {exp.bullets.map((b, i) => (
          <li key={i} style={{ display: 'flex', gap: 12, color: P.textSec, fontWeight: 300, lineHeight: 1.75, fontSize: 14 }}>
            <span style={{ color: exp.color, flexShrink: 0, marginTop: 2, opacity: 0.6 }}>›</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────

function SkillsSection() {
  return (
    <section id="skills" style={{ paddingTop: 80, paddingBottom: 88, borderTop: '1px solid #1e293b' }}>
      <SectionLabel label="SKILLS" color={P.purple} />
      <div className="skills-grid">
        {SKILLS.map((cat, i) => <SkillCard key={i} cat={cat} />)}
      </div>
    </section>
  )
}

function SkillCard({ cat }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: P.surface,
        border: `1px solid ${hovered ? cat.color + '55' : P.border}`,
        borderRadius: 14,
        padding: '22px',
        transition: 'border-color 0.25s, box-shadow 0.25s',
        boxShadow: hovered ? `0 0 28px ${cat.color}18` : 'none',
        borderTop: `2px solid ${cat.color}`,
      }}
    >
      <div className="mono" style={{
        color: cat.color,
        fontSize: 10, letterSpacing: '0.15em',
        fontWeight: 600, marginBottom: 16,
      }}>
        # {cat.category.toUpperCase()}
      </div>
      <div>
        {cat.items.map((item, i) => (
          <span key={i} style={{
            display: 'inline-block',
            background: `${cat.color}12`,
            border: `1px solid ${cat.color}30`,
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 12,
            color: cat.color,
            margin: '3px 3px',
            fontWeight: 400,
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────

function ChatSection() {
  const [messages, setMessages] = useState([])
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)
  const nextId = useRef(0)

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
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...newHistory],
          max_tokens: 300,
          temperature: 0.75,
        }),
      })

      const data = await res.json()
      const reply = data?.choices?.[0]?.message?.content || 'Something went wrong — please try again.'

      setHistory([...newHistory, { role: 'assistant', content: reply }])
      setLoading(false)

      animateTyping(reply, () => {
        setMessages(prev => [...prev, { role: 'ai', content: reply, id: nextId.current++ }])
        setTypingText('')
      })
    } catch {
      setLoading(false)
      setMessages(prev => [...prev, { role: 'ai', content: 'Network error — try again!', id: nextId.current++ }])
    }
  }, [history, loading, isTyping, animateTyping])

  const handleKey = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }, [input, sendMessage])

  const showSuggestions = messages.length === 0 && !loading && !isTyping

  return (
    <section id="chat" style={{ paddingTop: 80, paddingBottom: 88, borderTop: '1px solid #1e293b' }}>
      <SectionLabel label="ASK ME ANYTHING" color={P.orange} />

      {/* Intro card */}
      <div style={{
        background: P.surface,
        border: `1px solid ${P.orange}40`,
        borderRadius: 14,
        padding: '28px 34px',
        marginBottom: 28,
        boxShadow: '0 0 32px #fb923c10',
      }}>
        <div style={{ color: P.textPri, fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
          Chat with me directly
        </div>
        <p style={{ color: P.textMuted, fontSize: 14, lineHeight: 1.75, fontWeight: 300 }}>
          This AI knows my background and responds as me in first person. Ask about my
          experience, what I'm building at Cialfo, my tech stack, or how I approach
          engineering problems.
        </p>
      </div>

      {showSuggestions && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {SUGGESTED_PROMPTS.map((p, i) => (
            <SuggestionChip key={i} text={p} onClick={() => sendMessage(p)} />
          ))}
        </div>
      )}

      <div style={{
        background: P.surface,
        border: `1px solid ${P.border}`,
        borderRadius: 14,
        minHeight: 180,
        maxHeight: 360,
        overflowY: 'auto',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        marginBottom: 12,
      }}>
        {messages.length === 0 && !loading && !isTyping && (
          <div style={{ margin: 'auto', textAlign: 'center', color: P.textMuted, fontSize: 14, fontWeight: 300 }}>
            Pick a suggestion above or type your own question.
          </div>
        )}

        {messages.map(msg =>
          msg.role === 'user'
            ? <UserBubble key={msg.id} content={msg.content} />
            : <AiBubble key={msg.id} content={msg.content} />
        )}

        {loading && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
            <div className="mono" style={{ fontSize: 9, color: P.orange, marginBottom: 5, letterSpacing: '0.05em', opacity: 0.7 }}>
              vaibhav@portfolio:~$
            </div>
            <div style={{
              background: P.aiBg, border: `1px solid ${P.border}`,
              borderRadius: '10px 10px 10px 3px', padding: '12px 16px',
              color: P.textMuted, fontSize: 14, fontFamily: 'JetBrains Mono, monospace',
            }}>
              thinking<span className="blink">_</span>
            </div>
          </div>
        )}

        {isTyping && typingText && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
            <div className="mono" style={{ fontSize: 9, color: P.orange, marginBottom: 5, letterSpacing: '0.05em', opacity: 0.7 }}>
              vaibhav@portfolio:~$
            </div>
            <div style={{
              background: P.aiBg, border: `1px solid ${P.border}`,
              borderRadius: '10px 10px 10px 3px', padding: '12px 16px',
              color: P.textSec, fontSize: 14, lineHeight: 1.75, fontWeight: 300,
            }}>
              {typingText}<span className="mono blink" style={{ fontSize: 12 }}>_</span>
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
      />
    </section>
  )
}

function SuggestionChip({ text, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${P.orange}14` : 'none',
        border: `1px solid ${hovered ? P.orange + '55' : P.border}`,
        color: hovered ? P.textSec : P.textMuted,
        padding: '7px 16px', fontSize: 13,
        borderRadius: 20, fontWeight: 400,
        transition: 'all 0.2s',
      }}
    >
      {text}
    </button>
  )
}

function UserBubble({ content }) {
  return (
    <div style={{
      alignSelf: 'flex-end', maxWidth: '75%',
      background: P.userBg,
      border: `1px solid ${P.emerald}30`,
      borderRadius: '10px 10px 3px 10px',
      padding: '12px 16px',
      color: '#a7f3d0', fontSize: 14, lineHeight: 1.75,
    }}>
      {content}
    </div>
  )
}

function AiBubble({ content }) {
  return (
    <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
      <div className="mono" style={{ fontSize: 9, color: P.orange, marginBottom: 5, letterSpacing: '0.05em', opacity: 0.7 }}>
        vaibhav@portfolio:~$
      </div>
      <div style={{
        background: P.aiBg, border: `1px solid ${P.border}`,
        borderRadius: '10px 10px 10px 3px',
        padding: '12px 16px',
        color: P.textSec, fontSize: 14, lineHeight: 1.75, fontWeight: 300,
      }}>
        {content}
      </div>
    </div>
  )
}

function ChatInput({ input, setInput, onSend, onKey, disabled }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: P.surface,
      border: `1px solid ${focused ? P.orange + '55' : P.border}`,
      borderRadius: 10, padding: '12px 16px',
      transition: 'border-color 0.2s',
      opacity: disabled ? 0.6 : 1,
    }}>
      <span className="mono" style={{ color: P.orange, fontSize: 13, flexShrink: 0 }}>$</span>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={onKey}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Type your question and press Enter..."
        disabled={disabled}
        style={{
          flex: 1, background: 'none', border: 'none', outline: 'none',
          fontSize: 14, color: P.textPri, letterSpacing: '0.01em',
        }}
      />
      <button
        onClick={onSend}
        disabled={disabled}
        style={{
          background: input.trim() && !disabled ? 'linear-gradient(90deg, #34d399, #60a5fa)' : 'none',
          border: `1px solid ${input.trim() && !disabled ? 'transparent' : P.border}`,
          color: input.trim() && !disabled ? '#071a12' : P.textMuted,
          fontSize: 13, fontWeight: 600,
          padding: '6px 16px', borderRadius: 6, flexShrink: 0,
          transition: 'all 0.2s',
        }}
      >
        Send
      </button>
    </div>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function FooterLink({ href, label, onClick }) {
  const [hovered, setHovered] = useState(false)
  const external = href && href.startsWith('http')
  return (
    <a
      href={href}
      onClick={onClick}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: hovered ? P.emerald : P.textSec,
        fontSize: 14, fontWeight: 500,
        transition: 'color 0.2s',
        cursor: 'pointer',
      }}
    >
      {label}
    </a>
  )
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #1e293b', padding: '40px 28px' }}>
      <div className="footer-inner" style={{
        maxWidth: 880, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 20, flexWrap: 'wrap',
      }}>
        <div style={{ color: P.textMuted, fontSize: 13, letterSpacing: '0.02em' }}>
          © 2026 Vaibhav Shrivastava
        </div>
        <div className="footer-links" style={{ display: 'flex', gap: 26 }}>
          <FooterLink href="mailto:vshrivastava103@gmail.com" label="Email" />
          <FooterLink href="https://www.linkedin.com/in/vaibhav-shrivastava-aa637116a/" label="LinkedIn" />
          <FooterLink
            href="#hero"
            label="Back to top"
            onClick={(e) => { e.preventDefault(); scrollToSection('hero') }}
          />
        </div>
      </div>
    </footer>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────

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

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Nav active={active} />
      <main style={{ maxWidth: 880, margin: '0 auto', padding: '0 28px' }}>
        <Hero />
        <About />
        <ExperienceSection />
        <SkillsSection />
        <ChatSection />
      </main>
      <Footer />
    </>
  )
}
