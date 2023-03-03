const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
    content: ['./index.html', './src/**/*.js', './src/**/*.ts', './src/**/*.vue', './src/**/*.tsx', './src/**/*.jsx', './src/**/*.html'],
    theme: {
        extend: {
            width: {
                'w-[45.875rem]': '45.875rem'
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
