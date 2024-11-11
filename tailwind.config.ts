import type { Config } from 'tailwindcss'
import fluid, { extract, screens, fontSize } from 'fluid-tailwind'
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  extract,
  theme: {
    screens,
    fontSize,
    container: {
      center: true,
      padding: '2rem',
      screens: {
        xs: '700px',
      },
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [fluid],
}
export default config
