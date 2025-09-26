/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        "background-light": "#F7F9FC",
        "background-dark": "#0B1120",
        "surface-light": "#FFFFFF",
        "surface-dark": "#111827",
        "surface-dark-lighter": "#1E293B",
        "text-light": "#1F2937",
        "text-dark": "#F9FAFB",
        "subtle-light": "#6B7280",
        "subtle-dark": "#9CA3AF",
        "border-light": "#E5E7EB"
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        'lg': '1rem',
        'xl': '1.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
}