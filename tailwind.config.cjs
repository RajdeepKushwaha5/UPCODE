/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Design system tokens (CSS variable backed) */
        "bg-primary":       "var(--bg-primary)",
        "bg-secondary":     "var(--bg-secondary)",
        "bg-tertiary":      "var(--bg-tertiary)",
        "surface-base":     "var(--surface-base)",
        "surface-raised":   "var(--surface-raised)",
        "surface-overlay":  "var(--surface-overlay)",
        "surface-sunken":   "var(--surface-sunken)",
        "text-primary":     "var(--text-primary)",
        "text-secondary":   "var(--text-secondary)",
        "text-tertiary":    "var(--text-tertiary)",
        "border-primary":   "var(--border-primary)",
        "border-secondary": "var(--border-secondary)",
        "accent":           "var(--accent)",
        "accent-hover":     "var(--accent-hover)",
        "accent-light":     "var(--accent-light)",
        "accent-subtle":    "var(--accent-subtle)",
        "accent-dark":      "var(--accent-dark)",
        "success":          "var(--success)",
        "warning":          "var(--warning)",
        "error":            "var(--error)",
        "info":             "var(--info)",
        /* Legacy / Extras */
        "purple-400": "#6333FF",
        "purple-500": "#430AFF",
        "purple-600": "#3400E0",
        "dark-1": "#0c0c14",
        "dark-2": "#12121c",
        "dark-3": "#1a1a28",
        "dark-4": "#222236",
        "gray-1": "#6b7a96",
        "gray-2": "#a5b4cf",
        "light-1": "#f8fafc",
        "light-2": "#f1f5f9",
        "light-3": "#e2e8f0",
        "light-4": "#cbd5e1",
      },
      screens: {
        xs: "480px",
      },
      width: {
        420: "420px",
        465: "465px",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        inter: ["Inter", "sans-serif"],
        space: ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        "sm": "6px",
        "md": "10px",
        "lg": "14px",
        "xl": "20px",
        "2xl": "24px",
      },
      boxShadow: {
        "theme-xs": "var(--shadow-xs)",
        "theme-sm": "var(--shadow-sm)",
        "theme-md": "var(--shadow-md)",
        "theme-lg": "var(--shadow-lg)",
        "theme-xl": "var(--shadow-xl)",
        "theme-glow": "var(--shadow-glow)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
