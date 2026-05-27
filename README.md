# Vaibhav Shrivastava — Portfolio

Personal portfolio site built with React 18 + Vite. Features a dark blue-slate design with gradient accents, a two-column hero with profile photo, and an AI chat powered by Groq that responds as Vaibhav in first person.

## Tech Stack

- **React 18 + Vite** — single page app, zero CSS frameworks
- **Groq API** — llama-3.3-70b-versatile for the AI chat
- **Vercel** — hosting

## Local Setup

1. Clone the repo
   ```bash
   git clone https://github.com/Vaibhav1306/vaibhav-portfolio.git
   cd vaibhav-portfolio
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root
   ```
   VITE_GROQ_API_KEY=your_groq_key_here
   ```
   Get a free key at [console.groq.com](https://console.groq.com)

4. Start the dev server
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

## Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import this repo
3. Add environment variable: `VITE_GROQ_API_KEY` = your Groq key
4. Click **Deploy** — live in ~2 minutes
