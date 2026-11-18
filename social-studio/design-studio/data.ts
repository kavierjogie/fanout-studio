// Design Preview Studio data. Dev-only: nothing in src/ imports this.
// "Observed" values were measured from each live homepage's DOM on 2026-11-18 (above the fold only).

export interface Research {
  name: string
  url: string
  img?: string
  style: string
  observed: string
  works: string
  learn: string
  avoid: string
}

export const RESEARCH: Research[] = [
  {
    name: 'Buffer',
    url: 'https://buffer.com',
    img: 'buffer.jpg',
    style: 'Warm, friendly, low-chrome',
    observed: 'Off-white #FEFDFB page, deep green-black ink #213130, mint CTA #B0EC9C, Stolzl/Figtree type. Platform logos float loosely around the headline.',
    works: 'Quiet neutral base lets the platform logos supply all the colour. Ink is a tinted near-black, not pure black.',
    learn: 'Use a tinted neutral instead of pure grey; let platform colours be the only "loud" colour in the UI.',
    avoid: 'The scattered-logo hero is now a category cliché.'
  },
  {
    name: 'Later',
    url: 'https://later.com',
    img: 'later.jpg',
    style: 'Loud, poster-like, playful',
    observed: 'Cream #F8F2EA, black, ultra-heavy "Super X sans Display" at weight 900, purple #5124C1 and hot orange #FE3F00 accents.',
    works: 'Type does the branding — the heavy wordmark is recognisable without any illustration.',
    learn: 'A strong typographic voice can carry identity on its own; cream + black is far more ownable than a gradient.',
    avoid: 'Weight 900 everywhere is tiring inside a working app; it suits marketing, not a drafting tool.'
  },
  {
    name: 'Hootsuite',
    url: 'https://www.hootsuite.com',
    img: 'hootsuite.jpg',
    style: 'Corporate, photo-led',
    observed: 'Deep teal-navy #012B3A text, red #E03035 brand, Montserrat 700, large lifestyle photography with floating UI chips.',
    works: 'Floating "insight" chips over a photo show product value without a full screenshot.',
    learn: 'Showing small, real fragments of output (a caption, a hashtag set) sells "one idea → many formats" quickly.',
    avoid: 'Stock-photo people and Montserrat feel enterprise-generic.'
  },
  {
    name: 'Sprout Social',
    url: 'https://sproutsocial.com',
    img: 'sprout.jpg',
    style: 'High-contrast, confident',
    observed: 'Near-black #040404 hero, white Proxima Nova 800, mint #98E58E CTA, pill buttons.',
    works: 'One saturated accent on black is instantly legible and calm.',
    learn: 'A single non-purple accent on a dark base can still feel premium and energetic.',
    avoid: 'Mint-on-black is now shared by Sprout and Buffer; we should not land in the same spot.'
  },
  {
    name: 'Typefully',
    url: 'https://typefully.com',
    img: 'typefully.jpg',
    style: 'Product-as-hero, dark, writerly',
    observed: 'Dark #111418, Inter 700, the real editor UI sits behind the hero; blue #199AF5 sign-up, orange "Schedule" button.',
    works: 'The writing surface itself is the brand — draft, author avatar, Schedule/Publish actions are visible immediately.',
    learn: 'Fanout\'s draft cards should feel like real posts (author line, character count, publish actions), not generic cards.',
    avoid: 'Inter + blue on dark is indistinguishable from dozens of tools.'
  },
  {
    name: 'Planable',
    url: 'https://www.planable.io',
    img: 'planable.jpg',
    style: 'Clean collaborative workspace',
    observed: 'White, Gilroy 700 at 61px, blue #2EA3F2, a real calendar/campaign UI as the hero image.',
    works: 'Calendar + campaign grouping is shown as the product\'s core, with platform previews inside each day.',
    learn: 'Scheduled posts should look like miniature previews on the calendar, not just dots.',
    avoid: 'Light-blue SaaS palette; generic geometric sans.'
  },
  {
    name: 'Jasper',
    url: 'https://www.jasper.ai',
    img: 'jasper.jpg',
    style: 'Editorial enterprise',
    observed: 'Serif display "Feature" at 64px/400, navy #00063D, red-orange #FA4028 highlight tag, pale-blue hero.',
    works: 'An AI writing company chose an editorial serif and dropped the purple — reads as "writing", not "AI toy".',
    learn: 'Serif display type is a credible signal for a content/writing product.',
    avoid: 'Copying the serif + red-orange combination too literally would make Fanout look like Jasper.'
  },
  {
    name: 'Castmagic',
    url: 'https://www.castmagic.io',
    img: 'castmagic.jpg',
    style: 'Soft, neutral, tool-forward',
    observed: 'Dusty pink #F0E6EB page, DM Sans 500 headline, zinc greys, format chips: Captions, Newsletter, Tweets, YouTube Script, LinkedIn.',
    works: 'The input → format chips pattern is exactly Fanout\'s workflow, shown in the hero.',
    learn: 'Format chips are the hero interaction; they deserve the most design attention.',
    avoid: 'Zinc-grey Tailwind defaults make the UI feel templated.'
  },
  {
    name: 'Canva (Social Media)',
    url: 'https://www.canva.com/social-media/',
    img: 'canva.jpg',
    style: 'Vibrant creative suite',
    observed: 'Dark hero, Canva Sans 400 at 56px, violet #A370FC / periwinkle #9E9EFF button and gradients.',
    works: 'Light headline weight on dark feels modern and unforced.',
    learn: 'Big headlines don\'t need heavy weights.',
    avoid: 'This is the purple-gradient look Fanout currently has — the strongest reason to move away from it.'
  },
  {
    name: 'Copy.ai',
    url: 'https://www.copy.ai',
    img: 'copyai.jpg',
    style: 'Stark typographic B2B',
    observed: 'White, ABC Normal 600 at 88px, near-black #171717, a single violet "Get a Demo" button.',
    works: 'Massive tight headline, almost no colour — confident and fast to read.',
    learn: 'Restraint: one accent used only for the primary action.',
    avoid: 'Violet CTA again — the category default.'
  }
]

