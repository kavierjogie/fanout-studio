# Studio — Social Media Content Studio

Create one piece of content and transform it into platform-ready formats: LinkedIn posts, Instagram captions, TikTok scripts, X posts, blog articles, promotional copy, hashtag sets, weekly content calendars, and code snippets.

## Core workflow

**One idea → multiple platforms.** Enter a topic, choose the platforms you need it for, and generate every version at once. Already created something? Use **Transform content** to expand it into the formats it's still missing.

- **Dashboard** — overview of the workflow, quick stats, platform distribution, and activity trend visualization charts
- **Create content** — the main generation flow (topic/prompt → platforms → tone selection → generate) powered by AI
- **Transform content** — turn existing posts or general drafts into additional platform formats
- **Prompt library** — ready-made prompts across Social Media, Marketing, Business, Content Creation, Advertising, Engagement, and Branding
- **Recent content** — browse, search, filter, and edit everything you've generated, with copy, delete, and single-post refinement capabilities
- **Content calendar** — schedule generated pieces against calendar dates to organize your publishing pipeline

## AI Content Generation (Groq)

All content generation runs through a server-side route, `social-studio/api/generate.ts`, which calls the **Groq** API (`openai/gpt-oss-20b` by default; override with the optional `GROQ_MODEL` env var). The browser only talks to `/api/generate`. The Groq API key is never sent to or stored in the browser.

### API Key Configuration
Set `GROQ_API_KEY` as a server-side environment variable (get a key at https://console.groq.com/keys):
- **Local dev**: add `GROQ_API_KEY=your_key` to `social-studio/.env`. The Vite dev server serves `/api/generate` with the same handler.
- **Vercel**: Project → Settings → Environment Variables → `GROQ_API_KEY`. Do **not** use a `VITE_` or `NEXT_PUBLIC_` prefix.

If the key is missing, generation returns a clear error that is shown in the app.

Your generated content and calendar schedules are saved to `localStorage` so they persist between sessions on the same browser.

## Requirements

- [Node.js](https://nodejs.org/) 18 or later
- npm (comes with Node.js)

## Install and run locally

Since the application codebase lives in the `social-studio` subdirectory, navigate there to run package commands:

```bash
# 1. Navigate to the project directory
cd social-studio

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open the URL shown in the terminal (typically `http://localhost:5173`).

## Build for production

```bash
# Navigate to the project directory
cd social-studio

# Build and preview
npm run build
npm run preview
```

`npm run build` outputs a static site to `dist/`, which you can deploy to any static host (Vercel, Netlify, GitHub Pages, S3, etc.).

## Project structure

```
social-studio/
  api/                  Vercel serverless functions (generate.ts → Groq)
  src/
    components/         UI components (Dashboard, CreateContent, TransformContent, RecentContent, ContentCalendar, Sidebar, etc.)
    components/ui/      Small shared primitives (Card, Button, Badge)
    data/               Prompt library templates and platform metadata
    lib/                AI client (calls /api/generate), localStorage persistence, and prompting rules
    types.ts            Shared TypeScript types
    App.tsx             Layout, navigation, and state manager
    main.tsx            React entry point
    index.css           Tailwind entry point + global theme styles
```

## Customizing content generation and platforms

All generation prompt logic lives in [generator.ts](file:///c:/Users/Administrator/Desktop/social-media-content-studio/social-studio/src/lib/generator.ts). Each platform has its own defined prompt instructions in `PLATFORM_INSTRUCTIONS`.

To add a new platform:
1. Add it to the `Platform` type in `src/types.ts`.
2. Add its metadata (label, default tone, limits, guidelines) to `src/data/platforms.ts`.
3. Add its prompt guidelines to `PLATFORM_INSTRUCTIONS` and any custom handler details in [generator.ts](file:///c:/Users/Administrator/Desktop/social-media-content-studio/social-studio/src/lib/generator.ts).
4. Add an icon mapping in `src/components/PlatformIcon.tsx`.

## Tech stack

React 18, TypeScript, Vite, Tailwind CSS, Lucide React icons, Groq API via a Vercel Function.
