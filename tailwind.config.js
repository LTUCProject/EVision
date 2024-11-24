/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#003366", // Changed to a new color (example: blue)
        secondary: {
          100: "#F0F0F0", // Changed secondary light (example: light gray)
          200: "#606060", // Changed secondary dark (example: dark gray)
        },
        dark: "#121212", // Updated dark color (example: deep black)
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "3rem",
        },
      },
    },
  },
  plugins: [],
};
