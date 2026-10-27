import React, { useState, useEffect, useRef, useCallback } from 'react'

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY

const LINKEDIN = 'https://www.linkedin.com/in/vaibhav-shrivastava-aa637116a/'
const EMAIL = 'vshrivastava103@gmail.com'
const RESUME = '/Vaibhav_Shrivastava_Resume.pdf'

const SYSTEM_PROMPT = `You are Vaibhav Shrivastava, a Software Engineering Lead at Manifest Global (Cialfo), speaking in first person in a conversational, friendly but professional tone. Answer questions as if you are Vaibhav himself.

Key facts:
- Software Engineering Lead at Cialfo since August 2026 — own the UI repository end-to-end and am a key driver of the company's AI initiatives. Previously Senior Software Engineer there (Apr 2025–Aug 2026) and Frontend Engineer (Jul 2023–Apr 2025).
- In the same role, now also acting as Cialfo's Engineering Business Lead: manage business stakeholders, gather requirements, allocate resources across projects, and keep Cialfo's product heading in the right direction.
- Lead engineering across Cialfo, not just the UI — UI is my speciality. Now contributing on the Ruby backend and infra side and building end-to-end applications, using Claude Code for much of that work. I'm honest that backend and infra are areas I'm still growing in; with Claude Code they aren't a blocker.
- Own APM error management on Sentry and AppSignal, aligning the team on fixing what surfaces.
- Automated the entire code review process using Claude routines.
- Built student-facing and counselor-facing AI agents for Cialfo on the Mastra framework, which organises the agents and their tools. The agents are a layer on top of Cialfo's existing APIs: I built the tools from the ground up by transforming those APIs into MCP tools. Knowledge bases are connected through Cloudflare AutoRAG. The agents render dynamic UI inside the conversation. Built eval labs to test the agents, and shipped them to production.
- Recently built a revenue-generating AI notes feature: users record notes, and transcription recognises company-specific key terms and separates speakers with diarisation.
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
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; overflow-x: hidden; }
body {
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  background: #17120e; color: #f6efe4;
  font-size: 16px; line-height: 1.7;
  -webkit-font-smoothing: antialiased; overflow-x: hidden; position: relative;
}
body::before, body::after { content: ''; position: fixed; z-index: 0; pointer-events: none; filter: blur(30px); }
body::before { top: -260px; left: -120px; width: 900px; height: 640px;
  background: radial-gradient(ellipse at center, rgba(230,169,92,0.18) 0%, rgba(230,169,92,0.05) 45%, transparent 72%); }
body::after { bottom: -320px; right: -180px; width: 720px; height: 660px;
  background: radial-gradient(ellipse at center, rgba(217,140,154,0.11) 0%, transparent 70%); }
#root { position: relative; z-index: 1; }

.display { font-family: 'Sora', 'Inter', system-ui, sans-serif; }
.mono { font-family: 'JetBrains Mono', ui-monospace, Consolas, monospace; }

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #3c3228; border-radius: 4px; }

a { text-decoration: none; color: inherit; }
button { cursor: pointer; font-family: inherit; }
input { font-family: inherit; }
input::placeholder { color: #6f6455; }
:focus-visible { outline: 2px solid #e6a95c; outline-offset: 3px; border-radius: 8px; }

@keyframes bl { 50% { opacity: 0; } }
.blink { animation: bl 1s step-end infinite; }

@keyframes gradientShift { from { background-position: 0% center; } to { background-position: 200% center; } }
.gradient-text {
  background: linear-gradient(100deg, #e6a95c 0%, #d78a56 35%, #d98c9a 65%, #e6a95c 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: gradientShift 7s linear infinite;
}

@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
.stagger > * { animation: fadeUp .7s cubic-bezier(.2,.7,.3,1) both; }
.stagger > *:nth-child(2){ animation-delay: .07s; }
.stagger > *:nth-child(3){ animation-delay: .14s; }
.stagger > *:nth-child(4){ animation-delay: .21s; }
.stagger > *:nth-child(5){ animation-delay: .28s; }
.msg-in { animation: fadeUp .45s cubic-bezier(.2,.7,.3,1) both; }

.btn {
  position: relative; overflow: hidden; border-radius: 11px; font-size: 14px; font-weight: 600;
  padding: 11px 20px; letter-spacing: .01em; display: inline-flex; align-items: center; gap: 8px;
  transition: transform .18s cubic-bezier(.2,.7,.3,1), box-shadow .22s ease, filter .22s ease, border-color .2s;
}
.btn:hover { transform: translateY(-2px); filter: brightness(1.06); }
.btn:active { transform: translateY(0) scale(.98); transition-duration: .06s; }
.btn::after { content: ''; position: absolute; top: 0; bottom: 0; left: -80%; width: 45%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,.26), transparent);
  transform: skewX(-20deg); pointer-events: none; transition: left .55s ease; }
.btn:hover::after { left: 130%; }
.btn-primary { background: linear-gradient(100deg, #e6a95c, #d78a56); color: #1c130c; border: none; box-shadow: 0 10px 24px -10px rgba(230,169,92,0.55); }
.btn-ghost { background: rgba(255,238,214,0.045); color: #dccfbd; border: 1px solid rgba(255,224,190,0.16); }
.btn-ghost:hover { border-color: rgba(230,169,92,0.45); color: #f6efe4; }
.btn-sm { padding: 7px 13px; font-size: 13px; border-radius: 10px; }

.chip {
  border-radius: 22px; font-size: 13px; padding: 7px 14px; font-weight: 500;
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
.link-underline:hover::after, .link-underline.on::after { transform: scaleX(1); }

@keyframes pulseDot { 0% { box-shadow: 0 0 0 0 rgba(230,169,92,.5);} 70% { box-shadow: 0 0 0 7px rgba(230,169,92,0);} 100% { box-shadow: 0 0 0 0 rgba(230,169,92,0);} }
.pulse-dot { animation: pulseDot 2.4s ease-out infinite; }
@keyframes micPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(230,169,92,.5);} 70% { box-shadow: 0 0 0 9px rgba(230,169,92,0);} }
.mic-live { animation: micPulse 1.2s ease-out infinite; }
@keyframes floaty { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-8px);} }

/* layout */
.wrap { max-width: 1040px; margin: 0 auto; padding-inline: clamp(18px, 4vw, 32px); }
section[id] { scroll-margin-top: 84px; }
.sec { padding-block: 88px; border-top: 1px solid rgba(255,224,190,0.07); }
.sec-head { display: grid; gap: 10px; margin-bottom: 44px; max-width: 62ch; }
.eyebrow { font-family: 'JetBrains Mono', ui-monospace, Consolas, monospace; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: #e6a95c; }
.h2 { font-family: 'Sora', 'Inter', system-ui, sans-serif; font-size: clamp(28px, 3.4vw, 38px); font-weight: 600; line-height: 1.12; letter-spacing: -0.015em; text-wrap: balance; color: #f6efe4; }
.lede { color: #a2937f; font-size: 16.5px; max-width: 60ch; }

/* nav */
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding-top: env(safe-area-inset-top, 0px);
  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  background: rgba(23,18,14,0.78); border-bottom: 1px solid rgba(255,224,190,0.07); }
.nav-inner { max-width: 1040px; margin: 0 auto; padding-inline: clamp(18px, 4vw, 32px); height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.brand { border: none; background: none; font-size: 16px; font-weight: 700; color: #f6efe4; display: flex; align-items: center; gap: 9px; }
.brand-mark { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; background: linear-gradient(150deg, #e6a95c, #d98c9a); color: #1c130c; font-size: 12px; font-weight: 700; }
.nav-links { display: flex; gap: 26px; align-items: center; }
.nav-link { background: none; border: none; font-size: 14px; font-weight: 500; color: #a2937f; transition: color .2s; }
.nav-link:hover, .nav-link.on { color: #f6efe4; }
.nav-right { display: flex; gap: 8px; align-items: center; }

/* hero */
.hero { padding-top: 152px; padding-bottom: 76px; }
.hero-grid { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 56px; align-items: center; }
.hero-text { display: grid; gap: 22px; }
.hero-pill { justify-self: start; display: inline-flex; align-items: center; gap: 8px; font-size: 11.5px; letter-spacing: .14em; font-weight: 600; text-transform: uppercase; color: #e6a95c; background: rgba(230,169,92,0.09); border: 1px solid rgba(230,169,92,0.26); border-radius: 30px; padding: 6px 14px; }
.hero-pill i { width: 6px; height: 6px; border-radius: 50%; background: #e6a95c; }
.hero-name { font-family: 'Sora', 'Inter', system-ui, sans-serif; font-size: clamp(44px, 7vw, 76px); font-weight: 700; line-height: 1.0; letter-spacing: -0.03em; color: #f6efe4; }
.hero-value { font-family: 'Sora', 'Inter', system-ui, sans-serif; font-size: clamp(20px, 2.3vw, 25px); font-weight: 500; line-height: 1.42; color: #f6efe4; max-width: 32ch; text-wrap: balance; }
.hero-sub { color: #a2937f; font-size: 16px; max-width: 56ch; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.email-line { font-size: 13.5px; color: #a2937f; }
.email-line a { font-family: 'JetBrains Mono', ui-monospace, Consolas, monospace; color: #dccfbd; font-size: 13px; }
.portrait { width: 176px; height: 176px; border-radius: 50%; padding: 3px; flex-shrink: 0;
  background: linear-gradient(150deg, #e6a95c, #d78a56 55%, #d98c9a);
  box-shadow: 0 22px 50px -18px rgba(0,0,0,0.75), 0 0 60px rgba(230,169,92,0.22);
  animation: floaty 6.5s ease-in-out infinite; }
.portrait img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block; background: #241c15; }
.metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 64px; border-top: 1px solid rgba(255,224,190,0.1); }
.metric { padding: 22px 24px 4px 0; display: grid; gap: 5px; align-content: start; }
.metric + .metric { padding-left: 24px; border-left: 1px solid rgba(255,224,190,0.1); }
.metric b { font-family: 'Sora', 'Inter', system-ui, sans-serif; font-size: clamp(34px, 4vw, 44px); font-weight: 700; line-height: 1; letter-spacing: -0.02em; }
.metric span { font-size: 15px; color: #dccfbd; }
.metric small { font-family: 'JetBrains Mono', ui-monospace, Consolas, monospace; font-size: 12px; color: #a2937f; }

/* work */
.work { display: grid; }
.work-item { display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr); gap: 40px; padding-block: 34px; border-top: 1px solid rgba(255,224,190,0.08); }
.work-item:first-child { border-top: 0; padding-top: 0; }
.work-title { display: grid; gap: 8px; align-content: start; }
.work-title h3 { font-family: 'Sora', 'Inter', system-ui, sans-serif; font-size: 22px; font-weight: 600; line-height: 1.22; letter-spacing: -0.01em; color: #f6efe4; text-wrap: balance; display: flex; gap: 12px; align-items: baseline; }
.work-title h3 i { flex: 0 0 auto; width: 9px; height: 9px; border-radius: 50%; transform: translateY(-2px); }
.work-ctx { font-family: 'JetBrains Mono', ui-monospace, Consolas, monospace; font-size: 12px; color: #a2937f; letter-spacing: .04em; padding-left: 21px; }
.work-body { display: grid; gap: 14px; }
.work-body p { color: #dccfbd; font-size: 16px; line-height: 1.75; max-width: 62ch; }
.work-row { display: grid; grid-template-columns: 74px minmax(0, 1fr); gap: 12px; align-items: baseline; }
.row-label { font-family: 'JetBrains Mono', ui-monospace, Consolas, monospace; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #e6a95c; }
.work-row .impact { font-size: 15px; color: #f6efe4; }
.work-row .tools { font-family: 'JetBrains Mono', ui-monospace, Consolas, monospace; font-size: 12.5px; color: #a2937f; }
.also { margin-top: 44px; padding: 26px 28px; border-radius: 16px; background: rgba(255,238,214,0.03); border: 1px solid rgba(255,224,190,0.08); display: grid; gap: 16px; }
.also ul { list-style: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 32px; }
.also li { color: #dccfbd; font-size: 15px; padding-left: 18px; position: relative; }
.also li::before { content: ''; position: absolute; left: 0; top: .72em; width: 6px; height: 6px; border-radius: 50%; background: #d78a56; }

/* approach */
.principles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px; }
.principle { display: grid; gap: 10px; align-content: start; padding-top: 18px; border-top: 2px solid; }
.principle h3 { font-family: 'Sora', 'Inter', system-ui, sans-serif; font-size: 19px; font-weight: 600; line-height: 1.3; color: #f6efe4; text-wrap: balance; }
.principle p { color: #dccfbd; font-size: 15.5px; }
.principles.two { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px 48px; }
.role-sub { font-family: 'JetBrains Mono', ui-monospace, Consolas, monospace; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: #cbb28f; margin: -2px 0 10px; }

/* assistant */
.assist-grid { display: grid; grid-template-columns: minmax(0, 290px) minmax(0, 1fr); gap: 44px; align-items: start; }
.assist-copy { display: grid; gap: 16px; }
.assist-copy > p { color: #dccfbd; font-size: 15.5px; }
.specs { list-style: none; display: grid; gap: 14px; padding-top: 16px; border-top: 1px solid rgba(255,224,190,0.08); }
.specs li { display: grid; gap: 2px; font-size: 14px; color: #dccfbd; }
.specs li span { font-family: 'JetBrains Mono', ui-monospace, Consolas, monospace; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #a2937f; }
.panel { height: 620px; max-height: 82vh; display: flex; flex-direction: column; border-radius: 20px; overflow: hidden;
  background: linear-gradient(158deg, rgba(255,238,214,0.05), rgba(255,238,214,0.015));
  border: 1px solid rgba(255,224,190,0.12);
  box-shadow: 0 30px 70px -36px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,240,220,0.06); }
.panel-head { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-bottom: 1px solid rgba(255,224,190,0.08); font-size: 14px; color: #f6efe4; font-weight: 500; }
.panel-head small { margin-left: auto; font-family: 'JetBrains Mono', ui-monospace, Consolas, monospace; font-size: 11px; color: #a2937f; font-weight: 400; }
.panel-scroll { flex: 1 1 auto; overflow-y: auto; overflow-x: hidden; padding: 20px 18px; display: flex; flex-direction: column; gap: 14px; overscroll-behavior: contain; }
.panel-idle { margin: auto; text-align: center; display: grid; gap: 16px; justify-items: center; max-width: 440px; padding: 12px 0; }
.panel-idle h3 { font-family: 'Sora', 'Inter', system-ui, sans-serif; font-size: 20px; font-weight: 600; color: #f6efe4; }
.panel-idle p { color: #a2937f; font-size: 14.5px; }
.panel-idle .chips-row { justify-content: center; }
.panel-dock { padding: 12px 14px 14px; border-top: 1px solid rgba(255,224,190,0.08); display: grid; gap: 10px; background: rgba(23,18,14,0.55); }
.chips-row { display: flex; flex-wrap: wrap; gap: 8px; }
.msg-card {
  background: linear-gradient(158deg, rgba(255,238,214,0.055), rgba(255,238,214,0.015));
  border: 1px solid rgba(255,224,190,0.1); border-radius: 18px; padding: 20px 22px;
  box-shadow: 0 22px 50px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,240,220,0.05);
}
.stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }

/* experience */
.roles { display: grid; }
.role { display: grid; grid-template-columns: minmax(0, 220px) minmax(0, 1fr); gap: 40px; padding-block: 28px; border-top: 1px solid rgba(255,224,190,0.08); }
.role:first-child { border-top: 0; padding-top: 0; }
.role-when { display: grid; gap: 4px; align-content: start; }
.role-when .period { font-family: 'JetBrains Mono', ui-monospace, Consolas, monospace; font-size: 12.5px; color: #a2937f; }
.role-when .company { font-size: 14.5px; color: #dccfbd; font-weight: 500; }
.role h3 { font-family: 'Sora', 'Inter', system-ui, sans-serif; font-size: 19px; font-weight: 600; line-height: 1.3; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.badge { font-family: 'JetBrains Mono', ui-monospace, Consolas, monospace; font-size: 10.5px; letter-spacing: .1em; color: #e6a95c; border: 1px solid rgba(230,169,92,0.35); border-radius: 20px; padding: 2px 9px; font-weight: 500; }
.role ul { list-style: none; display: grid; gap: 8px; margin-top: 12px; }
.role li { color: #dccfbd; font-size: 15px; padding-left: 18px; position: relative; max-width: 68ch; }
.role li::before { content: ''; position: absolute; left: 0; top: .8em; width: 8px; height: 1px; background: #a2937f; }
.facts { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr); gap: 40px; margin-top: 52px; padding-top: 32px; border-top: 1px solid rgba(255,224,190,0.08); }
.fact { display: grid; gap: 12px; align-content: start; }
.fact p { color: #dccfbd; font-size: 15px; }
.toolkit { display: grid; gap: 10px; }
.toolkit div { display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 14px; font-size: 14.5px; color: #dccfbd; }
.toolkit div span { font-family: 'JetBrains Mono', ui-monospace, Consolas, monospace; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: #a2937f; padding-top: 3px; }

/* contact */
.contact { padding-block: 96px 40px; border-top: 1px solid rgba(255,224,190,0.07); }
.contact-line { font-family: 'Sora', 'Inter', system-ui, sans-serif; font-size: clamp(32px, 4.6vw, 50px); font-weight: 600; letter-spacing: -0.02em; line-height: 1.08; max-width: 16ch; margin-top: 12px; }
.contact-sub { color: #a2937f; font-size: 16px; max-width: 52ch; margin-top: 16px; }
.contact-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 30px; align-items: center; }
.foot { margin-top: 72px; padding-top: 20px; border-top: 1px solid rgba(255,224,190,0.07); display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 13px; color: #6f6455; }

/* floating launcher */
.launcher { position: fixed; right: clamp(14px, 3vw, 28px); bottom: calc(18px + env(safe-area-inset-bottom, 0px)); z-index: 90;
  display: inline-flex; align-items: center; gap: 10px; padding: 8px 16px 8px 8px; border-radius: 999px;
  background: rgba(36,28,21,0.94); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
  border: 1px solid rgba(230,169,92,0.35); color: #f6efe4; font-size: 14px; font-weight: 500;
  box-shadow: 0 18px 40px -16px rgba(0,0,0,0.85); transition: opacity .25s ease, transform .25s ease; }
.launcher[data-show="false"] { opacity: 0; transform: translateY(12px); pointer-events: none; }

@media (max-width: 860px) {
  .nav-links { display: none; }
  .hero { padding-top: 112px; padding-bottom: 56px; }
  .hero-grid { grid-template-columns: 1fr; gap: 28px; }
  .portrait { width: 116px; height: 116px; order: -1; }
  .metrics { grid-template-columns: 1fr; margin-top: 44px; }
  .metric { padding: 18px 0; }
  .metric + .metric { padding-left: 0; border-left: 0; border-top: 1px solid rgba(255,224,190,0.1); }
  .work-item, .role, .assist-grid, .facts { grid-template-columns: 1fr; gap: 14px; }
  .work-ctx { padding-left: 21px; }
  .principles, .principles.two, .also ul { grid-template-columns: 1fr; }
  .panel { height: 580px; max-height: 80vh; }
  .sec { padding-block: 64px; }
}
@media (max-width: 480px) {
  .panel-head small { display: none; }
  .work-row { grid-template-columns: 1fr; gap: 2px; }
  .toolkit div { grid-template-columns: 1fr; gap: 2px; }
  .also { padding: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .stagger > *, .msg-in, .pulse-dot, .mic-live, .gradient-text, .portrait { animation: none; }
  .btn, .chip, .skill-tag, .link-underline::after, .launcher { transition: none; }
  .btn:hover, .chip:hover, .skill-tag:hover { transform: none; }
}
`

