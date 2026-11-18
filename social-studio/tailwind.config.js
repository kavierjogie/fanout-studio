/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  // hover: styles only on devices that can hover, so taps don't leave cards stuck lifted
  future: { hoverOnlyWhenSupported: true },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Proof Sheet: warm charcoal "paper", cream ink, one proofreader's vermilion
      colors: {
        ink: {
          950: '#14120F', // page
          900: '#1C1915', // card
          800: '#26221D', // raised / hover
          700: '#3A342C', // rule
          600: '#4A4339' // strong rule
        },
        // Three text levels: primary, secondary, tertiary (all >= 4.5:1 on ink-950 and ink-900)
        mist: {
          400: '#9C907F',
          300: '#C9BFAE',
          100: '#F3ECDF'
        },
        // Vermilion is the one interactive accent (next action, focus, live). Ochre only labels categories.
        accent: {
          DEFAULT: '#FF5A3C',
          soft: '#FF8F78', // accent-coloured text on tinted backgrounds
          ink: '#14120F' // text on solid accent
        },
        ochre: '#E9C46A'
      },
      opacity: { 6: '0.06', 8: '0.08', 12: '0.12' },
      // Proof Sheet corners: crisp, print-like. Tightens every rounded-lg/xl/2xl in one place
      borderRadius: { lg: '4px', xl: '6px', '2xl': '8px' },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        body: ['"Inter Tight"', 'system-ui', 'sans-serif'],
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
