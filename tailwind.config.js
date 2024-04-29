/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  darkMode: 'class',
  theme: {
    screens: {
      sm: {'max':'345px'},
      md: {'max':'767px'},
      'me':"576px",
      'mn':"767px",
      lg: "1024px",
      'ln': "1152px",
      'xl' : "1248px",
      '2xl' : "2000px",
    },
    extend: {
      backgroundImage:{
        yellow_gradient: "linear-gradient(to right top, #f1d971, #f3d366, #f5ce5a, #f8c74f, #fbc144, #fbba3b, #fcb433, #fcad2a, #faa522, #f79c19, #f5940f, #f28b03)",
      }
    },
  },
  plugins: [],
}