// Design Preview Studio data, round 2 (fresh research, 18 Nov 2026). Dev-only: nothing in src/ imports this.
// "Observed" values come from each live homepage: computed styles read from the DOM, plus a headless-Chrome
// screenshot (above the fold only). Logged-in product UIs were not accessible and are not described.

export interface Research {
  name: string
  url: string
  img?: string
  style: string
  observed: string
  works: string
  a11y: string
  learn: string
  avoid: string
}

export const RESEARCH: Research[] = [
  {
    name: 'Typefully',
    url: 'https://typefully.com',
    img: 'typefully.jpg',
    style: 'Dark, product-first writing tool',
    observed: 'Page #111418, Inter throughout, H1 28px/700 white. Body copy 14.5px in #8B94A7. The real multi-column editor sits directly under the hero.',
    works: 'It shows the product, not a pitch. Drafts look like real posts, with an author row and actions.',
    a11y: 'Grey 14.5px secondary text is small for long reading. The hero is calm, with one action per row.',
    learn: 'Draft cards should look like the destination post. Show the real tool on the dashboard.',
    avoid: 'Inter + blue on near-black is the category default.'
  },
  {
    name: 'Taplio',
    url: 'https://taplio.com',
    img: 'taplio.jpg',
    style: 'Light SaaS, prompt-box hero',
    observed: 'White page, Lemfont display at 44px/700, Arial 14px body. Blue gradient on "viral LinkedIn post". A single prompt box with suggestion chips underneath ("Turn my newsletter into a post"…).',
    works: 'One input, then example prompts as chips. Starting is obvious.',
    a11y: 'Arial body is highly legible. Gradient text changes contrast along its length. 14px body is small.',
    learn: 'Suggested starting ideas under the topic field, written as plain sentences.',
    avoid: 'Gradient headline words; "viral" growth-hack tone.'
  },
  {
    name: 'Hypefury',
    url: 'https://hypefury.com',
    img: 'hypefury.jpg',
    style: 'Navy, bold geometric',
    observed: 'Page #070A1F, Sora 800 headline, Manrope 17px body at 1.6 line height. White CTA with blue text. A "Your queue" card lists posts by time slot (09:30, 13:15…).',
    works: 'The queue card explains scheduling at a glance: time on the left, post on the right.',
    a11y: 'Generous 1.6 line height. Lede in bright blue #6F86FF on navy reads well but is a second competing colour.',
    learn: 'A time-ordered "up next" list is a clearer dashboard element than charts.',
    avoid: 'Navy + electric blue: shared with half the category.'
  },
  {
    name: 'Predis.ai',
    url: 'https://predis.ai',
    img: 'predis.jpg',
    style: 'Light marketing, centred',
    observed: 'White page, Inter Tight 700, navy text #001F3C. Gradient on "AI Ad Generator". Violet primary button. Black promo bar on top.',
    works: 'Inter Tight is compact and clear at UI sizes.',
    a11y: 'Long centred subhead at 14px is harder to track line to line.',
    learn: 'Nothing new visually; confirms which look to avoid.',
    avoid: 'Violet CTA + gradient text: the "AI tool" cliché Fanout already left.'
  },
  {
    name: 'OpusClip',
    url: 'https://www.opus.pro',
    img: 'opusclip.jpg',
    style: 'Black, cinematic repurposing tool',
    observed: 'Pure #000, Geist 600. The headline swaps words in an animated pill ("10 viral clips" → "a polished interview"). Input and white "Get free clips" button sit in one bar.',
    works: 'Input + action as a single bar: one obvious first step. Closest competitor in "one source → many outputs".',
    a11y: 'Rotating headline words move while you read, which is a problem for slower readers. 14px/17px body line height is tight.',
    learn: 'Combine the topic field and Generate into one bar on mobile.',
    avoid: 'Text that changes on its own; pure black + glow.'
  },
  {
    name: 'Descript',
    url: 'https://www.descript.com',
    img: 'descript.jpg',
    style: 'Warm editorial, serif display',
    observed: 'Off-white nav (#FFF7FA), then a deep burgundy hero with a large serif headline ("brett" family) and a red button. Small mono-style eyebrow "AI VIDEO EDITOR".',
    works: 'A serif headline makes an AI video tool feel crafted and calm.',
    a11y: 'High-contrast headline. The tiny uppercase eyebrow is hard to read.',
    learn: 'A warm, saturated dark (not grey) can carry a whole brand.',
    avoid: 'Very similar to Fanout\'s current serif + red. Copying would not be a fresh direction.'
  },
  {
    name: 'Metricool',
    url: 'https://metricool.com',
    img: 'metricool.jpg',
    style: 'Light, plum + lime',
    observed: 'White page, plum text #2D1A29, Plus Jakarta Sans. Lime #E7FF56 text on a plum button. Product tabs (Analytics, Planning, Inbox) peek below the hero. Striped decorative shapes at the edges.',
    works: 'Lime on dark is unmistakable and very high contrast.',
    a11y: 'Labelled tabs with icons. The striped shapes add visual noise at the edges.',
    learn: 'An acid accent on a dark tinted base can be ownable if used sparingly.',
    avoid: 'The stripes; plum base.'
  },
  {
    name: 'beehiiv',
    url: 'https://www.beehiiv.com',
    img: 'beehiiv.jpg',
    style: 'Dark publishing platform',
    observed: 'Black/navy with a blue glow, ClashGrotesk 700 at 48px in UPPERCASE. White "Sign up for free" button. Product dashboard mock on the right.',
    works: 'Clearly positions itself as a publisher\'s tool.',
    a11y: 'All-caps headline over several lines is slower to read. Blue glow behind text.',
    learn: 'Publishing language (issues, editions) fits Fanout\'s calendar.',
    avoid: 'Uppercase display; glow.'
  },
  {
    name: 'Notion AI',
    url: 'https://www.notion.com/product/ai',
    img: 'notion.jpg',
    style: 'Light, illustrated, friendly',
    observed: 'White page, NotionInter 64px/700. Blue CTA #0075DE. Hand-drawn character illustrations. Feature tiles each pair an icon with a text label (Agents, Enterprise search, AI Meeting Notes…).',
    works: 'Every icon has a label. The illustration style gives personality without gradients.',
    a11y: 'Clear tile labels, strong hierarchy, calm layout.',
    learn: 'Always pair icons with words. Personality can come from drawing, not colour.',
    avoid: 'Their illustration style is very recognisable. Do not imitate it.'
  },
  {
    name: 'Later',
    url: 'https://later.com',
    img: 'later.jpg',
    style: 'Warm off-white, heavy display',
    observed: '"Super X sans Display" at weight 900, Inter Tight body. Black square buttons with cream #F8F2EA text, an orange primary CTA, photography.',
    works: 'Type alone carries the brand. Square buttons look decisive.',
    a11y: 'Warm off-white reduces glare. Weight-900 type is fine for short headings but not for paragraphs.',
    learn: 'Heavy display for page titles only.',
    avoid: 'Stock-style portrait photography.'
  }
]