export interface Ref {
  name: string
  url: string
  img?: string
  section: 'Aesthetic' | 'Colour' | 'Typography' | 'Layout' | 'Components' | 'Imagery' | 'Interaction'
  territory: string
  interesting: string
  adapt: string
  avoid: string
}

export const TERRITORIES = [
  {
    id: 'Editorial publishing',
    blurb: 'Newsrooms, proof sheets and magazines. Fanout is a writing-and-publishing tool: drafts, edits, scheduled issues. Serif display, hairline rules, proofreader marks.',
    refs: ['Jasper', 'Later', 'Are.na']
  },
  {
    id: 'Broadcast hardware',
    blurb: 'Mixing desks, patch bays, signal routing. "One input → many outputs" is literally what a switchboard does. Mono labels, LED status, tactile keys.',
    refs: ['Teenage Engineering', 'Typefully', 'Linear']
  },
  {
    id: 'Calm creator studio',
    blurb: 'Warm, tinted neutrals and a single soft accent. Approachable for solo creators and small teams who live in the tool daily.',
    refs: ['Buffer', 'Sprout Social', 'Castmagic']
  }
]

export const REFS: Ref[] = [
  { name: 'Fanout today', url: 'http://localhost:5173', img: 'fanout-current.jpg', section: 'Aesthetic', territory: '—', interesting: 'Baseline: deep purple ink, purple→pink→orange gradient headline, glow shadow on the primary button.', adapt: 'Keep the fan mark geometry and the pipeline diagram idea — they are genuinely on-concept.', avoid: 'The gradient text, purple glow and violet-tinted greys are what read as "AI-generated".' },
  { name: 'Teenage Engineering', url: 'https://teenage.engineering', img: 'teenage.jpg', section: 'Aesthetic', territory: 'Broadcast hardware', interesting: 'Pure black, pictogram nav with tiny lowercase labels, product lit like an object.', adapt: 'Tiny mono labels + bold pictograms for platform selection; status shown as indicator lights.', avoid: 'Their custom typeface and hardware photography — not ours to borrow.' },
  { name: 'Are.na', url: 'https://www.are.na', img: 'arena.jpg', section: 'Typography', territory: 'Editorial publishing', interesting: 'Black page, one narrow text column, lettered list (a. b. c.) as structure — almost no UI.', adapt: 'Numbered/lettered steps for the Create flow; generous single-column reading width for long drafts.', avoid: 'Its anti-design minimalism would hide Fanout\'s many controls.' },
  { name: 'Later', url: 'https://later.com', img: 'later.jpg', section: 'Typography', territory: 'Editorial publishing', interesting: 'A weight-900 display face is the whole brand.', adapt: 'Give one concept a heavyweight display face for headings only.', avoid: 'Heavy type in body or controls.' },
  { name: 'Jasper', url: 'https://www.jasper.ai', img: 'jasper.jpg', section: 'Typography', territory: 'Editorial publishing', interesting: 'Regular-weight serif display for an AI writing product.', adapt: 'Serif for page titles and draft headlines; sans for UI.', avoid: 'Their exact serif + red-orange pairing.' },
  { name: 'Buffer', url: 'https://buffer.com', img: 'buffer.jpg', section: 'Colour', territory: 'Calm creator studio', interesting: 'Green-tinted near-black ink on warm off-white; one mint CTA.', adapt: 'Tint the neutrals toward the accent hue so the palette feels deliberate.', avoid: 'Mint CTA (shared by Buffer and Sprout).' },
  { name: 'Sprout Social', url: 'https://sproutsocial.com', img: 'sprout.jpg', section: 'Colour', territory: 'Calm creator studio', interesting: 'Single bright accent on #040404.', adapt: 'One accent, reserved for the primary action and active state.', avoid: 'Same mint/black territory.' },
  { name: 'Canva', url: 'https://www.canva.com/social-media/', img: 'canva.jpg', section: 'Colour', territory: '—', interesting: 'Violet buttons and gradients on dark — the category default.', adapt: 'Nothing: this is the look to move away from.', avoid: 'Purple/violet gradients and glows.' },
  { name: 'Typefully', url: 'https://typefully.com', img: 'typefully.jpg', section: 'Layout', territory: 'Broadcast hardware', interesting: 'The real editor sits behind the hero; drafts look like real posts with author and actions.', adapt: 'Draft cards modelled on the destination platform: author row, char counter, Schedule / Copy actions.', avoid: 'Blue-on-#111 palette.' },
  { name: 'Planable', url: 'https://www.planable.io', img: 'planable.jpg', section: 'Layout', territory: 'Calm creator studio', interesting: 'Campaign calendar with mini post previews per day.', adapt: 'Calendar cells that show a platform glyph + first line of the post.', avoid: 'Generic white SaaS framing.' },
  { name: 'Castmagic', url: 'https://www.castmagic.io', img: 'castmagic.jpg', section: 'Components', territory: 'Calm creator studio', interesting: 'Input box followed by format chips (Captions, Newsletter, Tweets…).', adapt: 'Platform chips as the hero component: big, tactile, with their own selected state.', avoid: 'Default zinc chips.' },
  { name: 'Hootsuite', url: 'https://www.hootsuite.com', img: 'hootsuite.jpg', section: 'Imagery', territory: '—', interesting: 'Floating output chips over a photo.', adapt: 'Fanout already generates FLUX images — show them large in draft previews instead of stock art.', avoid: 'Stock lifestyle photography.' },
  { name: 'Copy.ai', url: 'https://www.copy.ai', img: 'copyai.jpg', section: 'Interaction', territory: '—', interesting: 'Very little motion; content appears instantly and the type does the work.', adapt: 'Motion only where it explains something: the fan-out when drafts arrive, the counter as you type.', avoid: 'Decorative looping animations.' }
]

