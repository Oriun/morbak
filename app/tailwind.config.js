/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "indigo-dye": "#003D5B",
        "lapis-lazuli": "#30638E",
        "caribbean-current": "#00798C",
        "rusty-red": "#D3364B",
        "hunyadi-yellow": "#EDAE49",
      },
    },
  },
  plugins: [],
};