export interface Ref {
  name: string
  url: string
  img?: string
  section: 'Aesthetic' | 'Colour' | 'Typography' | 'Layout' | 'Components' | 'Imagery' | 'Interaction' | 'Accessibility' | 'Reading'
  territory: string
  interesting: string
  adapt: string
  avoid: string
  a11y?: string
}

export const TERRITORIES = [
  {
    id: 'Reading room',
    blurb: 'Fanout users spend most of their time reading and editing drafts. Borrow from reading and writing apps: one column, calm surfaces, type tuned for long reading, controls that step back.',
    refs: ['iA Writer', 'Readwise Reader', 'Braille Institute', 'GOV.UK Design System'],
    a11y: 'Best fit for dyslexia-friendly defaults: predictable layout, low density, comfortable measure.'
  },
  {
    id: 'Cutting room',
    blurb: 'Video and audio editors turn one source into many cuts, which is exactly what Fanout does with an idea. Tracks, lanes, timecodes and a clear "source → outputs" structure.',
    refs: ['OpusClip', 'Descript', 'Raycast', 'Typefully'],
    a11y: 'Lanes give strong spatial grouping. Risk: dense, small labels and many parallel elements.'
  },
  {
    id: 'Newsstand',
    blurb: 'Magazines and newspapers: mastheads, sections, editions. Fanout publishes on a calendar, so "editions" and sections map naturally onto what it does.',
    refs: ['Monocle', 'beehiiv', 'Later', 'Are.na'],
    a11y: 'Strong hierarchy helps scanning. Risk: display faces, italics and justified columns can hurt readability.'
  }
]