export const DESIGN_LANGUAGE = {
  words: ['Editorial', 'Precise', 'Warm', 'Confident', 'Unhurried'],
  typography: 'A characterful display face for page titles and draft headlines only; a highly legible sans for UI and long drafts; mono for counts, dates and labels (char limits are a core feature).',
  colour: 'Tinted dark neutrals (never violet-grey). One accent, used for the primary action, focus and "live" state. Platform brand colours stay on platform glyphs only, so they never compete with the accent.',
  layout: 'Left index navigation, a single comfortable reading column for drafts (≈68ch), numbered steps in Create, dense but calm dashboard.',
  components: 'Hairline borders over shadows, small radii, chips that look pressable, draft cards that resemble the destination post.',
  imagery: 'Generated FLUX images shown full-bleed inside draft previews; no stock art, no abstract blobs.',
  motion: '150–250ms ease-out; the only signature motion is drafts fanning out from the idea. Respect reduced-motion.',
  avoid: 'Gradient text, purple glow shadows, glassmorphism, sparkles icon as the "AI" signifier, emoji-heavy UI.'
}

export interface Palette {
  bg: string
  surface: string
  surface2: string
  line: string
  text: string
  text2: string
  text3: string
  accent: string
  onAccent: string
  accent2: string
}

export interface Concept {
  id: string
  name: string
  tagline: string
  philosophy: string
  refs: string[]
  influence: string
  palette: Palette
  fonts: { display: string; body: string; mono: string; displayWeight: number; displayCase?: 'upper' | 'none'; displayItalic?: boolean }
  radius: number
  card: 'hairline' | 'filled' | 'offset' | 'bracket' | 'block' | 'keycap'
  nav: 'index' | 'pill' | 'keycap' | 'underline' | 'bar'
  pattern: 'none' | 'grid' | 'grain' | 'dots' | 'scan'
  label: 'mono' | 'sans' | 'serif'
  surfaces: string
  cards: string
  navigation: string
  icons: string
  motion: string
  distinctive: string
  concerns: string
}

