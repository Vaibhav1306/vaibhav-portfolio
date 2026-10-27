// Bakes the rendered page into dist/index.html so crawlers and link previews see real content.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const indexPath = path.join(root, 'dist', 'index.html')
const ssrDir = path.join(root, 'dist-ssr')
const ssrEntry = path.join(ssrDir, 'entry-server.mjs')

const { render } = await import(pathToFileURL(ssrEntry).href)
const appHtml = render()

const template = fs.readFileSync(indexPath, 'utf8')
const placeholder = '<div id="root"></div>'
if (!template.includes(placeholder)) throw new Error('prerender: <div id="root"></div> not found in dist/index.html')

fs.writeFileSync(indexPath, template.replace(placeholder, `<div id="root">${appHtml}</div>`))
fs.rmSync(ssrDir, { recursive: true, force: true }) // build-time only; never deployed

console.log(`prerender: wrote ${appHtml.length.toLocaleString()} chars of HTML into dist/index.html`)