// ─── CONTENT ────────────────────────────────────────────────────────────────────
const HERO_METRICS = [
  { value: '~75%', label: 'faster delivery', note: 'PMs & designers: days → hours', color: P.amber },
  { value: '~30%', label: 'lower page-load time', note: 'Web Vitals work, core platform', color: P.copper },
  { value: '310K+', label: 'students on the platform', note: '1,000+ universities · 105+ countries', color: P.rose },
]

const WORK = [
  {
    title: 'Student & counselor AI agents', ctx: 'Cialfo · builder', color: P.amber,
    body: 'AI agents for both sides of Cialfo’s platform — students and counselors. They sit on top of Cialfo’s existing APIs: I built the tools from the ground up by turning those APIs into MCP tools, organised with the Mastra framework, and grounded the agents in knowledge bases on Cloudflare AutoRAG. The agents render dynamic UI inside the conversation instead of only replying in text. I built the eval labs that test them, and shipped them.',
    impact: 'Production agents serving both students and counselors, tested in eval labs before they ship.',
    tools: 'Mastra · MCP tools over existing APIs · Cloudflare AutoRAG · dynamic UI rendering · eval labs',
    short: 'Student- and counselor-facing agents on Mastra — existing APIs turned into MCP tools, AutoRAG knowledge bases, dynamic UI and eval labs.',
  },
  {
    title: 'AI notes with key terms & diarisation', ctx: 'Cialfo · revenue feature', color: P.copper,
    body: 'A revenue-generating AI notes feature: users record notes, and transcription recognises company-specific key terms and separates speakers with diarisation.',
    impact: 'An AI feature that brings in revenue for Cialfo.',
    tools: 'Speech-to-text · key-term biasing · speaker diarisation',
    short: 'Revenue-generating AI notes with company-specific key terms and speaker diarisation.',
  },
  {
    title: 'No-dev agentic pipeline', ctx: 'Cialfo · architect', color: P.rose,
    body: 'Claude-powered agentic pipelines that let PMs and designers — three to five non-engineers — generate and ship production-ready code on their own.',
    impact: 'Prototype-to-review went from days to hours, with ~75% higher delivery velocity.',
    tools: 'Claude Code · agentic workflows · Claude Code skills',
    short: "Claude-powered pipelines that let PMs & designers ship production-ready code independently — days to hours.",
  },
  {
    title: 'Claude Code skill library & safety gates', ctx: 'Cialfo · owner', color: P.sand,
    body: 'The end-to-end skill library that powers the no-dev workflow platform, plus the pre-commit hooks and automated validation gates that let non-developers contribute to production codebases.',
    impact: 'Non-engineer contributions land in production with CI/CD compliance.',
    tools: 'Claude Code skills · pre-commit hooks · CI/CD',
    short: 'The skill library behind the no-dev platform, plus pre-commit gates that keep non-developer contributions safe.',
  },
  {
    title: 'Code review, fully automated', ctx: 'Cialfo · owner', color: P.amber,
    body: 'I automated the team’s entire code review process with Claude routines — scheduled agents that review every change and surface issues, so review never waits on someone to start it.',
    impact: 'Every change gets reviewed, with no manual step in the process.',
    tools: 'Claude routines',
    short: 'The entire code review process runs on Claude routines — every change reviewed, no manual step.',
  },
  {
    title: 'End-to-end apps, past the UI', ctx: 'Cialfo · full stack', color: P.copper,
    body: 'UI is my speciality, but I now contribute on Cialfo’s Ruby backend and infra too — building complete applications end to end, with Claude Code carrying much of the backend work while I keep growing on that side.',
    impact: 'Interface to backend under one owner, with no hand-off between the layers.',
    tools: 'Ruby · Claude Code · infra',
    short: 'Building complete applications end to end — UI plus Ruby backend and infra, with Claude Code.',
  },
  {
    title: 'Multi-brand AI chatbot', ctx: 'Cialfo', color: P.textMuted,
    body: 'Production chatbot features across multiple brands on Cloudflare Workers, grounded with Cloudflare-managed RAG and tool integrations, with brand-specific configuration and workflow isolation at the platform level.',
    impact: 'One chatbot platform serving several brands, each isolated in config and workflow.',
    tools: 'Cloudflare Workers · Cloudflare RAG · tool integrations',
    short: 'Production chatbot features across brands on Cloudflare Workers with managed RAG.',
  },
]

