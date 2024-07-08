/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F0F4F8", // Light bluish background
        secondary: {
          DEFAULT: "#3498db", // Blue primary
          100: "#5fa8e3", // Lighter shade of blue
          200: "#2c82c9", // Darker shade of blue
        },
        black: {
          DEFAULT: "#000", // Black for text
          100: "#333", // Dark gray for slightly lighter text
          200: "#666", // Even lighter gray
        },
        gray: {
          100: "#ccc", // Light gray for borders and backgrounds
        },
      },
      fontFamily: {
        // Your existing font families remain the same
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};
