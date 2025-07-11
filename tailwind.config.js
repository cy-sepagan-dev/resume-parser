const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Rethink Sans"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}