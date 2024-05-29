/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inika", "ui-sans-serif", "system-ui"],
        serif: ["Inika", "serif"],
      },
    },
  },
  plugins: [],
};