const ALSO = [
  '~30% page-load-time reduction and LCP gains across the core platform — Web Vitals profiling, lazy loading, asset-pipeline refactoring.',
  'Serverless APIs on Cloudflare Workers and Wrangler, wiring CRM workflows and AI-assisted responses into production flows.',
  'A scalable Angular component library with Tailwind CSS and Angular Material, plus Segment event tracking.',
  'Mentored two AI engineering interns through to on-time delivery.',
]

const LEAD = [
  { title: 'Stakeholders & requirements', color: P.amber, body: 'I work directly with business stakeholders to gather requirements and turn them into scoped, buildable plans for Cialfo’s product.' },
  { title: 'Resourcing & direction', color: P.copper, body: 'I allocate resources across projects and keep delivery pointed the right way — solving the problem the business actually has.' },
  { title: 'Production health', color: P.rose, body: 'I run APM error management on Sentry and AppSignal: triaging what breaks in production and aligning the team on the fixes.' },
  { title: 'Engineering past the UI', color: P.sand, body: 'I lead engineering across Cialfo with UI as my speciality, and I’m growing on the Ruby backend and infra side — building end to end with Claude Code.' },
]

const PRINCIPLES = [
  { title: 'Guardrails before autonomy', color: P.amber, body: 'Non-engineers ship through pre-commit hooks and automated validation gates, so moving faster never means skipping the checks.' },
  { title: 'Ground the model in what’s true', color: P.copper, body: 'Assistants answer from a defined source of truth — Cloudflare AutoRAG knowledge bases and Cialfo’s own APIs as MCP tools for the agents, a fixed set of facts for the assistant on this page — and redirect what’s out of scope.' },
  { title: 'Automate the loop, not just the task', color: P.rose, body: 'Review runs on every change through scheduled Claude routines, so quality doesn’t depend on someone remembering to ask for it.' },
]

