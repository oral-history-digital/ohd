/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/views/**/*.html.erb",
    "./app/views/**/*.html.slim", 
    "./app/helpers/**/*.rb",
    "./app/assets/stylesheets/**/*.css",
    "./app/javascript/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-red': '#e01217',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}