export const CONCEPTS: Concept[] = [
  {
    id: 'proof',
    name: 'Proof Sheet',
    tagline: 'An editor\'s desk at night',
    philosophy: 'Fanout is a writing and publishing tool, so it should look like one. Warm charcoal paper, cream ink, a proofreader\'s vermilion for the one thing you should do next. Drafts are set like galley proofs.',
    refs: ['Jasper', 'Are.na', 'Later'],
    influence: 'Jasper proved a serif reads as "writing" for an AI product; Are.na\'s lettered structure becomes numbered Create steps; Later shows type alone can be the brand.',
    palette: { bg: '#14120F', surface: '#1C1915', surface2: '#26221D', line: '#3A342C', text: '#F3ECDF', text2: '#C9BFAE', text3: '#9C907F', accent: '#FF5A3C', onAccent: '#14120F', accent2: '#E9C46A' },
    fonts: { display: 'Instrument Serif', body: 'Inter Tight', mono: 'IBM Plex Mono', displayWeight: 400 },
    radius: 4,
    card: 'hairline',
    nav: 'index',
    pattern: 'grain',
    label: 'mono',
    surfaces: 'Flat warm charcoal with a faint paper grain; surfaces separated by 1px rules, not shadows.',
    cards: 'Hairline-bordered, 4px radius, mono caption row (platform · chars · tone). Draft text set at 15/1.65 in a 68ch column.',
    navigation: 'Numbered index (01 Dashboard, 02 Create…) with a vermilion rule beside the active item.',
    icons: 'Lucide at 1.5 stroke, cream; platform glyphs keep brand colour. Fan mark redrawn in vermilion/ochre/cream.',
    motion: 'Ink-in: text fades up 4px over 200ms; generated drafts deal out left-to-right 60ms apart.',
    distinctive: 'No one in the category uses an editorial-serif dark theme; vermilion "proof" red is ownable against a sea of blue and violet.',
    concerns: 'Serif display at small sizes is weak — keep it ≥24px. Red primary can read as "danger"; destructive actions must use a different treatment (outline + icon).'
  },
  {
    id: 'switchboard',
    name: 'Switchboard',
    tagline: 'One input, patched to every channel',
    philosophy: 'Fanout routes one idea to nine outputs — a mixing desk. Graphite hardware, signal-yellow keys, LED status per channel. Precise, tactile, a little nerdy.',
    refs: ['Teenage Engineering', 'Typefully', 'Linear'],
    influence: 'Teenage Engineering\'s pictogram nav and tiny labels; Typefully\'s draft-as-hero; Linear\'s disciplined dark neutrals.',
    palette: { bg: '#111110', surface: '#1A1A18', surface2: '#242421', line: '#363631', text: '#EDEDE4', text2: '#B8B8AC', text3: '#8E8E82', accent: '#FFC53D', onAccent: '#111110', accent2: '#FF6A2B' },
    fonts: { display: 'Archivo', body: 'Archivo', mono: 'JetBrains Mono', displayWeight: 800, displayCase: 'none' },
    radius: 6,
    card: 'keycap',
    nav: 'keycap',
    pattern: 'dots',
    label: 'mono',
    surfaces: 'Graphite panels with a subtle dot-matrix ground; inset panels look recessed.',
    cards: 'Keycap-like: 1px top highlight, 2px darker bottom edge; channel strip header with LED dot.',
    navigation: 'Icon keys with mono labels; active key lights yellow.',
    icons: 'Lucide 2px stroke; each platform has an LED that glows when selected/generated.',
    motion: 'Key press drops 1px; LEDs blink once when a draft lands; meters fill with ease-out.',
    distinctive: 'Directly expresses the product metaphor (routing one signal to many outputs) — nobody in social tooling looks like this.',
    concerns: 'Mono-heavy labels slow scanning; keep body copy in Archivo. Hardware skeuomorphism can feel gimmicky if over-applied.'
  },
  {
    id: 'greenroom',
    name: 'Greenroom',
    tagline: 'Calm backstage before you go live',
    philosophy: 'A calm, forest-tinted workspace for creators who live in the tool daily. Soft mint for action, clay for warmth. Friendly, rounded, unhurried.',
    refs: ['Buffer', 'Sprout Social', 'Castmagic'],
    influence: 'Buffer\'s tinted ink, Sprout\'s single accent on dark, Castmagic\'s chip-first input.',
    palette: { bg: '#0E1714', surface: '#14201C', surface2: '#1C2B25', line: '#2B3E36', text: '#E6F0EA', text2: '#B3C4BA', text3: '#88998F', accent: '#86E0A0', onAccent: '#0B1A12', accent2: '#E9A47C' },
    fonts: { display: 'Bricolage Grotesque', body: 'Manrope', mono: 'DM Mono', displayWeight: 600 },
    radius: 16,
    card: 'filled',
    nav: 'pill',
    pattern: 'none',
    label: 'sans',
    surfaces: 'Layered forest tones; raised cards are a step lighter, no borders needed.',
    cards: 'Filled, 16px radius, soft inner highlight; chips are full pills.',
    navigation: 'Pill highlight behind the active item; icons in soft mint.',
    icons: 'Lucide 1.75 stroke, rounded caps; friendly spot illustrations for empty states.',
    motion: 'Springy (but subtle) scale on chips, 220ms ease-out page fades.',
    distinctive: 'Warm and humane rather than techy; strong daily-use comfort.',
    concerns: 'Mint-on-dark sits close to Sprout/Buffer\'s colour territory; less memorable than bolder options.'
  },
  {
    id: 'riso',
    name: 'Riso Club',
    tagline: 'Zine energy for social-first teams',
    philosophy: 'Risograph print: fluoro pink and yellow on deep ink, hard offset shadows, expressive display type. Content creation should feel fun.',
    refs: ['Later', 'Castmagic', 'Hootsuite'],
    influence: 'Later\'s heavyweight type confidence; Castmagic\'s chips; Hootsuite\'s floating output fragments.',
    palette: { bg: '#15172B', surface: '#1D2038', surface2: '#272B49', line: '#3B4068', text: '#FFF6E8', text2: '#D6D3E4', text3: '#A4A4C3', accent: '#FF6FA5', onAccent: '#15172B', accent2: '#FFE15A' },
    fonts: { display: 'Syne', body: 'DM Sans', mono: 'Space Mono', displayWeight: 800 },
    radius: 10,
    card: 'offset',
    nav: 'bar',
    pattern: 'dots',
    label: 'mono',
    surfaces: 'Ink navy with a halftone dot texture on hero panels.',
    cards: 'Solid surface + 4px hard offset shadow in yellow on hover/selected.',
    navigation: 'Chunky bar highlight in pink with ink text.',
    icons: 'Lucide 2px; sticker-like platform badges.',
    motion: 'Snappy 120ms press (shadow collapses), playful wobble on success only.',
    distinctive: 'Unmistakable personality; feels made by people, not generated.',
    concerns: 'Can feel juvenile for B2B users; offset shadows add visual noise in dense lists.'
  },
  {
    id: 'monolith',
    name: 'Monolith',
    tagline: 'Nothing but the work',
    philosophy: 'Strictly monochrome. The only colour on screen comes from platform glyphs and generated images. Maximum focus on the drafts.',
    refs: ['Linear', 'Copy.ai', 'Typefully'],
    influence: 'Linear\'s near-black neutrals and restraint; Copy.ai\'s single-accent discipline; Typefully\'s writing focus.',
    palette: { bg: '#0A0A0B', surface: '#121214', surface2: '#1A1A1D', line: '#28282C', text: '#F5F5F6', text2: '#ABABB2', text3: '#85858D', accent: '#F5F5F6', onAccent: '#0A0A0B', accent2: '#6E6E76' },
    fonts: { display: 'Geist', body: 'Geist', mono: 'Geist Mono', displayWeight: 600 },
    radius: 8,
    card: 'hairline',
    nav: 'underline',
    pattern: 'none',
    label: 'sans',
    surfaces: 'Two-step neutral elevation; hairline borders.',
    cards: 'Hairline, 8px radius, white primary buttons.',
    navigation: 'Text list with a 2px white bar on the active item.',
    icons: 'Lucide 1.5 stroke, grey; platform glyphs in brand colour are the only hue.',
    motion: 'Minimal: 150ms fades, no transforms.',
    distinctive: 'Lets user content be the colour; extremely scalable.',
    concerns: 'Least ownable — risks looking like every Linear-inspired tool. Weak brand recall.'
  },
  {
    id: 'darkroom',
    name: 'Darkroom',
    tagline: 'Content, developed',
    philosophy: 'Cinematic and image-first. True black, teal-and-amber grade, sharp corners. Generated FLUX images take centre stage, like prints on a light table.',
    refs: ['Hootsuite', 'Canva', 'Teenage Engineering'],
    influence: 'Hootsuite\'s image-led storytelling (with our own generated images instead of stock); TE\'s object-lit-on-black staging.',
    palette: { bg: '#050607', surface: '#0E1112', surface2: '#161A1C', line: '#262C2F', text: '#F4EFE7', text2: '#BDB7AE', text3: '#8F8A82', accent: '#3FD0C9', onAccent: '#041314', accent2: '#FF9F5A' },
    fonts: { display: 'DM Serif Display', body: 'DM Sans', mono: 'DM Mono', displayWeight: 400 },
    radius: 2,
    card: 'bracket',
    nav: 'underline',
    pattern: 'scan',
    label: 'mono',
    surfaces: 'Pure black with a soft vignette; panels barely lift.',
    cards: 'Sharp, with corner crop-marks; images full-bleed.',
    navigation: 'Slim text nav, teal underline on active.',
    icons: 'Thin 1.25 stroke; crop-mark motif on selection.',
    motion: 'Slow 300ms "develop" fade from dark on images; nothing bouncy.',
    distinctive: 'Feels premium and visual; plays to the image-generation feature.',
    concerns: 'Most drafts are text-only, so the image-first framing can feel empty. Sharp corners + black can feel cold.'
  },
  {
    id: 'dispatch',
    name: 'Dispatch',
    tagline: 'Filed to every desk',
    philosophy: 'A newswire terminal: condensed uppercase headlines, timestamps everywhere, chartreuse "live" signal. Urgent, bold, built for volume.',
    refs: ['Later', 'Sprout Social', 'Copy.ai'],
    influence: 'Copy.ai\'s massive tight headline; Later\'s poster confidence; Sprout\'s single accent on black.',
    palette: { bg: '#121212', surface: '#1B1B1B', surface2: '#252525', line: '#363636', text: '#F2F2EE', text2: '#BDBDB6', text3: '#909089', accent: '#D4FF3A', onAccent: '#121212', accent2: '#FF4D2E' },
    fonts: { display: 'Barlow Condensed', body: 'Barlow', mono: 'IBM Plex Mono', displayWeight: 700, displayCase: 'upper' },
    radius: 0,
    card: 'block',
    nav: 'bar',
    pattern: 'none',
    label: 'mono',
    surfaces: 'Flat graphite slabs; thick 2px top rules on sections.',
    cards: 'Square, top-ruled, with a timestamp slug line.',
    navigation: 'Uppercase condensed list; active item is a chartreuse slab.',
    icons: 'Lucide 2px; "LIVE" and "FILED" status tags.',
    motion: 'Hard cuts, ticker-style counters, no easing flourishes.',
    distinctive: 'High-energy and very recognisable; suits the "publish everywhere" promise.',
    concerns: 'Uppercase condensed headlines hurt readability in long titles; chartreuse can vibrate on some screens.'
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    tagline: 'Drafted to spec',
    philosophy: 'Technical drawing: navy sheet, cobalt lines, a measured grid. Content is engineered for each platform\'s constraints — char limits as dimensions.',
    refs: ['Planable', 'Linear', 'Typefully'],
    influence: 'Planable\'s structured calendar; Linear\'s precision; Typefully\'s per-post constraints.',
    palette: { bg: '#0A1428', surface: '#0F1C36', surface2: '#152545', line: '#26396A', text: '#EAF0FF', text2: '#B4C2E6', text3: '#8799C6', accent: '#5B8CFF', onAccent: '#06112A', accent2: '#FFB547' },
    fonts: { display: 'IBM Plex Sans', body: 'IBM Plex Sans', mono: 'IBM Plex Mono', displayWeight: 600 },
    radius: 4,
    card: 'bracket',
    nav: 'index',
    pattern: 'grid',
    label: 'mono',
    surfaces: 'Navy with a faint 24px drafting grid.',
    cards: 'Thin cobalt outline, dimension-line char counters.',
    navigation: 'Indexed list (A1, A2…) with cobalt marker.',
    icons: 'Lucide 1.5 stroke, outlined; dimension arrows for limits.',
    motion: 'Lines draw in (stroke-dashoffset) when drafts generate.',
    distinctive: 'Turns constraints (char limits, formats) into the visual language.',
    concerns: 'Blue is the most common SaaS colour; grid texture can tire the eye over long sessions.'
  },
  {
    id: 'night',
    name: 'Night Edition',
    tagline: 'The late edition, set in brass',
    philosophy: 'Premium and quiet. Blue-black, brass accents, a classical serif for headlines. For agencies and brands who want their tool to feel considered.',
    refs: ['Jasper', 'Copy.ai', 'Buffer'],
    influence: 'Jasper\'s serif seriousness; Copy.ai\'s restraint; Buffer\'s warm tinted ink.',
    palette: { bg: '#0C0D10', surface: '#13151A', surface2: '#1B1E25', line: '#2C3039', text: '#F1ECE2', text2: '#BEB7A9', text3: '#908A7E', accent: '#CDAE72', onAccent: '#14110A', accent2: '#7FA3B8' },
    fonts: { display: 'Cormorant Garamond', body: 'Instrument Sans', mono: 'IBM Plex Mono', displayWeight: 600, displayItalic: false },
    radius: 12,
    card: 'hairline',
    nav: 'underline',
    pattern: 'none',
    label: 'serif',
    surfaces: 'Deep blue-black with subtle brass hairlines.',
    cards: 'Hairline, 12px radius, small-caps labels.',
    navigation: 'Serif labels, brass dot on active.',
    icons: 'Thin 1.25 stroke, brass for active only.',
    motion: 'Slow, graceful 250ms fades.',
    distinctive: 'Feels expensive; stands apart from playful creator tools.',
    concerns: 'Gold + serif can feel like a luxury brand, not a fast production tool. Cormorant is delicate at small sizes.'
  },
  {
    id: 'spectrum',
    name: 'Spectrum',
    tagline: 'Every platform, its own colour',
    philosophy: 'The fan is the brand: each platform gets a colour-blocked card and the UI stays neutral around it. Fanout\'s output literally becomes the palette.',
    refs: ['Buffer', 'Castmagic', 'Planable'],
    influence: 'Buffer lets platform logos supply colour; Castmagic\'s format chips; Planable\'s per-post previews.',
    palette: { bg: '#101113', surface: '#17181B', surface2: '#202125', line: '#2E2F34', text: '#F3F3F1', text2: '#B8B8B4', text3: '#8B8B87', accent: '#FF7A45', onAccent: '#101113', accent2: '#5EC8F2' },
    fonts: { display: 'Schibsted Grotesk', body: 'Schibsted Grotesk', mono: 'JetBrains Mono', displayWeight: 800 },
    radius: 20,
    card: 'filled',
    nav: 'pill',
    pattern: 'none',
    label: 'sans',
    surfaces: 'Neutral graphite; colour only enters through platform blocks.',
    cards: 'Large 20px radius; platform cards have a coloured top band.',
    navigation: 'Pill nav, coral active.',
    icons: 'Filled platform glyphs on coloured tiles.',
    motion: 'Cards fan from a single point on generate (the logo idea, animated).',
    distinctive: 'Ties the visual identity directly to the product\'s output.',
    concerns: 'Nine brand colours can turn chaotic; the coral CTA competes with Instagram/TikTok hues.'
  }
]

export const RECOMMENDED = 'proof'

export const PLATFORM_LIST = [
  { id: 'linkedin', label: 'LinkedIn post', color: '#0A66C2' },
  { id: 'instagram', label: 'Instagram caption', color: '#E1306C' },
  { id: 'tiktok', label: 'TikTok script', color: '#25F4EE' },
  { id: 'x', label: 'X post', color: '#FFFFFF' },
  { id: 'blog', label: 'Blog article', color: '#A78BFA' },
  { id: 'promo', label: 'Promotional copy', color: '#10B981' },
  { id: 'hashtags', label: 'Hashtag set', color: '#F59E0B' },
  { id: 'calendar', label: 'Content calendar', color: '#F97316' },
  { id: 'code', label: 'Code snippet', color: '#06B6D4' }
]