export const REFS: Ref[] = [
  { name: 'Fanout today (Proof Sheet)', url: 'http://localhost:5173', img: 'fanout-current.jpg', section: 'Aesthetic', territory: '—', interesting: 'Live baseline: warm charcoal, cream text, vermilion accent, Instrument Serif titles, numbered index nav.', adapt: 'Keep the fan mark, platform glyph colours, numbered Create steps and undo toasts. They work.', avoid: 'Starting point only. Every new concept has to differ from it in a real way.', a11y: 'All text pairs pass AA. Weak spots: serif titles below 24px, mono uppercase labels at 11px.' },
  { name: 'iA Writer', url: 'https://ia.net/writer', img: 'iawriter.jpg', section: 'Reading', territory: 'Reading room', interesting: 'The page is the product: one centred column of text in a monospaced-proportional "Duo" face, with focus mode greying out other sentences.', adapt: 'A focus view for editing a single draft: the active paragraph at full contrast, everything else quieter.', avoid: 'Their Duospace typeface and white page.', a11y: 'Comfortable ~64ch measure and generous leading. Greyed text is low contrast, so make it optional.' },
  { name: 'Readwise Reader', url: 'https://readwise.io/read', img: 'readwise.jpg', section: 'Layout', territory: 'Reading room', interesting: 'Library list → reader pane → notebook. Each item has a title, source, reading time and tags on separate lines.', adapt: 'Recent content as a list with a one-line meta row (formats · scheduled · date), opening into a reader pane.', avoid: 'The purple-to-pink hero gradient.', a11y: 'Meta laid out in a predictable order helps scanning. Highlights use colour and an underline, not colour alone.' },
  { name: 'Braille Institute (Atkinson Hyperlegible)', url: 'https://www.brailleinstitute.org/freefont/', img: 'braille.jpg', section: 'Accessibility', territory: 'Reading room', interesting: 'A "Text Size & Contrast" control sits in the site header, visible on every page. The free Atkinson Hyperlegible family was designed to make similar letters distinct.', adapt: 'Put reading preferences one click from the header. Offer Atkinson Hyperlegible as an optional reading font.', avoid: 'Assuming one font solves dyslexia. Atkinson was designed for low vision; dyslexia evidence is not specific to it.', a11y: 'Clear l/I/1 and O/0 distinction; large, plain headings.' },
  { name: 'GOV.UK Design System', url: 'https://design-system.service.gov.uk', img: 'govuk.jpg', section: 'Accessibility', territory: 'Reading room', interesting: 'Plain-language headings, short paragraphs, chunky labelled buttons, and a thick yellow focus state, all backed by user research.', adapt: 'Form pattern for Create: one question per label, hint text under the label, errors that say how to fix them.', avoid: 'Government blue and the crown branding.', a11y: 'Strongest evidence base here: tested with disabled users, including people with dyslexia.' },
  { name: 'OpusClip', url: 'https://www.opus.pro', img: 'opusclip.jpg', section: 'Components', territory: 'Cutting room', interesting: 'Input and primary action fused into one bar; the first step is unmistakable.', adapt: 'Topic + "Generate" as one bar on mobile.', avoid: 'Auto-rotating headline words.', a11y: 'Text that animates on its own is a reading barrier. Never do this.' },
  { name: 'Descript', url: 'https://www.descript.com', img: 'descript.jpg', section: 'Colour', territory: 'Cutting room', interesting: 'A saturated warm dark (burgundy) instead of grey-black carries the brand by itself.', adapt: 'Tinted darks: one concept on terracotta-brown, one on bottle-green, one on olive.', avoid: 'Burgundy + red serif: too close to Fanout\'s current look and to Descript.', a11y: 'Large serif headline is readable; the tiny uppercase eyebrow is not.' },
  { name: 'Raycast', url: 'https://www.raycast.com', img: 'raycast.jpg', section: 'Interaction', territory: 'Cutting room', interesting: 'Keyboard-first dark tool. Near-black, one floating nav bar, very restrained colour.', adapt: 'Keyboard shortcuts shown next to actions (G for Generate, S for Schedule) for power users.', avoid: 'The hero subhead was still fading in when captured and read as very low contrast.', a11y: 'Fade-in body copy is unreadable for its first moments; content should appear at full contrast.' },
  { name: 'Typefully', url: 'https://typefully.com', img: 'typefully.jpg', section: 'Layout', territory: 'Cutting room', interesting: 'Multi-column editor directly under the hero: each column is a draft thread.', adapt: 'Generated drafts side by side as columns or lanes, one per platform.', avoid: 'Inter + blue on #111418.', a11y: '14.5px grey secondary text is a little small.' },
  { name: 'Hypefury', url: 'https://hypefury.com', img: 'hypefury.jpg', section: 'Components', territory: 'Cutting room', interesting: '"Your queue" card: time slot on the left, post text on the right.', adapt: 'Dashboard "Up next" list ordered by publish time.', avoid: 'Navy + electric blue.', a11y: '1.6 line height; time-first rows are easy to scan.' },
  { name: 'Monocle', url: 'https://monocle.com', img: 'monocle.jpg', section: 'Typography', territory: 'Newsstand', interesting: 'Newspaper masthead, a single-row section bar (Affairs | Business | Culture…), headlines in serif with short standfirsts.', adapt: 'A masthead-style page header with the date and an "edition" feel for the calendar.', avoid: 'The paper-white page, newspaper density, and their masthead lettering.', a11y: 'Clear sections, but small serif body text and dense columns.' },
  { name: 'beehiiv', url: 'https://www.beehiiv.com', img: 'beehiiv.jpg', section: 'Aesthetic', territory: 'Newsstand', interesting: 'Publisher positioning: newsletters, podcasts, one platform.', adapt: 'Publishing vocabulary in the UI: issue, edition, scheduled.', avoid: 'Uppercase display + glow.', a11y: 'Long uppercase headline reads slowly.' },
  { name: 'Later', url: 'https://later.com', img: 'later.jpg', section: 'Typography', territory: 'Newsstand', interesting: 'A weight-900 display face is the whole brand; square black buttons.', adapt: 'One concept with a heavy display face, used for titles only.', avoid: 'Heavy type in body text or controls; stock portraits.', a11y: 'Warm off-white reduces glare; heavy type is fine at large sizes only.' },
  { name: 'Are.na', url: 'https://www.are.na', img: 'are.jpg', section: 'Layout', territory: 'Newsstand', interesting: 'Black page, one narrow column, a lettered list (a. b.) as the only structure.', adapt: 'Lettered or numbered steps that say exactly where you are in Create.', avoid: 'Anti-design minimalism; Fanout has too many controls for it.', a11y: 'Short, plainly written sentences; very low cognitive load.' },
  { name: 'Metricool', url: 'https://metricool.com', img: 'metricool.jpg', section: 'Colour', territory: '—', interesting: 'Lime on a dark plum button: an accent you cannot miss.', adapt: 'One concept with an acid accent on a tinted dark, used only for the primary action.', avoid: 'Decorative stripes; plum base.', a11y: 'Very high contrast accent; decorative shapes at the edges add noise.' },
  { name: 'Notion AI', url: 'https://www.notion.com/product/ai', img: 'notion.jpg', section: 'Imagery', territory: '—', interesting: 'Personality comes from hand-drawn illustration; every icon has a text label.', adapt: 'Empty states with a simple drawn fan mark and a one-line plain instruction.', avoid: 'Imitating Notion\'s illustration style.', a11y: 'Icon + label pairs everywhere: no guessing.' },
  { name: 'Taplio', url: 'https://taplio.com', img: 'taplio.jpg', section: 'Components', territory: '—', interesting: 'Suggestion chips under the prompt box, written as full plain sentences.', adapt: 'Example topics under "What\'s your topic?" so nobody starts from a blank box.', avoid: 'Gradient text.', a11y: 'Examples reduce the blank-page problem, a real cognitive load win.' },
  { name: 'Predis.ai', url: 'https://predis.ai', img: 'predis.jpg', section: 'Colour', territory: '—', interesting: 'Violet button + gradient headline.', adapt: 'Nothing: kept as the look to avoid.', avoid: 'Violet / gradient "AI" styling.', a11y: 'Long centred text at 14px.' }
]

