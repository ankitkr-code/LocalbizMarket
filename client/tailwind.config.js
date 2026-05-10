/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        leaf: "#157f5b",
        clay: "#b85c38",
        gold: "#d8a31a"
      }
    }
  },
  plugins: []
};
