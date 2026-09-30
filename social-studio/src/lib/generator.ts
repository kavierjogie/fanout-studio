import { GeneratedPiece, Platform } from '../types'
import { callAI } from './providers'

const PLATFORM_INSTRUCTIONS: Record<Platform, string> = {
  blog: `Write a detailed, structured, long-form blog article. Format with Markdown. 
Include an attention-grabbing Title, Introduction, a few well-defined sections (using H2 and H3 headings), bullet points or numbered lists where appropriate, and a conclusion/key takeaway.`,
  
  linkedin: `Write a professional, value-packed LinkedIn post. 
- Start with a compelling hook in the first line.
- Use generous line spacing (short paragraphs of 1-2 sentences) for readability.
- Provide 3-4 clear, actionable key takeaways using arrows or bullet points (e.g. • or →).
- End with an engaging question that drives professional discussion in comments.
- Do not use too many hashtags (max 3). Keep it professional and insightful.`,
  
  instagram: `Write an engaging, personal, and friendly Instagram caption.
- Start with a strong, scroll-stopping hook line.
- Use emojis throughout for visual texture.
- Keep paragraphs short and clean.
- Include a clear call to action (e.g., "Save this post for later!", "Let me know your thoughts in the comments").
- Include 5-10 relevant hashtags at the very bottom.`,
  
  tiktok: `Write a short, engaging shot-by-shot TikTok video script.
Format with clear labels indicating:
- [HOOK — 0:00-0:03]: On-screen text suggestions and energetic voiceover.
- [CONTEXT — 0:03-0:10]: Visual direction and voiceover.
- [PAYOFF — 0:10-0:20]: Value payload details, visuals, and voiceover.
- [CTA — 0:20-0:25]: Outro visual and high-energy voiceover call to follow or click the link.
Make it punchy, trendy, and conversational.`,
  
  x: `Write a sharp, high-impact post for X (formerly Twitter). 
- State a single, powerful, and thought-provoking idea.
- Keep it extremely concise. 
- MUST be strictly under 280 characters in length. No hashtags.`,
  
  promo: `Write high-converting, persuasive promotional copy.
- Lead with an exciting reveal or solution.
- Clearly present the benefits, offer, or features.
- Build urgency or excitement.
- End with a strong, clear call-to-action (CTA).`,
  
  hashtags: `Generate a list of 10-15 highly relevant, trending hashtags.
- DO NOT write any introductory, conversational, or explaining text.
- ONLY output the hashtags separated by spaces (e.g. #Marketing #Strategy).`,

  calendar: `Generate a structured weekly content calendar plan.
- Map out a 7-day schedule (Day 1 to Day 7).
- For each day, suggest: the recommended platform (e.g., LinkedIn, Instagram), the format (e.g., Carousel, Story, Short-form text), and a specific content angle/hook idea.
- Format this as a clean, readable Markdown layout (such as a table or a clear list).`,

  code: `Generate a clean, value-packed code snippet (HTML, CSS, JS, Python, React, etc.) with a brief explanation matching the topic.
- Format the response EXACTLY as:
  [Brief explanation of the code snippet]
  
  \`\`\`[language]
  [code snippet]
  \`\`\`
  
  Key Benefits/Takeaways:
  - [Benefit 1]
  - [Benefit 2]
- Make sure it contains exactly one code block inside markdown fence blocks, always tagged with its language.
- The snippet must run as-is in a browser preview with no network, build step or extra files:
  - HTML/CSS/JS: one complete HTML document with inline <style> and <script>; no CDN links.
  - React: one file using \`\`\`jsx, starting with \`import React, { useState } from 'react'\`, exporting a default component, styled with inline styles or a <style> tag; import nothing except react and react-dom.
  - Plain JavaScript/logic examples: use console.log to show the results.`
}


export async function generateForPlatform(
  topic: string,
  platform: Platform,
  tone: string,
  existingPieces?: GeneratedPiece[]
): Promise<string> {
  const context = existingPieces && existingPieces.length > 0
    ? `Here is the existing content generated for this idea:\n` +
      existingPieces.map(p => `[${p.platform.toUpperCase()}]:\n${p.content}`).join('\n\n')
    : ''

  const promptText = `
You are an expert social media marketer and content strategist.
We have an idea/topic: "${topic}" (Tone: "${tone}").
${context ? `We have already generated the following content for other platforms:\n\n${context}\n\n` : ''}
Generate a new, consistent version for the following target platform: ${platform.toUpperCase()}.

Format Guidelines for ${platform}:
${PLATFORM_INSTRUCTIONS[platform]}

Do not add intro/outro comments or formatting metadata wrapper. Return ONLY the final output content for ${platform}.
`

  return callAI(promptText)
}

