/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0B0712',
          900: '#120B1E',
          800: '#1A1128',
          700: '#241733',
          600: '#332145'
        },
        mist: {
          500: '#857AA0',
          400: '#9C8FB5',
          300: '#B8AECB',
          200: '#D5CDE3',
          100: '#EFE9F7',
          50: '#F7F4FB'
        },
        signal: {
          purple: '#8B5CF6',
          purpleDeep: '#6D28D9',
          pink: '#EC4899',
          pinkDeep: '#BE185D',
          orange: '#F97316',
          orangeDeep: '#C2410C'
        }
      },
      opacity: { 6: '0.06', 8: '0.08', 12: '0.12' },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      backgroundImage: {
        'grad-ai': 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
        'grad-social': 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
        'grad-action': 'linear-gradient(135deg, #F97316 0%, #C2410C 100%)',
        'grad-hero': 'linear-gradient(120deg, #8B5CF6 0%, #EC4899 55%, #F97316 100%)',
        'grad-panel': 'radial-gradient(120% 120% at 0% 0%, rgba(139,92,246,0.16) 0%, rgba(18,11,30,0) 55%)'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 12px 40px -12px rgba(139,92,246,0.35)'
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
        }
      },
      animation: {
        'flow-fast': 'flow 1s linear infinite',
        pulseDot: 'pulseDot 2.2s ease-in-out infinite',
        rise: 'rise 0.35s ease-out both'
      }
    }
  },
  plugins: []
}
