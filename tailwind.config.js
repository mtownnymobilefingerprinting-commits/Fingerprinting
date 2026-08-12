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
          50: "#fff5eb",
          100: "#ffe4cc",
          200: "#ffc29a",
          300: "#ff9a60",
          400: "#ff7728",
          500: "#ff5b00",
          600: "#e14f00",
          700: "#b34300",
          800: "#853100",
          900: "#5d2200"
        }
      }
    }
  },
  plugins: []
};
