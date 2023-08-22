const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.js",
    "./src/**/*.ts",
    "./src/**/*.vue",
    "./src/**/*.tsx",
    "./src/**/*.jsx",
    "./src/**/*.html",
  ],
  theme: {
    extend: {
      width: {
        "w-[45.875rem]": "45.875rem",
      },
      rotate: {
        270: "270deg",
      },
      fontFamily: {
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: "#f2f5f8",
        surface: "#ffffff",
        primary: "#3C7AB7",
        secondary: "#334155",
        accent: "#705CF6",
        error: "#ef476f",
        info: "#2196F3",
        success: "#06d6a0",
        "on-success": "#ffffff",
        warning: "#ffd166",
      },
    },
  },
  variants: {
    extend: {
      outline: ["focus"],
      ringColor: ["focus"],
      ringOffsetColor: ["focus"],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
