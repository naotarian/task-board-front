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
        primary: '#18181b', // zinc-900 相当
        'primary-foreground': '#fafafa', // zinc-50 相当
        secondary: '#3f3f46', // zinc-700
        'secondary-foreground': '#e4e4e7', // zinc-100
      },
    },
  },
  plugins: [],
}
export default config
