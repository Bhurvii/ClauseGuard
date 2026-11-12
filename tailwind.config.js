/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#182039',
          hover: '#232E52',
          subtle: '#334155',
          muted: '#64748B',
        },
        canvas: '#F8FAFC',
        surface: '#FFFFFF',
        hairline: '#E2E8F0',
        risk: {
          high: {
            bg: '#FEF2F2',
            text: '#991B1B',
            accent: '#DC2626',
            border: '#FCA5A5',
          },
          caution: {
            bg: '#FFFBEB',
            text: '#92400E',
            accent: '#D97706',
            border: '#FCD34D',
          },
          safe: {
            bg: '#F0FDF4',
            text: '#166534',
            accent: '#16A34A',
            border: '#86EFAC',
          },
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        legal: ['"Source Serif 4"', '"Newsreader"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
