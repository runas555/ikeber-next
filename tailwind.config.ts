import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // For compatibility if pages dir is used
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        // Add custom colors from the HTML if needed, e.g.
        // 'brand-blue': '#3b82f6',
      }
    },
  },
  plugins: [
    // require('@tailwindcss/forms'), // Uncomment if you use form styling plugin
  ],
};
export default config;
