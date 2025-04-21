// tailwind.config.ts
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
const { fontFamily } = defaultTheme
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      colors: {
        primary: '#dc2626', // 🔴 赤で確認
        'primary-foreground': '#fff',
      },
    },
  },
  plugins: [],
}
export default config
