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

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; overflow-x: hidden; }

body {
  font-family: 'Inter', sans-serif;
  background: #0f172a;
  color: #f1f5f9;
  font-size: 15px;
  line-height: 1.8;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: #0f172a; }
::-webkit-scrollbar-thumb { background: #34d39950; border-radius: 2px; }

@keyframes bl { 50% { opacity: 0; } }
.blink { animation: bl 1s step-end infinite; }

/* ── motion & interaction ─────────────────────────────────────────────────── */
@keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@keyframes pulseDot { 0% { box-shadow: 0 0 0 0 #34d39966; } 70% { box-shadow: 0 0 0 7px #34d39900; } 100% { box-shadow: 0 0 0 0 #34d39900; } }

.hero-text > * { animation: fadeUp .6s cubic-bezier(.2,.7,.3,1) both; }
.hero-text > *:nth-child(2) { animation-delay: .07s; }
.hero-text > *:nth-child(3) { animation-delay: .14s; }
.hero-text > *:nth-child(4) { animation-delay: .21s; }
.hero-text > *:nth-child(5) { animation-delay: .28s; }

/* buttons: lift + gentle press */
.btn-anim { transition: transform .18s cubic-bezier(.2,.7,.3,1), box-shadow .2s ease, filter .2s ease, background .2s ease, border-color .2s ease; }
.btn-anim:hover { transform: translateY(-2px) scale(1.03); filter: brightness(1.06); }
.btn-anim:active { transform: translateY(0) scale(.97); transition-duration: .06s; }

/* skill tags: springy hover */
.skill-tag { transition: transform .15s cubic-bezier(.2,.7,.3,1), filter .15s ease; cursor: default; }
.skill-tag:hover { transform: translateY(-2px); filter: brightness(1.3); }

/* animated underline for nav & footer links */
.link-underline { position: relative; }
.link-underline::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -5px; height: 2px; border-radius: 2px;
  background: linear-gradient(90deg, #34d399, #60a5fa);
  transform: scaleX(0); transform-origin: left;
  transition: transform .25s cubic-bezier(.2,.7,.3,1);
}
.link-underline:hover::after { transform: scaleX(1); }

.pulse-dot { animation: pulseDot 2.2s ease-out infinite; }

/* scroll reveal */
.reveal { opacity: 0; transform: translateY(32px); transition: opacity .7s cubic-bezier(.2,.7,.3,1), transform .7s cubic-bezier(.2,.7,.3,1); }
.reveal.in { opacity: 1; transform: none; }
.reveal-2 { transition-delay: .1s; }
.reveal-3 { transition-delay: .2s; }
.reveal-4 { transition-delay: .3s; }

/* animated gradient name (size + animation folded into the base .gradient-text rule below) */
@keyframes gradientShift { from { background-position: 0% center; } to { background-position: 200% center; } }

/* floating hero photo */
@keyframes floaty { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
.hero-photo-wrap { animation: floaty 6s ease-in-out infinite; }

/* button shine sweep */
.btn-anim { position: relative; overflow: hidden; }
.btn-anim::after {
  content: ''; position: absolute; top: 0; bottom: 0; left: -80%; width: 45%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,.35), transparent);
  transform: skewX(-20deg); pointer-events: none; transition: left .55s ease;
}
.btn-anim:hover::after { left: 130%; }

/* mic listening pulse */
@keyframes micPulse { 0%, 100% { box-shadow: 0 0 0 0 #fb923c66; } 70% { box-shadow: 0 0 0 9px #fb923c00; } }
.mic-live { animation: micPulse 1.2s ease-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .hero-text > *, .pulse-dot, .gradient-text, .hero-photo-wrap, .mic-live { animation: none; }
  .btn-anim, .skill-tag, .link-underline::after, .reveal { transition: none; }
  .btn-anim:hover, .skill-tag:hover { transform: none; }
  .reveal { opacity: 1; transform: none; }
}

a { text-decoration: none; color: inherit; }
button { cursor: pointer; font-family: inherit; }
input { font-family: inherit; }
input::placeholder { color: #475569; }

.mono { font-family: 'JetBrains Mono', monospace; }

.gradient-text {
  background: linear-gradient(100deg, #34d399 0%, #60a5fa 35%, #c084fc 65%, #34d399 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 6s linear infinite;
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

/* ── iPad Pro / large tablet landscape (1024px and below) ── */
@media (max-width: 1024px) {
  .hero-layout { gap: 44px; }
  .hero-name { font-size: 56px; }
  .hero-photo-wrap { width: 240px; height: 295px; }
}

/* ── iPad portrait / tablet (768px and below) ── */
@media (max-width: 768px) {
  .hero-layout { flex-direction: column-reverse; gap: 36px; align-items: center; }
  .hero-text { text-align: center; }
  .hero-name { font-size: 52px; }
  .hero-photo-wrap { width: 200px; height: 244px; }
  .hero-buttons { justify-content: center; }
  /* clip glow so it doesn't overflow the viewport */
  .hero-photo-col::before { inset: -20px; }
}

/* ── Mobile (600px and below) ── */
@media (max-width: 600px) {
  .nav-links { display: none; }
  .hero-name { font-size: 42px; }
  .hero-photo-wrap { width: 176px; height: 214px; }
  .hero-buttons { flex-direction: column; align-items: stretch; width: 100%; max-width: 280px; margin: 0 auto; }
  .hero-buttons a, .hero-buttons button { width: 100%; }
  .exp-header { flex-direction: column; align-items: flex-start; }
  .footer-inner { flex-direction: column; text-align: center; gap: 18px; }
  .footer-links { flex-wrap: wrap; justify-content: center; }
}

/* ── bento grid ─────────────────────────────────────────────────────────────── */
.bento {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 14px;
  max-width: 1120px;
  margin: 0 auto;
  padding: 92px clamp(16px, 4vw, 28px) 48px;
  grid-auto-rows: minmax(10px, auto);
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
  background: #121a2c;
  border: 1px solid #24314a;
  border-radius: 18px;
  padding: 22px 24px;
  overflow: hidden;
  min-width: 0;
  transition: transform .3s cubic-bezier(.2,.7,.3,1), border-color .3s ease, box-shadow .3s ease, opacity .6s ease;
}
.tile:hover { transform: translateY(-4px); border-color: #34d39944; box-shadow: 0 18px 44px -18px #34d39933; }
.tile .hero-layout { gap: 26px; }
.tile .hero-name { font-size: 46px; }
.tile .hero-photo-wrap { width: 188px; height: 232px; }
.tile .hero-photo-col::before { inset: -30px; }
@media (max-width: 900px) {
  .tile .hero-name { font-size: 44px; }
  .tile .hero-photo-wrap { width: 200px; height: 244px; }
}
.tile-accent::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--accent, #34d399); opacity: .9;
}
@media (max-width: 900px) {
  .bento { grid-template-columns: 1fr; grid-template-areas: none; padding-top: 84px; }
  .tile { grid-area: auto !important; }
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
    role: 'Software Engineering Lead',
    period: 'Aug 2026 – Present',
    current: true,
    color: P.emerald,
    bullets: [
      'Promoted to Software Engineering Lead for expanding the agentic platform well beyond its original scope.',
      'Owns the UI repository end-to-end and serves as a key driver of the company\'s AI initiatives.',
      'Built an automated quality framework in Claude Code spanning the UI, agentic, and API repos — evaluating each against 130 benchmark questions plus their follow-ups and auto-remediating failures until reaching a 100% pass rate.',
      'Automated the team\'s code review with Claude routines (scheduled agents) that review every change and surface issues without manual kickoff.',
      'Builds internal developer tools and applies them across the UI to accelerate delivery.',
      'Leads the agentic chat experience, from interaction design through production reliability.',
      'Contributes across all repositories using AI-assisted engineering workflows.',
    ],
  },
  {
    company: 'Manifest Global (Cialfo)',
    role: 'Senior Software Engineer',
    period: 'Apr 2025 – Aug 2026',
    current: false,
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
    items: ['Claude Code', 'Claude Routines', 'LangChain', 'LangGraph', 'Agentic Workflows', 'No-dev Pipeline Architecture', 'Cloudflare RAG', 'Tool Integrations'],
  },
  {
    category: 'Testing & Analytics',
    color: P.orange,
    items: ['Jasmine', 'Karma', 'Jest', 'Unit Testing (91%+)', 'Evals', 'Automated Code Review', 'Segment Analytics'],
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
              className="link-underline"
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
    <section id="hero" style={{ paddingTop: 130, paddingBottom: 48, position: 'relative' }}>
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
            Software Engineering Lead &nbsp;·&nbsp; Noida, India &nbsp;·&nbsp; 5+ yrs exp
          </div>

          <p style={{
            color: P.textMuted,
            lineHeight: 1.9, marginBottom: 40,
            fontWeight: 300, fontSize: 15,
          }}>
            Leading UI and agentic AI work at Cialfo —
            multiplying team output by enabling PMs and designers to prototype and ship, without compromising code quality.
          </p>

          <div className="hero-buttons">
            <a href="mailto:vshrivastava103@gmail.com">
              <button className="btn-anim" style={{
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
              <button className="btn-anim" style={{
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

            <a
              href="/Vaibhav_Shrivastava_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="btn-anim" style={{
                background: '#34d39914',
                color: P.emerald,
                border: `1px solid ${P.emerald}60`, padding: '12px 26px',
                fontSize: 14, fontWeight: 500,
                borderRadius: 8,
                transition: 'all 0.2s',
              }}>
                Résumé
              </button>
            </a>

            <button
              className="btn-anim"
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
                <span className="hero-badge-dot pulse-dot" />
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
    <section id="about" className="reveal" style={{ paddingTop: 48, paddingBottom: 48, borderTop: '1px solid #1e293b' }}>
      <SectionLabel label="ABOUT" color={P.emerald} />
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: P.surface,
          border: `1px solid ${hovered ? P.emerald + '44' : P.border}`,
          borderRadius: 14,
          padding: '32px 38px',
          transition: 'transform 0.3s cubic-bezier(.2,.7,.3,1), border-color 0.3s, box-shadow 0.3s',
          boxShadow: hovered ? '0 16px 42px -14px #34d39933' : 'none',
          transform: hovered ? 'translateY(-8px)' : 'none',
        }}
      >
        <div className="mono" style={{ color: '#1e4a2e', fontSize: 12, marginBottom: 24, letterSpacing: '0.05em' }}>
          cat about.md
        </div>
        <p style={{ color: P.textSec, marginBottom: 18, fontWeight: 300, lineHeight: 1.9, fontSize: 15 }}>
          I'm a Software Engineering Lead at{' '}
          <span style={{ color: P.textPri, fontWeight: 500 }}>Cialfo</span> — a Series B
          EdTech SaaS platform ($77M raised) serving 310,000+ students and 1,000+ universities
          across 105+ countries. I bring 5 years of frontend engineering experience to building
          systems that push what's possible without a traditional dev workflow.
        </p>
        <p style={{ color: P.textSec, fontWeight: 300, lineHeight: 1.9, fontSize: 15 }}>
          I own the UI codebase and drive the company's work on the{' '}
          <span style={{ color: P.emerald, fontWeight: 500 }}>AI front</span> —
          architecting Claude-powered systems that let PMs, designers, and other
          non-engineers independently generate and ship production-ready code. I also built an
          automated quality framework in Claude Code that tests our UI, agentic, and API repos
          against 130 benchmark questions and their follow-ups, auto-fixing until every one passes.
        </p>
      </div>
    </section>
  )
}

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────

function ExperienceSection() {
  return (
    <section id="experience" className="reveal" style={{ paddingTop: 48, paddingBottom: 48, borderTop: '1px solid #1e293b' }}>
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
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 3,
        borderTopColor: hovered ? exp.color + '55' : P.border,
        borderRightColor: hovered ? exp.color + '55' : P.border,
        borderBottomColor: hovered ? exp.color + '55' : P.border,
        borderLeftColor: exp.color,
        borderRadius: 14,
        padding: '26px 30px',
        transition: 'transform 0.25s cubic-bezier(.2,.7,.3,1), border-color 0.25s, box-shadow 0.25s',
        boxShadow: hovered ? `0 16px 40px -14px ${exp.color}38` : 'none',
        transform: hovered ? 'translateY(-8px)' : 'none',
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
    <section id="skills" style={{ paddingTop: 48, paddingBottom: 48, borderTop: '1px solid #1e293b' }}>
      <SectionLabel label="SKILLS" color={P.purple} />
      <div className="skills-grid">
        {SKILLS.map((cat, i) => (
          <div key={i} className={`reveal${i > 0 ? ' reveal-' + (i + 1) : ''}`}>
            <SkillCard cat={cat} />
          </div>
        ))}
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
        borderStyle: 'solid',
        borderTopWidth: 2,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderTopColor: cat.color,
        borderRightColor: hovered ? cat.color + '55' : P.border,
        borderBottomColor: hovered ? cat.color + '55' : P.border,
        borderLeftColor: hovered ? cat.color + '55' : P.border,
        borderRadius: 14,
        padding: '22px',
        transition: 'transform 0.25s cubic-bezier(.2,.7,.3,1), border-color 0.25s, box-shadow 0.25s',
        boxShadow: hovered ? `0 16px 40px -14px ${cat.color}38` : 'none',
        transform: hovered ? 'translateY(-8px)' : 'none',
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
          <span key={i} className="skill-tag" style={{
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
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
        <div className="mono" style={{ fontSize: 11, color: P.orange, letterSpacing: '0.16em', fontWeight: 600 }}>
          ──── ASK ME ANYTHING
        </div>
        <div className="mono" style={{ fontSize: 10, color: P.textMuted }}>
          Groq · voice-enabled
        </div>
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
        flex: 1,
        minHeight: 200,
        maxHeight: 420,
        overflowY: 'auto',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        marginBottom: 12,
      }}>
        {messages.length === 0 && !loading && !isTyping && (
          <div style={{ margin: 'auto', textAlign: 'center' }}>
            <span className="mono" style={{ color: P.textMuted, fontSize: 13 }}>
              ask me anything<span className="blink">_</span>
            </span>
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${P.orange}14` : 'none',
        border: `1px solid ${hovered ? P.orange + '55' : P.border}`,
        color: hovered ? P.textSec : P.textMuted,
        padding: '7px 16px', fontSize: 13,
        borderRadius: 20, fontWeight: 400,
        transform: hovered ? 'translateY(-2px) scale(1.05)' : 'none',
        transition: 'transform 0.18s cubic-bezier(.2,.7,.3,1), background 0.2s, border-color 0.2s, color 0.2s',
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

function ChatInput({ input, setInput, onSend, onKey, disabled, micSupported, listening, onMic, ttsSupported, voiceOn, onToggleVoice }) {
  const [focused, setFocused] = useState(false)
  const iconBtn = (active, color) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
    background: active ? `${color}22` : 'none',
    border: `1px solid ${active ? color : P.border}`,
    color: active ? color : P.textMuted,
    transition: 'background .2s, border-color .2s, color .2s, transform .15s',
  })
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: P.surface,
      border: `1px solid ${listening ? P.orange : (focused ? P.orange + '55' : P.border)}`,
      borderRadius: 10, padding: '10px 12px',
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
        placeholder={listening ? 'Listening… speak now' : (micSupported ? 'Type, or tap the mic to speak…' : 'Type your question and press Enter…')}
        disabled={disabled}
        style={{
          flex: 1, background: 'none', border: 'none', outline: 'none',
          fontSize: 14, color: P.textPri, letterSpacing: '0.01em',
        }}
      />

      {ttsSupported && (
        <button
          onClick={onToggleVoice}
          title={voiceOn ? 'Voice replies: on' : 'Voice replies: off'}
          aria-label={voiceOn ? 'Turn off voice replies' : 'Turn on voice replies'}
          className="btn-anim"
          style={iconBtn(voiceOn, P.blue)}
        >
          {voiceOn ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          )}
        </button>
      )}

      {micSupported && (
        <button
          onClick={onMic}
          disabled={disabled}
          title={listening ? 'Listening…' : 'Speak your question'}
          aria-label="Speak your question"
          className={listening ? 'mic-live' : 'btn-anim'}
          style={iconBtn(listening, P.orange)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
        </button>
      )}

      <button
        onClick={onSend}
        disabled={disabled}
        className="btn-anim"
        style={{
          background: input.trim() && !disabled ? 'linear-gradient(90deg, #34d399, #60a5fa)' : 'none',
          border: `1px solid ${input.trim() && !disabled ? 'transparent' : P.border}`,
          color: input.trim() && !disabled ? '#071a12' : P.textMuted,
          fontSize: 13, fontWeight: 600,
          padding: '8px 16px', borderRadius: 6, flexShrink: 0,
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
      className="link-underline"
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

// ─── BENTO TILES ──────────────────────────────────────────────────────────────

function Tile({ area, id, accent, reveal, hero, children }) {
  const style = { gridArea: area }
  if (accent) style['--accent'] = accent
  if (hero) style.padding = '30px 32px'
  return (
    <div
      id={id}
      className={`tile${accent ? ' tile-accent' : ''}${reveal ? ' reveal' : ''}`}
      style={style}
    >
      {children}
    </div>
  )
}

function HeroTile() {
  return (
    <Tile area="hero" id="hero" hero>
      <div className="hero-layout">
        <div className="hero-text" style={{ flex: 1, minWidth: 0 }}>
          <div className="mono" style={{ color: P.emerald, fontSize: 12, marginBottom: 18, opacity: 0.65, letterSpacing: '0.1em' }}>
            ▶ vaibhav@portfolio:~$ whoami
          </div>
          <h1>
            <div className="hero-name" style={{ color: P.textPri, marginBottom: 4 }}>Vaibhav</div>
            <div className="hero-name gradient-text" style={{ marginBottom: 16 }}>Shrivastava</div>
          </h1>
          <div style={{ color: P.textSec, fontSize: 15, marginBottom: 12, fontWeight: 400 }}>
            Software Engineering Lead &nbsp;·&nbsp; Noida, India &nbsp;·&nbsp; 5+ yrs exp
          </div>
          <p style={{ color: P.textMuted, lineHeight: 1.8, marginBottom: 26, fontWeight: 300, fontSize: 14.5 }}>
            Leading UI and agentic AI work at Cialfo — multiplying team output by enabling PMs and designers to prototype and ship, without compromising code quality.
          </p>
          <div className="hero-buttons">
            <a href="mailto:vshrivastava103@gmail.com">
              <button className="btn-anim" style={{ background: 'linear-gradient(100deg, #34d399, #60a5fa)', color: '#071a12', border: 'none', padding: '11px 22px', fontSize: 14, fontWeight: 600, borderRadius: 8, boxShadow: '0 0 16px #34d39920' }}>Get in touch</button>
            </a>
            <a href="https://www.linkedin.com/in/vaibhav-shrivastava-aa637116a/" target="_blank" rel="noopener noreferrer">
              <button className="btn-anim" style={{ background: '#60a5fa14', color: P.blue, border: `1px solid ${P.blue}60`, padding: '11px 22px', fontSize: 14, fontWeight: 500, borderRadius: 8 }}>LinkedIn</button>
            </a>
            <a href="/Vaibhav_Shrivastava_Resume.pdf" target="_blank" rel="noopener noreferrer">
              <button className="btn-anim" style={{ background: '#34d39914', color: P.emerald, border: `1px solid ${P.emerald}60`, padding: '11px 22px', fontSize: 14, fontWeight: 500, borderRadius: 8 }}>Résumé</button>
            </a>
            <button className="btn-anim" onClick={() => scrollToSection('chat')} style={{ background: '#c084fc14', color: P.purple, border: `1px solid ${P.purple}60`, padding: '11px 22px', fontSize: 14, fontWeight: 500, borderRadius: 8 }}>Ask me anything</button>
          </div>
        </div>
        <div className="hero-photo-col">
          <div className="hero-photo-wrap">
            <div className="hero-photo-inner">
              <img src="/avatar.png" alt="Vaibhav Shrivastava" />
              <div className="hero-photo-tint" />
              <div className="hero-photo-fade" />
              <div className="hero-badge"><span className="hero-badge-dot pulse-dot" />Agentic AI · Frontend</div>
            </div>
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
        <div style={{ fontSize: 42, fontWeight: 700, color: accent, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
        <div style={{ color: P.textSec, fontSize: 13, marginTop: 10, fontWeight: 500 }}>{label}</div>
        {sub && <div className="mono" style={{ color: P.textMuted, fontSize: 11, marginTop: 4 }}>{sub}</div>}
      </div>
    </Tile>
  )
}

function WorkTile({ area, tag, title, body, accent }) {
  return (
    <Tile area={area} accent={accent} reveal>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', color: accent, fontWeight: 600, marginBottom: 12 }}>{tag}</div>
      <div style={{ color: P.textPri, fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <p style={{ color: P.textMuted, fontSize: 13.5, lineHeight: 1.7, fontWeight: 300 }}>{body}</p>
    </Tile>
  )
}

function ChatTile() {
  return (
    <Tile area="chat" id="chat" accent={P.orange} reveal>
      <ChatSection />
    </Tile>
  )
}

function AboutTile() {
  return (
    <Tile area="about" id="about" accent={P.emerald} reveal>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: P.emerald, fontWeight: 600, marginBottom: 12 }}>ABOUT</div>
      <p style={{ color: P.textSec, fontSize: 13.5, lineHeight: 1.75, fontWeight: 300 }}>
        Software Engineering Lead at <span style={{ color: P.textPri, fontWeight: 500 }}>Cialfo</span> — a Series B EdTech SaaS ($77M raised) serving 310,000+ students and 1,000+ universities across 105+ countries. I own the UI codebase and drive the company's AI-front work, building systems that let non-engineers ship production code.
      </p>
    </Tile>
  )
}

function SkillsTile() {
  return (
    <Tile area="skills" id="skills" accent={P.purple} reveal>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: P.purple, fontWeight: 600, marginBottom: 16 }}>SKILLS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {SKILLS.map((cat, i) => (
          <div key={i}>
            <div className="mono" style={{ fontSize: 9.5, letterSpacing: '0.12em', color: cat.color, marginBottom: 7, fontWeight: 600 }}># {cat.category.toUpperCase()}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {cat.items.map((it, j) => (
                <span key={j} className="skill-tag" style={{ display: 'inline-block', background: `${cat.color}12`, border: `1px solid ${cat.color}30`, borderRadius: 6, padding: '3px 9px', fontSize: 11.5, color: cat.color }}>{it}</span>
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
    <Tile area="time" id="experience" accent={P.blue} reveal>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', color: P.blue, fontWeight: 600, marginBottom: 16 }}>EXPERIENCE</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
        {EXPERIENCE.map((exp, i) => (
          <div key={i} style={{ flex: '1 1 175px', minWidth: 150, borderLeft: `2px solid ${exp.color}`, paddingLeft: 12 }}>
            {exp.current && (
              <span className="mono" style={{ fontSize: 9, color: exp.color, letterSpacing: '0.08em', fontWeight: 600 }}>● CURRENT</span>
            )}
            <div style={{ color: exp.color, fontSize: 12.5, fontWeight: 600, marginTop: exp.current ? 3 : 0 }}>{exp.role}</div>
            <div style={{ color: P.textSec, fontSize: 12.5, fontWeight: 500 }}>{exp.company}</div>
            <div className="mono" style={{ color: P.textMuted, fontSize: 10.5, marginTop: 2 }}>{exp.period}</div>
          </div>
        ))}
      </div>
    </Tile>
  )
}

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
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Nav active={active} />
      <main className="bento">
        <HeroTile />
        <StatTile area="st1" accent={P.emerald} value="~75%" label="Delivery velocity gain" sub="days → hours" />
        <StatTile area="st2" accent={P.blue} value="100%" label="Eval pass rate" sub="130 questions" />
        <WorkTile area="agent" accent={P.emerald} tag="SIGNATURE WORK" title="Agentic AI pipelines" body="Claude-powered pipelines that let PMs & designers ship production-ready code independently — the core of Cialfo's no-dev workflow platform." />
        <ChatTile />
        <SkillsTile />
        <AboutTile />
        <WorkTile area="eval" accent={P.purple} tag="QUALITY ENGINE" title="130-question eval framework" body="An automated Claude Code suite that tests the UI, agentic & API repos against 130 questions plus follow-ups, auto-fixing until a 100% pass rate." />
        <WorkTile area="code" accent={P.blue} tag="AUTOMATION" title="Code review on autopilot" body="Claude routines review every change and surface issues automatically — no manual kickoff." />
        <TimelineTile />
      </main>
      <Footer />
    </>
  )
}