const ROLES = [
  {
    role: 'Software Engineering Lead', sub: 'Acting Engineering Business Lead', company: 'Manifest Global (Cialfo)', period: 'Aug 2026 – Present', current: true, color: P.amber,
    bullets: [
      'Promoted to Lead for expanding the agentic platform beyond its original scope; own end-to-end delivery of business-critical projects across Product, Design, Business and QA.',
      'Acting Engineering Business Lead: manage business stakeholders, gather requirements, allocate resources across projects and keep Cialfo’s product heading in the right direction.',
      'Lead engineering across Cialfo with UI as my speciality — own the UI repository end-to-end and drive the company’s AI initiatives across UI and agentic surfaces.',
      'Built student-facing and counselor-facing AI agents on the Mastra framework — existing APIs turned into MCP tools, knowledge bases on Cloudflare AutoRAG, dynamic UI rendering, and eval labs to test them before shipping.',
      'Built a revenue-generating AI notes feature with company-specific key terms and speaker diarisation.',
      'Contribute on the Ruby backend and infra, building end-to-end applications with Claude Code.',
      'Own APM error management on Sentry and AppSignal, aligning the team on fixes.',
      'Automated the entire code review process with Claude routines.',
      'Lead the agentic chat experience from interaction design to production reliability, and build internal developer tools used across the UI.',
    ],
  },
  {
    role: 'Senior Software Engineer', company: 'Manifest Global (Cialfo)', period: 'Apr 2025 – Aug 2026', color: P.copper,
    bullets: [
      'Architected Claude-powered agentic pipelines letting PMs and designers (3–5 non-engineers) ship production-ready prototypes independently — prototype-to-review went from days to hours, with ~75% higher delivery velocity.',
      'Wrote and iteratively optimized Claude Code skills; owned the end-to-end skill library powering the no-dev workflow platform.',
      'Built pre-commit hooks and automated validation gates so non-developers could contribute to production codebases with CI/CD compliance.',
      'Delivered multi-brand production AI chatbot features on Cloudflare Workers with Cloudflare-managed RAG and tool integrations.',
      'Drove a ~30% page-load-time reduction and LCP gains through Web Vitals profiling, lazy loading and asset-pipeline refactoring.',
      'Mentored two AI engineering interns to on-time delivery.',
    ],
  },
  {
    role: 'Frontend Engineer', company: 'Manifest Global (Cialfo)', period: 'Jul 2023 – Apr 2025', color: P.rose,
    bullets: [
      'Independently owned multiple frontend projects; worked directly with PMs and designers to define MVP scope and demo to leadership.',
      'Designed and deployed serverless APIs with Cloudflare Workers and Wrangler, integrating CRM workflows and AI-assisted responses into production flows.',
      'Built a scalable component library in Angular, Tailwind CSS and Angular Material; added Segment event tracking for data-driven product decisions.',
    ],
  },
  {
    role: 'Software Engineer – Frontend', company: 'MAQ Software', period: 'May 2022 – Jun 2023', color: P.sand,
    bullets: [
      'Built production-grade Angular applications for enterprise clients with a modular architecture.',
      'Authored Jasmine/Karma unit tests at 91%+ coverage as a mandatory QA gate.',
    ],
  },
  {
    role: 'Application Development Associate', company: 'Accenture', period: 'Jul 2021 – Mar 2022', color: P.textMuted,
    bullets: [
      'Contributed to enterprise-scale Angular applications in Agile delivery teams, with a focus on component design and code review.',
    ],
  },
]

