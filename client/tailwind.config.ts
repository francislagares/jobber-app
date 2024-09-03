import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        warning: '#f0ad4e',
        success: '#5cb85c',
        error: '#d9534f',
        info: '#5bc0de',
        grey: '#e8e8e8', // This will apply to borders, outlines, and divide as well if used consistently.
      },
      borderColor: {
        grey: '#e8e8e8',
      },
      outlineColor: {
        grey: '#e8e8e8',
      },
      divideColor: {
        grey: '#e8e8e8',
      },
    },
  },
  plugins: [],
};

export default config;
