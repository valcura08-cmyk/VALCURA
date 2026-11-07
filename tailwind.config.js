/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          espresso: "#0F0A07",
          cacao: "#1A120C",
          "cacao-medium": "#261A12",
          "cacao-light": "#3A281D",
          amber: "#4E3321",
          gold: "#C5A880",
          "gold-light": "#DFCBB5",
          "gold-dark": "#9E7B4F",
          cream: "#FAF7F2",
          linen: "#F4EFEA",
          sand: "#E9E2D8",
          charcoal: "#2B2623",
          border: "rgba(197, 168, 128, 0.2)",
          "border-dark": "rgba(255, 255, 255, 0.12)",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Cinzel", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        display: ["var(--font-cinzel)", "Cinzel", "Cormorant Garamond", "serif"],
      },
      letterSpacing: {
        widest: ".25em",
        luxury: ".35em",
      },
      animation: {
        "fade-in": "fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.8 },
        },
      },
    },
  },
  plugins: [],
};
