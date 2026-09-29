import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { POST as generate } from './api/generate'

// Dev only: serve /api/generate with the same handler Vercel deploys from api/generate.ts
const apiDevPlugin = (): Plugin => ({
  name: 'api-dev',
  configureServer(server) {
    server.middlewares.use('/api/generate', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405
        res.end()
        return
      }
      const chunks: Buffer[] = []
      for await (const chunk of req) chunks.push(chunk as Buffer)
      const response = await generate(
        new Request('http://localhost/api/generate', { method: 'POST', body: Buffer.concat(chunks) })
      )
      res.statusCode = response.status
      res.setHeader('Content-Type', 'application/json')
      res.end(await response.text())
    })
  }
})

export default defineConfig(({ mode }) => {
  // Make GROQ_API_KEY from .env visible to the dev API handler (server-side only, not exposed to the client)
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['GROQ_API_KEY', 'GROQ_MODEL']) {
    if (process.env[key] === undefined && env[key] !== undefined) process.env[key] = env[key]
  }

  return {
    plugins: [react(), apiDevPlugin()],
    server: {
      port: 5173
    }
  }
})