const TOOLKIT = [
  ['Frontend', 'Angular (expert), TypeScript, JavaScript, RxJS, Tailwind CSS, Angular Material'],
  ['AI', 'Mastra, MCP, Cloudflare AutoRAG, Claude Code & routines, LangChain, LangGraph, RAG, eval labs, speech-to-text & diarisation, agentic workflows'],
  ['Backend', 'Ruby (growing), Cloudflare Workers, Wrangler, serverless APIs'],
  ['Ops', 'Sentry, AppSignal (APM), CI/CD'],
  ['Quality', 'Jasmine, Karma, Jest, Segment analytics'],
  ['Leadership', 'Stakeholder management, requirements, resource planning'],
]

// chat cards
const STATS = [
  { value: '~75%', label: 'Delivery velocity gain', color: P.amber },
  { value: '~30%', label: 'Page-load-time reduction', color: P.copper },
  { value: '5+ yrs', label: 'Engineering experience', color: P.rose },
  { value: '310K+', label: 'Students on the platform', color: P.sand },
]

const SKILLS = [
  { category: 'Frontend', color: P.amber, items: ['Angular', 'TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Tailwind CSS', 'Angular Material', 'RxJS'] },
  { category: 'Backend & Infra', color: P.copper, items: ['Ruby (growing)', 'Cloudflare Workers', 'Wrangler', 'Serverless API Design', 'Sentry', 'AppSignal'] },
  { category: 'AI & Agentic', color: P.rose, items: ['Mastra', 'MCP Tools', 'Cloudflare AutoRAG', 'Dynamic UI Rendering', 'Speaker Diarisation', 'Claude Code', 'Claude Routines', 'LangChain', 'LangGraph', 'Agentic Workflows', 'No-dev Pipelines', 'Cloudflare RAG', 'Tool Integrations'] },
  { category: 'Testing & Analytics', color: P.sand, items: ['Jasmine', 'Karma', 'Jest', 'Unit Testing (91%+)', 'Evals', 'Automated Code Review', 'Segment'] },
]

