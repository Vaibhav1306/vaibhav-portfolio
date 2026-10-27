import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ ssrBuild }) => ({
  plugins: [react()],
  // the SSR bundle is emitted as .mjs so Node can import it without "type": "module"
  build: ssrBuild ? { rollupOptions: { output: { entryFileNames: '[name].mjs', format: 'es' } } } : {},
}))
