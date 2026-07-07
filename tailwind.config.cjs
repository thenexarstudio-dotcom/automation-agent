/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Source Serif 4", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        ink: {
          950: "#0f1115",
          900: "#171a21",
          700: "#3a3f4b",
          500: "#636a78",
          300: "#a7acb8",
          100: "#e7e9ee",
          50: "#f6f7f9",
        },
        brass: {
          700: "#8a5a1f",
          600: "#a56b26",
          500: "#c17f2e",
          400: "#d99a4e",
          200: "#f0dcb8",
          100: "#f8ecd8",
        },
      },
      maxWidth: {
        prose: "68ch",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 17, 21, 0.06), 0 4px 16px rgba(15, 17, 21, 0.06)",
      },
    },
  },
  plugins: [],
};
