// tailwind.config.ts
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
const { fontFamily } = defaultTheme
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        sp: { max: '639px' }, // スマホ（〜639px）
        tab: { min: '640px', max: '1023px' }, // タブレット
        pc: { min: '1024px' }, // PC以上
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      colors: {
        primary: '#dc2626',
        'primary-foreground': '#fff',
      },
    },
  },
  plugins: [],
}
export default config
