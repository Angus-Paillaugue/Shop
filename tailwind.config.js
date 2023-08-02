/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte}',
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}"
  ],
  theme: {
    extend: {
      fontFamily:{
        sans:["Poppins"]
      },
      colors: {
        primary: {
          '50': '#f5f2ed', 
          '100': '#ede8df', 
          '200': '#d1c6b2', 
          '300': '#b5a288', 
          '400': '#7d6147', 
          '500': '#452b1a', 
          '600': '#3d2415', 
          '700': '#331b0e', 
          '800': '#291309', 
          '900': '#1f0c05', 
          '950': '#140702'
        },
        "border":"#452b1a1a"
      },
      boxShadow: {
        "sm":"rgba(0, 0, 0, 0.12) 0px 0px 8px",
        "md":"rgba(0, 0, 0, 0.12) 0px 4px 10px",
        "lg":"rgba(0, 0, 0, 0.12) 0px 6px 16px",
        "xl":"rgba(0, 0, 0, 0.18) 0px 8px 20px",
      },
      borderRadius: {
        lg:"0.75rem"
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
  darkMode: 'class',
}