// All AI generation goes through the server-side /api/generate route (Groq).
export async function callAI(prompt: string): Promise<string> {
  let res: Response
  try {
    res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
  } catch {
    throw new Error('Could not reach the AI generation service. Check your connection and try again.')
  }

  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.text) {
    throw new Error(data?.error || `AI generation failed with status ${res.status}`)
  }
  return data.text
}
