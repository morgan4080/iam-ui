const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors')
module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.js', './src/**/*.ts', './src/**/*.vue', './src/**/*.tsx', './src/**/*.jsx', './src/**/*.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.coolGray,
        green: colors.green,
        blue: colors.sky,
        red: colors.rose,
        pink: colors.fuchsia,
        white: colors.white,
        indigo: colors.indigo,
        teal: colors.teal
      },
      width: {
        'w-[45.875rem]' : '45.875rem'
      },
      rotate: {
        '270': '270deg',
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  variants: {
    extend: {
      outline: ['focus'],
      ringColor: ['focus'],
      ringOffsetColor: ['focus'],
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio'), require('@tailwindcss/line-clamp')],
}
