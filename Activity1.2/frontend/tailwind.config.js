/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        darkbg: "#1e293b",
        lightbg: "#f8fafc"
      },
    },
  },
  plugins: [],
};
