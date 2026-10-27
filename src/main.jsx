import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const container = document.getElementById('root')
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// production HTML is prerendered → hydrate it; the dev server serves an empty root → render
if (container.hasChildNodes()) ReactDOM.hydrateRoot(container, app)
else ReactDOM.createRoot(container).render(app)
