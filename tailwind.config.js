module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
    screens: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