export const DESIGN_LANGUAGE = {
  words: ['Clear', 'Confident', 'Unhurried', 'Crafted', 'Generous'],
  typography: 'Body text is chosen for reading first: open, familiar letterforms with distinct l/I/1 and O/0, at least 15px for drafts with a 1.6+ line height. Display faces only for page titles. No long uppercase or italic runs.',
  colour: 'Dark theme kept (the app is dark-only). Tinted darks instead of neutral grey-black, one accent for the next action, platform colours only on platform glyphs and lanes. Body text 12–16:1, never pure white on pure black by default.',
  layout: 'Predictable left navigation, a single reading column for drafts (60–68ch), one primary action per screen, related controls grouped under plain-language step labels.',
  components: 'Labels on every icon button, examples under empty fields, errors that say how to fix the problem, undo after destructive actions.',
  imagery: 'Generated FLUX images shown inside draft previews. No stock art, no glow blobs. Empty states use the fan mark.',
  motion: 'Short (150–250ms) and purposeful: drafts fanning out from the idea. Nothing that moves while you read. Reduced motion respected and offered as a setting.',
  readability: 'Left-aligned, never justified. Short paragraphs. Clear gap between sections. Dates and counts in a consistent position and format.',
  personalisation: 'Reading font (Default / Arial / Verdana / Atkinson Hyperlegible), text size, line, letter and word spacing, reading width, paragraph spacing, comfort surface and reduced motion. All optional, all resettable.',
  avoid: 'Gradient text, violet/indigo "AI" styling, glow, auto-rotating text, fade-in body copy, uppercase paragraphs, decorative stripes behind content, icon-only buttons without labels.'
}

// Evidence used for the reading guidance. Kept separate so the studio can show what is a standard vs. a preference.
export const EVIDENCE = [
  { kind: 'Standard', text: 'WCAG 2.2 AA: 4.5:1 body text, 3:1 large text and UI components, 1.4.12 text spacing (1.5 line height, 0.12em letter, 0.16em word, 2em paragraph spacing must not break the layout), 2.4.11 focus not obscured, 2.2.2 pause/stop for moving content.', url: 'https://www.w3.org/TR/WCAG22/' },
  { kind: 'Guidance', text: 'W3C Cognitive Accessibility (COGA) "Making Content Usable": clear purpose for each page, plain language, familiar design patterns, help users avoid and fix mistakes.', url: 'https://www.w3.org/TR/coga-usable/' },
  { kind: 'Guidance', text: 'British Dyslexia Association Style Guide 2023: sans-serif body, larger sizes, left-aligned text, avoid underlining and italics for emphasis, avoid pure white backgrounds, plain language, expand abbreviations. (The PDF could not be opened in this session; points taken from the BDA page and cited secondary sources.)', url: 'https://www.bdadyslexia.org.uk/advice/educators/teaching-for-neurodiversity/creating-dyslexia-friendly-resources' },
  { kind: 'Research', text: 'Wery & Diliberto (2017, Annals of Dyslexia): OpenDyslexic gave no improvement in reading rate or accuracy versus Arial or Times New Roman, and no student preferred it. Specialist fonts are offered here only as personal choice.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5629233' },
  { kind: 'Research', text: 'Rello & Baeza-Yates (2013), "Good fonts for dyslexia": sans-serif, monospaced and roman (non-italic) fonts improved reading performance; italics reduced it. Small eye-tracking study, so treat as indicative.', url: 'https://dl.acm.org/doi/10.1145/2513383.2513447' },
  { kind: 'Preference', text: 'Background colour, font choice and spacing preferences vary person to person. Offer them as settings and validate with dyslexic users before making any one of them the default.', url: 'https://dyslexiaida.org/' }
]

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

// Dyslexia-friendly / cognitive review per concept. Ratings are a design-review judgement, not user-tested.
export type Rating = 'good' | 'ok' | 'watch'
export interface Assessment {
  typography: string
  density: string
  navigation: string
  cognitive: string
  personalisation: string
  limits: string
  ratings: { legibility: Rating; distinction: Rating; density: Rating; navigation: Rating; motion: Rating; comfort: Rating }
}

export interface Concept {
  id: string
  name: string
  tagline: string
  territory: string
  philosophy: string
  refs: string[]
  influence: string
  palette: Palette
  fonts: { display: string; body: string; mono: string; displayWeight: number; displayCase?: 'upper' | 'none' }
  radius: number
  card: 'hairline' | 'filled' | 'offset' | 'bracket' | 'block' | 'keycap' | 'lane'
  nav: 'index' | 'pill' | 'keycap' | 'underline' | 'bar' | 'line'
  pattern: 'none' | 'grid' | 'grain' | 'dots' | 'scan'
  label: 'mono' | 'sans' | 'serif'
  surfaces: string
  cards: string
  navigation: string
  icons: string
  motion: string
  distinctive: string
  concerns: string
  assess: Assessment
}

export const BASELINE: Concept = {
  id: 'proof',
  name: 'Proof Sheet (previous)',
  tagline: 'What Fanout looked like before Wayfinder',
  territory: 'Baseline',
  philosophy: 'The current production identity: an editor\'s desk at night. Warm charcoal, cream ink, a proofreader\'s vermilion for the next action.',
  refs: ['Jasper', 'Are.na', 'Later'],
  influence: 'From the first design round.',
  palette: { bg: '#14120F', surface: '#1C1915', surface2: '#26221D', line: '#3A342C', text: '#F3ECDF', text2: '#C9BFAE', text3: '#9C907F', accent: '#FF5A3C', onAccent: '#14120F', accent2: '#E9C46A' },
  fonts: { display: 'Instrument Serif', body: 'Inter Tight', mono: 'IBM Plex Mono', displayWeight: 400 },
  radius: 4,
  card: 'hairline',
  nav: 'index',
  pattern: 'grain',
  label: 'mono',
  surfaces: 'Flat warm charcoal with a faint 3px dot grain; hairline rules.',
  cards: 'Hairline border, 4px radius, mono caption row.',
  navigation: 'Numbered index with a vermilion rule beside the active item.',
  icons: 'Lucide 1.5 stroke; platform glyphs in brand colour.',
  motion: 'Fade up 4–6px; drafts deal out.',
  distinctive: 'Editorial serif on warm dark; ownable vermilion.',
  concerns: 'Instrument Serif is weak below 24px; red primary can read as "danger".',
  assess: {
    typography: 'Inter Tight body is clear but slightly condensed, so letters sit close together at 13–14px. Serif titles are fine at 34px+.',
    density: 'Moderate. Dashboard has hero + diagram + four stats + list: a lot to take in at once.',
    navigation: 'Numbered index is predictable. Numbers without icons rely on reading every label.',
    cognitive: 'One accent with one meaning helps. Uppercase mono labels at 11px are tiring.',
    personalisation: 'None today.',
    limits: 'Background grain sits behind text. Red primary vs. red error states.',
    ratings: { legibility: 'ok', distinction: 'ok', density: 'ok', navigation: 'good', motion: 'good', comfort: 'ok' }
  }
}

