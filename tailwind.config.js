/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          "Noto Sans Thai",
          "system-ui",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "app-gradient":
          "linear-gradient(160deg, #6d28d9 0%, #7c3aed 22%, #4f46e5 48%, #2563eb 72%, #38bdf8 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
        "glass-lg": "0 12px 48px 0 rgba(20, 20, 60, 0.35)",
        fab: "0 10px 25px -3px rgba(37, 99, 235, 0.5), 0 0 0 1px rgba(255,255,255,0.4) inset",
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out",
        "slide-up": "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "pop-in": "popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "toast-in": "toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "check-pop": "checkPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.85) translateY(8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        toastIn: {
          "0%": { opacity: "0", transform: "translateY(-16px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        checkPop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
