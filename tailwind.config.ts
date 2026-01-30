import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/tw-safelist.txt',
  ],
  theme: {
    extend: {},
  },
}

export default config