const ABOUT = "I'm a Software Engineering Lead at Cialfo, currently acting as its Engineering Business Lead — Cialfo is a Series B EdTech SaaS ($77M raised) serving 310,000+ students and 1,000+ universities across 105+ countries. I lead engineering for the product with UI as my speciality, work with business stakeholders on what we build, and drive the AI work that lets non-engineers ship production code."

const SUGGESTED_PROMPTS = [
  'Tell me about your AI workflow work',
  "What's your biggest achievement?",
  'How do you approach system design?',
]

const TOPICS = [
  { key: 'work', label: 'My work' },
  { key: 'stats', label: 'The numbers' },
  { key: 'skills', label: 'My stack' },
  { key: 'timeline', label: 'Experience' },
  { key: 'about', label: 'About me' },
]

// tapping a topic reads like a question → a short typed reply → the card
const TOPIC_META = {
  work:     { q: 'Show me your work',            a: "Here's the work I'm most proud of —" },
  stats:    { q: 'Show me the numbers',          a: 'A few numbers that capture the impact —' },
  skills:   { q: "What's your stack?",           a: 'This is what I build with —' },
  timeline: { q: 'Walk me through your journey',  a: "Here's the path so far —" },
  about:    { q: 'Tell me about yourself',       a: 'The short version —' },
}

const NAV = [
  { id: 'lead', label: 'Leadership' },
  { id: 'work', label: 'Work' },
  { id: 'approach', label: 'Approach' },
  { id: 'assistant', label: 'Assistant' },
  { id: 'experience', label: 'Experience' },
]

const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

