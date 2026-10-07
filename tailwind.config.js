/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dream: {
          ivory: '#FDFBF7',
          warmIvory: '#FAF4EB',
          lavender: '#E8E3F5',
          dustyLavender: '#B3A9D9',
          deepLavender: '#5B4E87',
          peach: '#FCEBE1',
          powderBlue: '#E3EDF7',
          champagne: '#F5E6CA',
          gold: '#DFB86C',
          goldGlow: '#F7D78A',
          subtleRose: '#F9ECEF',
          roseAccent: '#E8A5B8',
          textDark: '#362E48',
          textMuted: '#7A6F96',
        }
      },
      fontFamily: {
        script: ['"Sacramento"', '"Dancing Script"', 'cursive'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-fast': 'float 3.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'teardrop': 'teardrop 1.8s ease-in-out infinite',
        'bunny-hop': 'bunnyHop 1.2s ease-in-out infinite',
        'flame': 'flame 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1.5deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(223, 184, 108, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(223, 184, 108, 0.8))' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(0.8) rotate(0deg)', opacity: '0.4' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
        },
        teardrop: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.8' },
          '70%': { transform: 'translateY(18px) scale(0.7)', opacity: '0.9' },
          '100%': { transform: 'translateY(24px) scale(0)', opacity: '0' },
        },
        flame: {
          '0%': { transform: 'scale(1) rotate(-2deg)', filter: 'brightness(1)' },
          '100%': { transform: 'scale(1.15) rotate(2deg)', filter: 'brightness(1.25)' },
        }
      }
    },
  },
  plugins: [],
}
