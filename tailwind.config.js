/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{jsx,js}"],
  options: {
    whitelist: ["bg-cyan-500", "bg-gray-300"], // Whitelist specific class names
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
