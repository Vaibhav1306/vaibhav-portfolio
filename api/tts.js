// Serverless TTS proxy — keeps the provider key server-side (never shipped to the browser).
// Activates with whichever ONE key set is present in the Vercel env; otherwise returns 501
// and the frontend falls back to the device (Web Speech) voice.
//
//   ElevenLabs   → ELEVENLABS_API_KEY  (+ ELEVENLABS_VOICE_ID = an Indian male voice from your library)
//   Google TTS   → GOOGLE_TTS_API_KEY  (voice defaults to en-IN-Neural2-B, male; override with GOOGLE_TTS_VOICE)
//   Azure Speech → AZURE_SPEECH_KEY + AZURE_SPEECH_REGION  (voice defaults to en-IN-PrabhatNeural)

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method not allowed' }); return }

  try {
    let body = req.body
    if (!body || typeof body === 'string') { try { body = JSON.parse(body || '{}') } catch { body = {} } }
    const text = (body.text || '').toString().trim().slice(0, 900)
    if (!text) { res.status(400).json({ error: 'no text' }); return }

    const sendAudio = (buf) => {
      res.setHeader('Content-Type', 'audio/mpeg')
      res.setHeader('Cache-Control', 'no-store')
      res.status(200).send(buf)
    }

    // 1) ElevenLabs — most human
    if (process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID) {
      const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`, {
        method: 'POST',
        headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
        body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
      })
      if (!r.ok) { res.status(502).json({ error: 'elevenlabs_failed', detail: await r.text().catch(() => '') }); return }
      return sendAudio(Buffer.from(await r.arrayBuffer()))
    }

    // 2) Google Cloud Text-to-Speech — fixed natural Indian male voice, big free tier
    if (process.env.GOOGLE_TTS_API_KEY) {
      const r = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: 'en-IN', name: process.env.GOOGLE_TTS_VOICE || 'en-IN-Neural2-B', ssmlGender: 'MALE' },
          audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0, pitch: 0 },
        }),
      })
      const data = await r.json().catch(() => ({}))
      if (!r.ok || !data.audioContent) { res.status(502).json({ error: 'google_failed', detail: data.error || '' }); return }
      return sendAudio(Buffer.from(data.audioContent, 'base64'))
    }

    // 3) Azure Speech — en-IN-PrabhatNeural, very natural
    if (process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION) {
      const voice = process.env.AZURE_SPEECH_VOICE || 'en-IN-PrabhatNeural'
      const esc = text.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))
      const ssml = `<speak version='1.0' xml:lang='en-IN'><voice name='${voice}'>${esc}</voice></speak>`
      const r = await fetch(`https://${process.env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
          'User-Agent': 'vaibhav-portfolio',
        },
        body: ssml,
      })
      if (!r.ok) { res.status(502).json({ error: 'azure_failed', detail: await r.text().catch(() => '') }); return }
      return sendAudio(Buffer.from(await r.arrayBuffer()))
    }

    // no provider configured — client uses the device voice
    res.status(501).json({ error: 'no_tts_provider' })
  } catch {
    res.status(500).json({ error: 'tts_error' })
  }
}
