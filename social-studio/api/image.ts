// Vercel Function: POST /api/image { prompt } -> { url } | { error }
// Generates with Cloudflare Workers AI (FLUX.1 Schnell), stores the JPEG in Vercel Blob, returns its public URL.
// CLOUDFLARE_* and BLOB_READ_WRITE_TOKEN are read here, server-side only; they never reach the browser.
import { put } from '@vercel/blob'

const MODEL = '@cf/black-forest-labs/flux-1-schnell'
const MAX_PROMPT_CHARS = 2048 // FLUX.1 Schnell's prompt limit on Workers AI

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

export async function POST(request: Request): Promise<Response> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim()
  const apiToken = process.env.CLOUDFLARE_API_TOKEN?.trim()
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  const missing = [
    !accountId && 'CLOUDFLARE_ACCOUNT_ID',
    !apiToken && 'CLOUDFLARE_API_TOKEN',
    !blobToken && 'BLOB_READ_WRITE_TOKEN'
  ].filter(Boolean)
  if (missing.length) {
    return json({ error: `Image generation is not configured: ${missing.join(', ')} missing on the server.` }, 500)
  }

  let prompt: unknown
  try {
    prompt = (await request.json())?.prompt
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return json({ error: 'An image prompt is required.' }, 400)
  }
  prompt = prompt.trim().slice(0, MAX_PROMPT_CHARS)

  let image: Buffer
  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, steps: 4 })
    })
    const data: any = await res.json().catch(() => null)
    if (!res.ok || !data?.result?.image) {
      console.error('[Cloudflare error]', res.status, data)
      const message = data?.errors?.[0]?.message || `status ${res.status}`
      return json({ error: `Image generation failed (${message}).` }, 502)
    }
    image = Buffer.from(data.result.image, 'base64')
  } catch (err) {
    console.error('[Cloudflare error]', err)
    return json({ error: 'Could not reach the image generation service. Please try again.' }, 502)
  }

  try {
    const blob = await put('generated/image.jpg', image, {
      access: 'public',
      contentType: 'image/jpeg',
      addRandomSuffix: true,
      token: blobToken
    })
    return json({ url: blob.url })
  } catch (err) {
    console.error('[Vercel Blob error]', err)
    return json({ error: 'Image was generated but could not be saved. Please try again.' }, 502)
  }
}
