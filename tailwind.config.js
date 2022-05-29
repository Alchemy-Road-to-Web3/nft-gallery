module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        darkgrey: "rgb(40, 50, 70, 0.85)",
        brand: "#00a6ff",
      },
    },
  },
  plugins: [],
  important: true,
};
