/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"]
      },
      colors: {
        ink: {
          950: "#020617",
          900: "#07111f",
          800: "#0f172a",
          700: "#1e293b"
        },
        accent: {
          cyan: "#22d3ee",
          blue: "#38bdf8",
          royal: "#2563eb"
        }
      },
      boxShadow: {
        premium: "0 24px 80px rgba(2, 6, 23, 0.34)",
        soft: "0 16px 48px rgba(15, 23, 42, 0.22)"
      }
    }
  },
  plugins: []
};