export async function transformContent(
  topic: string,
  targets: Platform[],
  tone: string,
  existingPieces?: GeneratedPiece[]
): Promise<GeneratedPiece[]> {
  const promises = targets.map(async (platform) => {
    // Start text generation
    const textPromise = generateForPlatform(topic, platform, tone, existingPieces)
    
    // Start image generation in parallel if supported
    const imagePromise = platformSupportsImage(platform) ? generateImage(topic, tone) : null

    const content = await textPromise
    let imageData: { prompt: string; url: string } | undefined
    let imageError: string | undefined

    if (imagePromise) {
      try {
        imageData = await imagePromise
      } catch (err: any) {
        console.error('Failed to generate image', err)
        imageError = err.message || 'Failed to generate image.'
      }
    }

    return {
      platform,
      content,
      imageUrl: imageData?.url,
      imagePrompt: imageData?.prompt,
      imageError,
      imageGenerating: false
    }
  })
  return Promise.all(promises)
}

export async function regenerateForPlatform(
  topic: string,
  platform: Platform,
  tone: string,
  currentContent: string,
  instruction: string,
  existingPieces?: GeneratedPiece[]
): Promise<string> {
  const otherContext = existingPieces && existingPieces.length > 0
    ? `Here is the other content generated for this idea (for context consistency):\n` +
      existingPieces.filter(p => p.platform !== platform).map(p => `[${p.platform.toUpperCase()}]:\n${p.content}`).join('\n\n')
    : ''

  const promptText = `
You are an expert social media marketer and content strategist.
We have an idea/topic: "${topic}" (Tone: "${tone}").

We already generated a draft for the ${platform.toUpperCase()} platform, but the user wants to refine/rewrite it.

Current draft for ${platform.toUpperCase()}:
"""
${currentContent}
"""

The user's refinement instruction is: "${instruction}"

${otherContext ? `Other platforms' content for context:\n\n${otherContext}\n\n` : ''}

Please rewrite the ${platform.toUpperCase()} post according to the user's instruction.
Keep the rewrite consistent with the target platform guidelines.

Format Guidelines for ${platform}:
${PLATFORM_INSTRUCTIONS[platform]}

Do not add intro/outro comments or formatting metadata wrapper. Return ONLY the final revised output content for ${platform}.
`

  return callAI(promptText)
}

export function platformSupportsImage(platform: Platform): boolean {
  return ['instagram', 'linkedin', 'blog', 'x', 'promo'].includes(platform)
}

export async function generateImagePrompt(topic: string, tone: string): Promise<string> {
  const promptText = `
You are a creative visual designer and prompt engineer.
Create a highly detailed, descriptive, and vivid visual prompt for an image generator (like Stable Diffusion or Midjourney) based on the following topic and tone.
Topic: "${topic}"
Tone: "${tone}"

The prompt should describe:
- The subject or main focus of the image
- The setting, atmosphere, and lighting
- The style (e.g., professional photography, modern 3D render, minimalist vector illustration, etc.)
- Color palette and mood

Keep the output concise (1-2 sentences, max 60 words) but highly detailed. 
Avoid generic terms like "photorealistic". 
Return ONLY the prompt text, without any labels, quotes, intro, or explanation.
`
  const response = await callAI(promptText)
  // Clean up any formatting output from the LLM
  return response.replace(/^"|"$/g, '').replace(/^(Visual Prompt:|Prompt:)\s*/i, '').trim()
}

// Prompt via Groq, then image via /api/image (Cloudflare FLUX.1 Schnell -> Vercel Blob). Returns the Blob URL.
export async function generateImage(topic: string, tone: string): Promise<{ prompt: string; url: string }> {
  const prompt = await generateImagePrompt(topic, tone)
  if (!prompt) throw new Error('Could not create an image prompt. Please try again.')

  let res: Response
  try {
    res = await fetch('/api/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
  } catch {
    throw new Error('Could not reach the image generation service. Check your connection and try again.')
  }

  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.url) {
    throw new Error(data?.error || `Image generation failed with status ${res.status}`)
  }
  return { prompt, url: data.url }
}

// Best-effort cleanup of Blob images that are no longer referenced; failures only leave an orphaned file.
export function deleteImages(urls: string[]) {
  const blobUrls = urls.filter((u) => u.includes('.blob.vercel-storage.com/'))
  if (blobUrls.length === 0) return
  fetch('/api/image', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls: blobUrls })
  }).catch((err) => console.error('Failed to delete old images', err))
}
