/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2D5016",
        secondary: "#7CB342", 
        accent: "#FF6F00",
        surface: "#F5F5DC",
        background: "#FAFAF8",
        success: "#4CAF50",
        warning: "#FFA726",
        error: "#EF5350",
        info: "#29B6F6"
      },
      fontFamily: {
        display: ['DM Serif Display', 'serif'],
        body: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}