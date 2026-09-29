import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import * as generateApi from './api/generate'
import * as imageApi from './api/image'

// Dev only: serve /api/* with the same handlers Vercel deploys from api/
const apiDevPlugin = (): Plugin => ({
  name: 'api-dev',
  configureServer(server) {
    for (const [path, api] of [['/api/generate', generateApi], ['/api/image', imageApi]] as const) {
      server.middlewares.use(path, async (req, res) => {
        const handler = (api as Record<string, unknown>)[req.method ?? '']
        if (typeof handler !== 'function') {
          res.statusCode = 405
          res.end()
          return
        }
        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(chunk as Buffer)
        const response = await handler(
          new Request(`http://localhost${path}`, { method: req.method, body: Buffer.concat(chunks) })
        )
        res.statusCode = response.status
        res.setHeader('Content-Type', 'application/json')
        res.end(await response.text())
      })
    }
  }
})

export default defineConfig(({ mode }) => {
  // Make server-side keys from .env visible to the dev API handlers (server-side only, not exposed to the client)
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['GROQ_API_KEY', 'GROQ_MODEL', 'CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN', 'BLOB_READ_WRITE_TOKEN']) {
    if (process.env[key] === undefined && env[key] !== undefined) process.env[key] = env[key]
  }

  return {
    plugins: [react(), apiDevPlugin()],
    server: {
      port: 5173
    }
  }
})
