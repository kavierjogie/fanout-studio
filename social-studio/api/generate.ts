// Vercel Function: POST /api/generate { prompt } -> { text } | { error }
// GROQ_API_KEY is read here, server-side only; it never reaches the browser.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
// Optional GROQ_MODEL env var overrides the default if Groq retires it
const DEFAULT_MODEL = 'openai/gpt-oss-20b'
const MAX_PROMPT_CHARS = 50_000

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.GROQ_API_KEY?.trim()
  if (!apiKey) {
    return json({ error: 'AI generation is not configured: GROQ_API_KEY is missing on the server.' }, 500)
  }

  let prompt: unknown
  try {
    prompt = (await request.json())?.prompt
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }
  if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > MAX_PROMPT_CHARS) {
    return json({ error: 'A prompt string (max 50,000 characters) is required.' }, 400)
  }

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    })
    const data: any = await res.json().catch(() => null)

    if (!res.ok) {
      console.error('[Groq error]', res.status, data)
      return json({ error: data?.error?.message || `Groq request failed with status ${res.status}` }, res.status)
    }

    const text = data?.choices?.[0]?.message?.content?.trim()
    if (!text) return json({ error: 'No content returned from Groq.' }, 502)
    return json({ text })
  } catch (err: any) {
    console.error('[Groq error]', err)
    return json({ error: 'Could not reach Groq. Please try again.' }, 502)
  }
}
