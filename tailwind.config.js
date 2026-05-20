/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      },
      colors: {
        bg:        '#0c0e14',
        'bg-2':    '#12151e',
        'bg-3':    '#181c28',
        surface:   '#1e2333',
        'surface-2': '#252b3b',
        border:    '#2a3148',
        'border-2':'#374060',
        txt:       '#e8ecf5',
        'txt-2':   '#9aa3bf',
        'txt-3':   '#5c6480',
        accent:    '#f0c040',
        'accent-2':'#4fc3f7',
        emerald:   '#4caf82',
        crimson:   '#ef5350',
        violet:    '#9c7aff',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease both',
        'fade-in': 'fadeIn 0.3s ease both',
      },
    },
  },
  plugins: [],
};
