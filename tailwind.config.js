/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dsuBlue: '#002D62',
        dsuGold: '#FFC72C',
        dsuBlueDark: '#001a3d',
        dsuBlueLight: '#003d8a',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'scroll-bounce': 'scrollBounce 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 4px #FFC72C, 0 0 40px rgba(255,199,44,0.2)' },
          '50%': { boxShadow: '0 0 0 6px #FFC72C, 0 0 80px rgba(255,199,44,0.4)' },
        },
        scrollBounce: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '1' },
          '50%': { transform: 'translateY(8px)', opacity: '0.5' },
        },
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(ellipse at 60% 40%, #003d8a 0%, #002D62 40%, #000d1a 100%)',
      },
    },
  },
  plugins: [],
}