export const CONCEPTS: Concept[] = [
  {
    id: 'lamplight',
    name: 'Lamplight',
    tagline: 'A reading room for your drafts',
    territory: 'Reading room',
    philosophy: 'Fanout is mostly reading and editing. Lamplight treats it like a calm reading app: a cool slate room, one warm lamp of green for "go", type tuned for long reading. Accessibility is the identity, not a mode.',
    refs: ['iA Writer', 'Readwise Reader', 'Braille Institute', 'GOV.UK Design System'],
    influence: 'iA Writer\'s single column and focus; Readwise\'s predictable meta rows; Atkinson Hyperlegible from Braille Institute for every text role; GOV.UK\'s chunky labelled buttons and hint text.',
    palette: { bg: '#15191E', surface: '#1C2128', surface2: '#252B33', line: '#36404B', text: '#EEF1F4', text2: '#C3CAD3', text3: '#98A2AE', accent: '#7BD389', onAccent: '#10261A', accent2: '#F2C46D' },
    fonts: { display: 'Atkinson Hyperlegible', body: 'Atkinson Hyperlegible', mono: 'IBM Plex Mono', displayWeight: 700 },
    radius: 8,
    card: 'filled',
    nav: 'bar',
    pattern: 'none',
    label: 'sans',
    surfaces: 'Flat cool slate, no texture. Cards are one step lighter; no borders needed.',
    cards: 'Filled 8px panels with 20px padding. Drafts in a 64ch column at 16/1.7.',
    navigation: 'Icon + label rows; the active item is a solid green bar with dark text. Impossible to miss.',
    icons: 'Lucide 2px stroke, always next to a word.',
    motion: 'Almost none: 150ms colour fades. Drafts appear in place, no movement.',
    distinctive: 'No social tool leads with legibility as its look. Atkinson for headings gives a plain, honest voice, and green-on-slate is outside every competitor palette observed.',
    concerns: 'Can feel plain or "utility". Atkinson at display sizes lacks drama. Green primary may read as "success" (keep success states icon + text).',
    assess: {
      typography: 'Atkinson Hyperlegible everywhere, 15–16px body, 1.7 line height for drafts. Clear l/I/1 and O/0 shapes. No uppercase labels.',
      density: 'Low. Dashboard shows "Up next" and recent work, stats move lower down.',
      navigation: 'Icon + label + solid active bar. Same position on every screen.',
      cognitive: 'One action colour; plain sentence labels; examples under empty fields.',
      personalisation: 'Default already close to "comfortable"; panel adds width, spacing and font choice.',
      limits: 'High text contrast (15.6:1) may glare for some, so offer a dim surface. Atkinson is a low-vision design; dyslexia benefit not proven.',
      ratings: { legibility: 'good', distinction: 'good', density: 'good', navigation: 'good', motion: 'good', comfort: 'good' }
    }
  },
  {
    id: 'multitrack',
    name: 'Multitrack',
    tagline: 'One take, every cut',
    territory: 'Cutting room',
    philosophy: 'A video editor\'s timeline for text. Your idea is the source clip; each platform is a track. Carbon surfaces, a teal playhead colour for the next action, Geist for a precise, modern voice.',
    refs: ['OpusClip', 'Descript', 'Typefully', 'Raycast'],
    influence: 'OpusClip\'s "one source → many outputs" framing and fused input bar; Descript\'s editing-room calm; Typefully\'s side-by-side draft columns; Raycast\'s restraint and shortcuts.',
    palette: { bg: '#0D0E10', surface: '#15171A', surface2: '#1E2125', line: '#2C3036', text: '#F1F3F5', text2: '#B9BFC7', text3: '#8D949D', accent: '#2FD4BF', onAccent: '#04201C', accent2: '#FFB547' },
    fonts: { display: 'Geist', body: 'Geist', mono: 'Geist Mono', displayWeight: 600 },
    radius: 6,
    card: 'lane',
    nav: 'underline',
    pattern: 'grid',
    label: 'mono',
    surfaces: 'Carbon with a faint 24px timeline grid on the page only, never behind text in cards.',
    cards: 'Each card has a coloured left edge (accent, or the platform colour for drafts), like a clip on a track.',
    navigation: 'Text + icon rows with a teal underline tick on the active item.',
    icons: 'Lucide 1.75 stroke; platform glyphs sit in a track header.',
    motion: 'Drafts slide in along their lane, 60ms apart; a playhead sweeps once on generate.',
    distinctive: 'Speaks the language of repurposing tools (clips, tracks) that social schedulers don\'t use. The lane metaphor makes "one idea → many formats" visible.',
    concerns: 'Grid texture and lanes add visual structure that can feel busy. Mono labels in uppercase. Teal near TikTok\'s cyan.',
    assess: {
      typography: 'Geist is clear with open apertures; 14–15px body. Mono labels are uppercase, so use sentence case in production.',
      density: 'Medium-high. Lanes invite many parallel items.',
      navigation: 'Predictable; the active underline is small. Pair it with a background tint.',
      cognitive: 'Strong spatial grouping (one lane = one platform) helps; grid ground adds noise.',
      personalisation: 'Reading width and spacing help a lot here; turn the grid off under "clearer separation".',
      limits: 'Page grid behind content; small uppercase mono.',
      ratings: { legibility: 'good', distinction: 'ok', density: 'watch', navigation: 'ok', motion: 'ok', comfort: 'ok' }
    }
  },
  {
    id: 'newsstand',
    name: 'Newsstand',
    tagline: 'Every idea is an edition',
    territory: 'Newsstand',
    philosophy: 'A magazine masthead for your content. Ink-navy pages, a pink proof-mark accent, DM Serif Display titles with a sturdy Instrument Sans body. Calendar days are "editions".',
    refs: ['Monocle', 'beehiiv', 'Later'],
    influence: 'Monocle\'s masthead and section bar; beehiiv\'s publishing vocabulary; Later\'s confidence that type can be the brand.',
    palette: { bg: '#10131A', surface: '#171B24', surface2: '#20252F', line: '#323947', text: '#F4F1EC', text2: '#C8C3BA', text3: '#9C9890', accent: '#FF8FB1', onAccent: '#2A0A15', accent2: '#8FD3FF' },
    fonts: { display: 'DM Serif Display', body: 'Instrument Sans', mono: 'DM Mono', displayWeight: 400 },
    radius: 2,
    card: 'block',
    nav: 'index',
    pattern: 'none',
    label: 'sans',
    surfaces: 'Deep ink navy, flat. Sections separated by a 2px top rule, like newspaper columns.',
    cards: 'No box: a heavy top rule, then headline and standfirst.',
    navigation: 'Numbered sections (01 Dashboard…) with the active number in pink.',
    icons: 'Few icons; words do the work. Platform glyphs only.',
    motion: 'Page turns: 200ms fade. Nothing else.',
    distinctive: 'Pink on navy is unclaimed in the category. Editorial structure suits a publishing calendar.',
    concerns: 'Serif titles similar in spirit to today\'s Proof Sheet. Pink can read as playful rather than professional.',
    assess: {
      typography: 'Instrument Sans body is open and clear. DM Serif Display only at 30px+.',
      density: 'Medium; rules and headlines create clear chunks.',
      navigation: 'Numbered index is predictable but icon-free.',
      cognitive: 'Strong hierarchy; headline + standfirst pattern explains each item.',
      personalisation: 'Narrow width suits it; serif titles unaffected by font override.',
      limits: 'Serif display; card edges only on top.',
      ratings: { legibility: 'good', distinction: 'ok', density: 'ok', navigation: 'ok', motion: 'good', comfort: 'good' }
    }
  },
  {
    id: 'clay',
    name: 'Clay Studio',
    tagline: 'Handmade, warm, unhurried',
    territory: 'Calm creator studio',
    philosophy: 'A ceramics studio at dusk: terracotta-brown surfaces, a cool sky-blue glaze for action, rounded friendly shapes. For solo creators who want the tool to feel human.',
    refs: ['Descript', 'Notion AI', 'Taplio'],
    influence: 'Descript\'s saturated warm dark; Notion\'s personality without gradients; Taplio\'s example chips under the input.',
    palette: { bg: '#1C1411', surface: '#251B17', surface2: '#30241F', line: '#4A3830', text: '#F5EBE4', text2: '#D4C3B8', text3: '#A8968B', accent: '#8EC5FF', onAccent: '#0B2038', accent2: '#E9A27C' },
    fonts: { display: 'Bricolage Grotesque', body: 'DM Sans', mono: 'DM Mono', displayWeight: 700 },
    radius: 16,
    card: 'filled',
    nav: 'pill',
    pattern: 'none',
    label: 'sans',
    surfaces: 'Warm clay brown, flat; cards one tone lighter.',
    cards: '16px radius, soft filled panels, pill chips.',
    navigation: 'Pill nav; active item tinted blue.',
    icons: 'Lucide 2px, rounded caps.',
    motion: 'Gentle 220ms scale-in for new drafts.',
    distinctive: 'Brown-and-blue is unusual and warm. Feels crafted rather than corporate.',
    concerns: 'Brown dark can look muddy on poor screens. Rounded friendliness may undersell professional use.',
    assess: {
      typography: 'DM Sans is round and open; good spacing. Bricolage display has quirky shapes: titles only.',
      density: 'Low-medium.',
      navigation: 'Pill nav, active tint plus icon colour.',
      cognitive: 'Soft shapes reduce visual tension; warm background reduces glare.',
      personalisation: 'Works well with all settings.',
      limits: 'Blue accent sits close to LinkedIn\'s glyph colour.',
      ratings: { legibility: 'good', distinction: 'ok', density: 'good', navigation: 'good', motion: 'ok', comfort: 'good' }
    }
  },
  {
    id: 'cuecard',
    name: 'Cue Card',
    tagline: 'Big words, one thing at a time',
    territory: 'Reading room',
    philosophy: 'A teleprompter and stack of cue cards. Very large type, one question per screen section, highlighter yellow for the thing you\'re doing now. Built for speed-reading your own drafts and recording TikTok scripts.',
    refs: ['GOV.UK Design System', 'Are.na', 'Braille Institute'],
    influence: 'GOV.UK\'s one-question-per-step forms and yellow focus; Are.na\'s minimal structure; Braille Institute\'s big plain headings.',
    palette: { bg: '#000000', surface: '#111111', surface2: '#1C1C1C', line: '#3A3A3A', text: '#F5F5F0', text2: '#D6D6D6', text3: '#ABABAB', accent: '#FFE14D', onAccent: '#000000', accent2: '#7FE7FF' },
    fonts: { display: 'Atkinson Hyperlegible', body: 'Atkinson Hyperlegible', mono: 'IBM Plex Mono', displayWeight: 700 },
    radius: 10,
    card: 'hairline',
    nav: 'bar',
    pattern: 'none',
    label: 'sans',
    surfaces: 'True black, flat. Maximum contrast.',
    cards: 'Hairline cards, large padding, 17px body.',
    navigation: 'Solid yellow active bar.',
    icons: 'Large 18px icons, always labelled.',
    motion: 'None beyond focus and colour changes.',
    distinctive: 'Radically simple; nothing in the category is this direct.',
    concerns: 'Pure black + near-white can cause halation (text "glowing") for some readers. Yellow on black feels like a warning sign. Big type means more scrolling.',
    assess: {
      typography: 'Atkinson at 17px, 1.7 line height. Very clear.',
      density: 'Very low, perhaps too low for the calendar and recent screens.',
      navigation: 'Very predictable.',
      cognitive: 'Lowest load of all concepts.',
      personalisation: 'Needs the dim comfort surface as an option.',
      limits: '19:1 contrast can be uncomfortable; more scrolling.',
      ratings: { legibility: 'good', distinction: 'good', density: 'good', navigation: 'good', motion: 'good', comfort: 'watch' }
    }
  },
  {
    id: 'fieldguide',
    name: 'Field Guide',
    tagline: 'Notes from the field',
    territory: 'Newsstand',
    philosophy: 'A naturalist\'s field notebook: olive-khaki pages, safety-orange markings, specimen-style labelled cards. Every draft is a specimen: tagged, numbered, dated.',
    refs: ['Are.na', 'Readwise Reader', 'Monocle'],
    influence: 'Are.na\'s lettered lists; Readwise\'s tags and meta rows; Monocle\'s section labels.',
    palette: { bg: '#161A12', surface: '#1D2218', surface2: '#262C20', line: '#3B4332', text: '#EEF0E4', text2: '#C6CAB6', text3: '#9CA18C', accent: '#FF9A3C', onAccent: '#241100', accent2: '#B9D27A' },
    fonts: { display: 'IBM Plex Sans', body: 'IBM Plex Sans', mono: 'IBM Plex Mono', displayWeight: 600 },
    radius: 3,
    card: 'bracket',
    nav: 'index',
    pattern: 'grain',
    label: 'mono',
    surfaces: 'Olive with a faint paper grain.',
    cards: 'Corner brackets in orange, like a specimen frame.',
    navigation: 'Numbered index.',
    icons: 'Lucide 1.5, plus small specimen tags.',
    motion: 'Minimal.',
    distinctive: 'Earthy olive + orange is unlike any tech palette; very ownable.',
    concerns: 'Olive can feel military. Corner brackets are decorative. Grain behind text.',
    assess: {
      typography: 'Plex Sans is clear with distinct letterforms.',
      density: 'Medium; tags add detail.',
      navigation: 'Numbers without icons.',
      cognitive: 'Consistent tag/meta layout helps; brackets add decoration.',
      personalisation: 'Turn off grain with "clearer separation".',
      limits: 'Grain; uppercase mono tags.',
      ratings: { legibility: 'good', distinction: 'good', density: 'ok', navigation: 'ok', motion: 'good', comfort: 'ok' }
    }
  },
  {
    id: 'wayfinder',
    name: 'Wayfinder',
    tagline: 'One station, every line',
    territory: 'Original: transit wayfinding',
    philosophy: 'Fanout as a transit map. Your idea is the station; each platform is a coloured line leaving it. The UI itself is quiet graphite and white like good signage. Colour only appears where it means something: which platform a draft is for.',
    refs: ['GOV.UK Design System', 'Hypefury', 'Typefully', 'Raycast'],
    influence: 'GOV.UK\'s plain, tested signage-like clarity; Hypefury\'s time-ordered queue; Typefully\'s draft columns; Raycast\'s restraint. The transit-map idea is original to Fanout\'s fan mark.',
    palette: { bg: '#111214', surface: '#18191C', surface2: '#222327', line: '#34363B', text: '#F4F4F2', text2: '#C2C3C0', text3: '#95979A', accent: '#F4F4F2', onAccent: '#111214', accent2: '#FFC94A' },
    fonts: { display: 'Barlow Condensed', body: 'Barlow', mono: 'IBM Plex Mono', displayWeight: 600 },
    radius: 6,
    card: 'lane',
    nav: 'line',
    pattern: 'none',
    label: 'sans',
    surfaces: 'Neutral graphite, flat. No texture anywhere.',
    cards: 'A coloured line on the left edge: the platform colour for drafts, white for general cards.',
    navigation: 'A vertical line with station dots; the current page is a filled white station.',
    icons: 'Lucide 2px; platform glyphs in brand colour.',
    motion: 'Lines draw from the station to each platform on generate (once, 300ms).',
    distinctive: 'Turns the product idea into the navigation and layout. Monochrome UI with semantic colour is unlike any competitor.',
    concerns: 'White primary button is less "branded". Condensed display must stay at title sizes. Platform colours carry meaning, so they also need labels.',
    assess: {
      typography: 'Barlow body is a clear grotesque. Barlow Condensed for titles only; never for paragraphs.',
      density: 'Medium; colour lines give structure without boxes.',
      navigation: 'Station line shows where you are and what\'s next.',
      cognitive: 'Colour always means "platform", nothing else. Easy to learn.',
      personalisation: 'Works with all settings.',
      limits: 'LinkedIn line colour only 3.1:1. OK for a line, not text.',
      ratings: { legibility: 'good', distinction: 'ok', density: 'good', navigation: 'good', motion: 'good', comfort: 'good' }
    }
  },
  {
    id: 'hottake',
    name: 'Hot Take',
    tagline: 'Loud ideas, made fast',
    territory: 'Bold & experimental',
    philosophy: 'For creators who live on X and TikTok. Heavy Syne headlines, acid lime action, offset shadow cards that look like stickers. Energetic and opinionated.',
    refs: ['Metricool', 'Later', 'beehiiv'],
    influence: 'Metricool\'s lime-on-dark; Later\'s weight-900 headings; beehiiv\'s confident publisher stance.',
    palette: { bg: '#121410', surface: '#1A1D17', surface2: '#23271F', line: '#363B30', text: '#F3F5EE', text2: '#C5CABB', text3: '#999F8F', accent: '#C8F560', onAccent: '#162000', accent2: '#FF7AC6' },
    fonts: { display: 'Syne', body: 'Manrope', mono: 'Space Mono', displayWeight: 800 },
    radius: 4,
    card: 'offset',
    nav: 'bar',
    pattern: 'none',
    label: 'mono',
    surfaces: 'Flat dark moss.',
    cards: 'Offset pink shadow on hover and on active drafts.',
    navigation: 'Solid lime bar.',
    icons: 'Thick 2.25 stroke.',
    motion: 'Snappy 120ms bounce on generate.',
    distinctive: 'The loudest option; impossible to mistake for another tool.',
    concerns: 'Syne is wide and quirky: unreadable in paragraphs. Pink shadows + lime can overwhelm. Brand may age quickly.',
    assess: {
      typography: 'Manrope body is clear; Syne titles are wide and unusual.',
      density: 'Medium, but visually loud.',
      navigation: 'Clear active bar.',
      cognitive: 'Two strong accents compete for attention.',
      personalisation: 'Reduced motion important.',
      limits: 'Visual intensity; quirky display.',
      ratings: { legibility: 'ok', distinction: 'ok', density: 'ok', navigation: 'good', motion: 'watch', comfort: 'watch' }
    }
  },
  {
    id: 'brass',
    name: 'Brass Room',
    tagline: 'Quiet luxury for brands',
    territory: 'Premium',
    philosophy: 'An agency studio after hours: near-black, brass fittings, a refined serif for titles. For marketing teams and brands who want calm authority.',
    refs: ['Monocle', 'Descript', 'Raycast'],
    influence: 'Monocle\'s editorial refinement; Descript\'s serif headlines; Raycast\'s dark restraint.',
    palette: { bg: '#0E0D0B', surface: '#161512', surface2: '#1F1D19', line: '#33302A', text: '#F2EEE6', text2: '#C9C3B7', text3: '#9D978B', accent: '#D4AF5F', onAccent: '#1A1406', accent2: '#9FB7C9' },
    fonts: { display: 'Cormorant Garamond', body: 'Instrument Sans', mono: 'DM Mono', displayWeight: 600 },
    radius: 2,
    card: 'hairline',
    nav: 'underline',
    pattern: 'none',
    label: 'serif',
    surfaces: 'Near-black, flat, hairline brass-tinted rules.',
    cards: 'Hairline, square corners.',
    navigation: 'Underline tick.',
    icons: 'Thin 1.25 stroke.',
    motion: 'Slow 260ms fades.',
    distinctive: 'Feels expensive and unhurried.',
    concerns: 'Cormorant is delicate and hard to read below 28px. Italic serif labels hurt readability. Can feel like a luxury brand rather than a production tool.',
    assess: {
      typography: 'Instrument Sans body is fine; italic serif labels and thin display are weak.',
      density: 'Low.',
      navigation: 'Underline active marker is subtle.',
      cognitive: 'Calm, but thin strokes and italics add effort.',
      personalisation: 'Font override helps labels only partly.',
      limits: 'Italic labels; thin display; subtle active state.',
      ratings: { legibility: 'watch', distinction: 'watch', density: 'good', navigation: 'watch', motion: 'good', comfort: 'ok' }
    }
  },
  {
    id: 'teletext',
    name: 'Teletext',
    tagline: 'Page 100: your content',
    territory: 'Retro-inspired',
    philosophy: 'The 1980s TV information service: black screen, cyan and yellow, blocky mono titles, page numbers. Nostalgic and nerdy, with a clear structure.',
    refs: ['Are.na', 'Raycast'],
    influence: 'Are.na\'s raw directness; Raycast\'s keyboard-first feel.',
    palette: { bg: '#050505', surface: '#0F0F12', surface2: '#18181D', line: '#2E2E36', text: '#F2F2F2', text2: '#CFCFD4', text3: '#A3A3AB', accent: '#44E6FF', onAccent: '#00222A', accent2: '#FFE44D' },
    fonts: { display: 'Space Mono', body: 'IBM Plex Sans', mono: 'Space Mono', displayWeight: 700, displayCase: 'upper' },
    radius: 0,
    card: 'block',
    nav: 'keycap',
    pattern: 'scan',
    label: 'mono',
    surfaces: 'Black with a faint cyan glow from the top.',
    cards: 'Square blocks with a heavy top rule.',
    navigation: 'Keycap-style numbered keys.',
    icons: 'Pixel-ish, 2px.',
    motion: 'Instant cuts, a blinking cursor while generating.',
    distinctive: 'Pure nostalgia; nobody else is here.',
    concerns: 'Uppercase mono titles are slow to read. Blinking cursor is motion. Retro may feel like a joke.',
    assess: {
      typography: 'Plex Sans body is fine; uppercase mono headings are hard.',
      density: 'Medium.',
      navigation: 'Keycaps are clear.',
      cognitive: 'Uppercase and mono add effort.',
      personalisation: 'Reduced motion must stop the cursor.',
      limits: 'Uppercase titles, scan glow, blinking.',
      ratings: { legibility: 'ok', distinction: 'ok', density: 'ok', navigation: 'good', motion: 'watch', comfort: 'ok' }
    }
  }
]

export const RECOMMENDED = 'wayfinder' // approved and implemented in production 2026-11-18
export const RUNNER_UP = 'lamplight'

export const PLATFORM_LIST = [
  { id: 'linkedin', label: 'LinkedIn post', color: '#0A66C2' },
  { id: 'instagram', label: 'Instagram caption', color: '#E1306C' },
  { id: 'tiktok', label: 'TikTok script', color: '#25F4EE' },
  { id: 'x', label: 'X post', color: '#FFFFFF' },
  { id: 'blog', label: 'Blog article', color: '#C9BFAE' },
  { id: 'promo', label: 'Promotional copy', color: '#10B981' },
  { id: 'hashtags', label: 'Hashtag set', color: '#F59E0B' },
  { id: 'calendar', label: 'Content calendar', color: '#F97316' },
  { id: 'code', label: 'Code snippet', color: '#06B6D4' }
]
