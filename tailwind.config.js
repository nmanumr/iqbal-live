/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nastaliq: ['"Open Mehr_Nastaliq_Web"'],
      }
    },
  },
  plugins: [
		require('@tailwindcss/container-queries'),
  ],
}

