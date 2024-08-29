import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundColor: {
        warning: '#f0ad4e',
        success: '#5cb85c',
        error: '#d9534f',
        info: '#5bc0de',
      },
      border: {
        grey: '#e8e8e8',
      },
      outline: {
        grey: '#e8e8e8',
      },
      divide: {
        grey: '#e8e8e8',
      },
    },
  },
  plugins: [],
};

export default config;
