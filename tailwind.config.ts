import type { Config } from 'tailwindcss'
import fluid, { extract, screens, fontSize } from 'fluid-tailwind'

const flowbite = require('flowbite-react/tailwind')
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    flowbite.content(),
  ],
  extract,
  theme: {
    screens,
    fontSize,
    container: {
      center: true,
      // padding: {
      //   DEFAULT: '1rem',
      //   sm: '2rem',
      //   lg: '4rem',
      // },
      screens: {
        sm: '640px',
        md: '728px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      borderRadius: {
        '4xl': '2.5rem', // 这里的 2rem 只是示例，你可以改成任何需要的值
      },
      screens: {
        custom: '696px',
        // ...additional custom breakpoints
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [fluid, flowbite.plugin()],
}
export default config
