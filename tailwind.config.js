module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1ed",
          100: "#ffd7c9",
          200: "#ffb89c",
          300: "#ff9470",
          400: "#ff7350",
          500: "#ff572b",
          600: "#e14826",
          700: "#b33a20",
          800: "#852d1a",
          900: "#5f2214"
        }
      }
    }
  },
  plugins: []
};
