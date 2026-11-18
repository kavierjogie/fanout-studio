/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  // hover: styles only on devices that can hover, so taps don't leave cards stuck lifted
  future: { hoverOnlyWhenSupported: true },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Wayfinder: quiet graphite signage; colour only means "which platform"
      colors: {
        // Surfaces and text are CSS variables (src/index.css) so reading preferences can swap the comfort background
        ink: {
          950: 'rgb(var(--ink-950) / <alpha-value>)', // page
          900: 'rgb(var(--ink-900) / <alpha-value>)', // card
          800: 'rgb(var(--ink-800) / <alpha-value>)', // raised / hover
          700: 'rgb(var(--ink-700) / <alpha-value>)', // rule
          600: 'rgb(var(--ink-600) / <alpha-value>)' // strong rule
        },
        // Three text levels: primary, secondary, tertiary (all >= 4.5:1 on ink-950 and ink-900, on every surface)
        mist: {
          400: 'rgb(var(--mist-400) / <alpha-value>)',
          300: 'rgb(var(--mist-300) / <alpha-value>)',
          100: 'rgb(var(--mist-100) / <alpha-value>)'
        },
        // White is the one interactive accent (primary action, focus, current page). Amber (`ochre` token) only marks "scheduled".
        accent: {
          DEFAULT: '#F4F4F2',
          soft: '#FFFFFF', // accent text on tinted backgrounds
          ink: '#111214' // text on solid accent
        },
        ochre: '#FFC94A'
      },
      opacity: { 6: '0.06', 8: '0.08', 12: '0.12' },
      // Wayfinder corners: signage panels. Sets every rounded-lg/xl/2xl in one place
      borderRadius: { lg: '4px', xl: '6px', '2xl': '8px' },
      fontFamily: {
        display: ['"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
        body: ['Barlow', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace']
      },
      keyframes: {
        flow: {
          '0%': { strokeDashoffset: '240' },
          '100%': { strokeDashoffset: '0' }
        },
        pulseDot: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(0.9)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' }
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        // rise in reverse, so things leave along the path they arrived on
        sink: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(6px)' }
        }
      },
      animation: {
        'flow-fast': 'flow 1s linear infinite',
        pulseDot: 'pulseDot 2.2s ease-in-out infinite',
        rise: 'rise 0.35s ease-out both',
        sink: 'sink 0.2s ease-in both'
      }
    }
  },
  plugins: []
}