// ─── RICH CARDS (revealed inside the conversation) ──────────────────────────────
function VAvatar() {
  return (
    <span className="display" style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(150deg, #e6a95c, #d98c9a)', color: '#1c130c', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>V</span>
  )
}

function CardShell({ children }) {
  return (
    <div className="msg-in" style={{ alignSelf: 'flex-start', maxWidth: '94%', display: 'flex', gap: 10, width: '100%' }}>
      <VAvatar />
      <div className="msg-card" style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  )
}

function CardHeader({ label, color }) {
  return <div style={{ fontSize: 10.5, letterSpacing: '.16em', fontWeight: 600, textTransform: 'uppercase', color, marginBottom: 14 }}>{label}</div>
}

function CountUp({ value, color }) {
  const parts = String(value).match(/^(\D*)([\d.]+)(.*)$/)
  const [disp, setDisp] = useState(parts ? parts[1] + '0' + parts[3] : value)
  useEffect(() => {
    if (!parts) { setDisp(value); return }
    const pre = parts[1], target = parseFloat(parts[2]), post = parts[3]
    const dur = 1000, t0 = performance.now()
    let raf
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisp(pre + Math.round(target * eased) + post)
      if (p < 1) raf = requestAnimationFrame(step)
      else setDisp(pre + parts[2] + post)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value]) // eslint-disable-line
  return <div className="display" style={{ fontSize: 30, fontWeight: 700, color, lineHeight: 1 }}>{disp}</div>
}

function StatsCard() {
  return (
    <CardShell>
      <CardHeader label="By the numbers" color={P.amber} />
      <div className="stat-grid stagger">
        {STATS.map((s, i) => (
          <div key={i}>
            <CountUp value={s.value} color={s.color} />
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
      <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {WORK.map((w, i) => (
          <div key={i} style={{ borderLeft: `2px solid ${w.color}`, paddingLeft: 13 }}>
            <div className="display" style={{ color: P.textPri, fontSize: 14.5, fontWeight: 600, marginBottom: 4 }}>{w.title}</div>
            <div style={{ color: P.textMuted, fontSize: 13, lineHeight: 1.65, fontWeight: 300 }}>{w.short}</div>
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
      <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
      <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {ROLES.map((e, i) => (
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
    <div className="msg-in" style={{ alignSelf: 'flex-start', maxWidth: '86%', display: 'flex', gap: 10 }}>
      <VAvatar />
      <div style={{ background: P.aiBg, border: `1px solid ${P.border}`, borderRadius: '4px 14px 14px 14px', padding: '11px 16px', color: P.textSec, fontSize: 14, lineHeight: 1.75, fontWeight: 300 }}>{content}</div>
    </div>
  )
}

// ─── CHAT INPUT ───────────────────────────────────────────────────────────────
function ChatInput({ input, setInput, onSend, onKey, disabled, micSupported, listening, transcribing, onMic, inputRef }) {
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
      background: 'rgba(36,28,21,0.85)',
      border: `1px solid ${listening ? P.amber : (focused ? 'rgba(230,169,92,0.45)' : 'rgba(255,224,190,0.13)')}`,
      borderRadius: 16, padding: '8px 10px',
      transition: 'border-color 0.2s', opacity: disabled ? 0.65 : 1,
    }}>
      <input
        ref={inputRef}
        id="assistant-input"
        aria-label="Ask the assistant"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={onKey}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={listening ? 'Listening… speak, then pause' : transcribing ? 'Transcribing…' : (micSupported ? 'Ask me anything, or tap the mic…' : 'Ask me anything…')}
        disabled={disabled}
        style={{ flex: 1, minWidth: 0, background: 'none', border: 'none', outline: 'none', fontSize: 14.5, color: P.textPri, paddingLeft: 8 }}
      />
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

// ─── ASSISTANT (the chat, mic and topic cards) ──────────────────────────────────
function Assistant({ inputRef }) {
  const [messages, setMessages] = useState([])
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef(null)
  const nextId = useRef(0)

  const [micSupported, setMicSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const micStreamRef = useRef(null)
  const stopTimerRef = useRef(null)
  const audioCtxRef = useRef(null)
  const vadIntervalRef = useRef(null)

  // detect mic support after mount so the server-rendered HTML matches the first client render
  useEffect(() => {
    setMicSupported(!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && 'MediaRecorder' in window)
  }, [])

  const started = messages.length > 0 || loading || isTyping

  // keep the newest message in view inside the panel (never scrolls the page)
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
      animateTyping(reply, () => {
        setMessages(prev => [...prev, { role: 'ai', content: reply, id: nextId.current++ }])
        setTypingText('')
      })
    } catch {
      setLoading(false)
      setMessages(prev => [...prev, { role: 'ai', content: 'Network error — try again!', id: nextId.current++ }])
    }
  }, [history, loading, isTyping, animateTyping])

  const revealTopic = useCallback((key) => {
    if (loading || isTyping) return
    const meta = TOPIC_META[key] || { q: key, a: '' }
    setMessages(prev => [...prev, { role: 'user', content: meta.q, id: nextId.current++ }])
    animateTyping(meta.a, () => {
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: meta.a, id: nextId.current++ },
        { role: 'card', kind: key, id: nextId.current++ },
      ])
    })
  }, [loading, isTyping, animateTyping])

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

      // voice-activity detection: auto-stop ~1s after the user stops talking
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
    <div className="panel">
      <div className="panel-head">
        <VAvatar />
        Vaibhav’s assistant
        <small>grounded · voice input</small>
      </div>

      <div className="panel-scroll" ref={scrollRef}>
        {!started && (
          <div className="panel-idle">
            <h3>Ask me anything about my work</h3>
            <p>Type a question, tap the mic, or pick a topic below for a quick tour.</p>
            <div className="chips-row">
              {SUGGESTED_PROMPTS.map((p, i) => (
                <button key={i} className="chip" onClick={() => sendMessage(p)}>{p}</button>
              ))}
            </div>
          </div>
        )}

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
          <div className="msg-in" style={{ alignSelf: 'flex-start', maxWidth: '86%', display: 'flex', gap: 10 }}>
            <VAvatar />
            <div style={{ background: P.aiBg, border: `1px solid ${P.border}`, borderRadius: '4px 14px 14px 14px', padding: '11px 16px', color: P.textSec, fontSize: 14, lineHeight: 1.75, fontWeight: 300 }}>{typingText}<span className="blink" style={{ fontSize: 12 }}>_</span></div>
          </div>
        )}
      </div>

      <div className="panel-dock">
        <div className="chips-row">
          {TOPICS.map(t => (
            <button key={t.key} className="chip chip-accent" onClick={() => revealTopic(t.key)}>{t.label}</button>
          ))}
        </div>
        <ChatInput
          input={input} setInput={setInput}
          onSend={() => sendMessage(input)} onKey={handleKey}
          disabled={loading || isTyping}
          micSupported={micSupported} listening={listening} transcribing={transcribing} onMic={startListening}
          inputRef={inputRef}
        />
      </div>
    </div>
  )
}

// ─── PAGE ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState('')
  const [showLauncher, setShowLauncher] = useState(false)
  const inputRef = useRef(null)

  const openAssistant = useCallback(() => {
    scrollToId('assistant')
    setTimeout(() => { try { inputRef.current?.focus({ preventScroll: true }) } catch { /* ignore */ } }, 650)
  }, [])

  // highlight the nav link for the section in view
  useEffect(() => {
    const els = NAV.map(n => document.getElementById(n.id)).filter(Boolean)
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
    }, { rootMargin: '-45% 0px -50% 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  // floating "Ask my assistant" appears after the hero, hides while the assistant is on screen
  useEffect(() => {
    const assistant = document.getElementById('assistant')
    let assistantVisible = false
    const update = () => setShowLauncher(window.scrollY > 520 && !assistantVisible)
    const io = new IntersectionObserver(([e]) => { assistantVisible = e.isIntersecting; update() }, { threshold: 0.15 })
    if (assistant) io.observe(assistant)
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => { io.disconnect(); window.removeEventListener('scroll', update) }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <nav className="nav" aria-label="Primary">
        <div className="nav-inner">
          <button className="brand display" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="brand-mark">V</span>
            Vaibhav
          </button>
          <div className="nav-links">
            {NAV.map(n => (
              <button key={n.id} className={`nav-link link-underline${active === n.id ? ' on' : ''}`} onClick={() => scrollToId(n.id)}>{n.label}</button>
            ))}
          </div>
          <div className="nav-right">
            <a className="btn btn-ghost btn-sm" href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="btn btn-ghost btn-sm" href={RESUME} target="_blank" rel="noopener noreferrer">Résumé</a>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO */}
        <header className="hero wrap">
          <div className="hero-grid">
            <div className="hero-text stagger">
              <span className="hero-pill"><i className="pulse-dot" />Software Engineering Lead · Cialfo</span>
              <h1 className="hero-name">Vaibhav<br /><span className="gradient-text">Shrivastava</span></h1>
              <p className="hero-value">I lead engineering for Cialfo’s product — and build the agentic systems that let anyone on the team ship production code, safely.</p>
              <p className="hero-sub">Acting Engineering Business Lead: I work with business stakeholders on requirements, resourcing and direction. UI is my speciality; I now build end to end, across Ruby and infra. Five-plus years in, on a platform serving 310,000+ students.</p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={openAssistant}>Ask my assistant</button>
                <a className="btn btn-ghost" href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a className="btn btn-ghost" href={RESUME} target="_blank" rel="noopener noreferrer">Résumé</a>
              </div>
            </div>
            <div className="portrait">
              <img src="/avatar.webp" width="320" height="320" alt="Portrait of Vaibhav Shrivastava" />
            </div>
          </div>

          <div className="metrics">
            {HERO_METRICS.map(m => (
              <div className="metric" key={m.label}>
                <b style={{ color: m.color }}>{m.value}</b>
                <span>{m.label}</span>
                <small>{m.note}</small>
              </div>
            ))}
          </div>
        </header>

        {/* LEADERSHIP */}
        <section id="lead" className="sec">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">What I own</span>
              <h2 className="h2">From the business ask to production</h2>
            </div>
            <div className="principles two">
              {LEAD.map(p => (
                <div className="principle" key={p.title} style={{ borderTopColor: p.color }}>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="sec">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Selected work</span>
              <h2 className="h2">Agents in production, and the systems that ship them</h2>
            </div>
            <div className="work">
              {WORK.map(w => (
                <article className="work-item" key={w.title}>
                  <div className="work-title">
                    <h3><i style={{ background: w.color }} />{w.title}</h3>
                    <span className="work-ctx">{w.ctx}</span>
                  </div>
                  <div className="work-body">
                    <p>{w.body}</p>
                    <div className="work-row"><span className="row-label">Impact</span><span className="impact">{w.impact}</span></div>
                    <div className="work-row"><span className="row-label">Tools</span><span className="tools">{w.tools}</span></div>
                  </div>
                </article>
              ))}
            </div>
            <div className="also">
              <span className="eyebrow" style={{ color: P.copper }}>Also shipped</span>
              <ul>{ALSO.map(a => <li key={a}>{a}</li>)}</ul>
            </div>
          </div>
        </section>

        {/* APPROACH */}
        <section id="approach" className="sec">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">How I build with AI</span>
              <h2 className="h2">Speed is only useful if it’s safe to keep</h2>
            </div>
            <div className="principles">
              {PRINCIPLES.map(p => (
                <div className="principle" key={p.title} style={{ borderTopColor: p.color }}>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ASSISTANT */}
        <section id="assistant" className="sec">
          <div className="wrap assist-grid">
            <div className="assist-copy">
              <span className="eyebrow">This site is an agent</span>
              <h2 className="h2">Ask it about my work</h2>
              <p>Type a question or speak it. Tap a topic for a quick tour, or ask anything in your own words.</p>
              <ul className="specs">
                <li><span>Model</span>gpt-oss-120b, served by Groq</li>
                <li><span>Grounding</span>A fixed set of facts about my work — it won’t invent details</li>
                <li><span>Scope</span>Stays on my work and redirects anything else</li>
                <li><span>Voice</span>Whisper large-v3-turbo, tuned for names like Cialfo; stops listening a second after you pause</li>
              </ul>
            </div>
            <Assistant inputRef={inputRef} />
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="sec">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Experience</span>
              <h2 className="h2">Five years, from components to agents</h2>
            </div>
            <div className="roles">
              {ROLES.map(r => (
                <article className="role" key={r.role + r.period}>
                  <div className="role-when">
                    <span className="period">{r.period}</span>
                    <span className="company">{r.company}</span>
                  </div>
                  <div>
                    <h3 style={{ color: r.color }}>{r.role}{r.current && <span className="badge">CURRENT</span>}</h3>
                    {r.sub && <p className="role-sub">{r.sub}</p>}
                    <ul>{r.bullets.map(b => <li key={b}>{b}</li>)}</ul>
                  </div>
                </article>
              ))}
            </div>
            <div className="facts">
              <div className="fact">
                <span className="eyebrow" style={{ color: P.copper }}>Education</span>
                <p>B.Tech, Information Technology — Technocrats Institute of Technology, Bhopal. CGPA 8.64, 2021.</p>
              </div>
              <div className="fact">
                <span className="eyebrow" style={{ color: P.copper }}>Toolkit</span>
                <div className="toolkit">
                  {TOOLKIT.map(([k, v]) => <div key={k}><span>{k}</span>{v}</div>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <footer className="contact">
          <div className="wrap">
            <span className="eyebrow">Contact</span>
            <p className="contact-line display">Let’s talk <span className="gradient-text">shop.</span></p>
            <p className="contact-sub">Agentic systems, engineering leadership, UI engineering — always up for a good technical conversation.</p>
            <div className="contact-actions">
              <a className="btn btn-primary" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a className="btn btn-ghost" href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
            <div className="foot">
              <span>© 2026 Vaibhav Shrivastava</span>
              <span>Built with React · Groq · Whisper</span>
            </div>
          </div>
        </footer>
      </main>

      <button className="launcher" data-show={showLauncher ? 'true' : 'false'} onClick={openAssistant} aria-label="Ask my assistant" tabIndex={showLauncher ? 0 : -1}>
        <VAvatar />Ask my assistant
      </button>
    </>
  )
}
