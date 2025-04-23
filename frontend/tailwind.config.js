/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [ // Force generation of these classes
    'bg-card-bg',
    'border-card-border',
    'hover:bg-card-bg-hover',
    'text-text-secondary',
    'dark:text-text-secondary', // Include dark variant too
    // Add any other custom classes that might be missed
  ],
  theme: {
    extend: {
      colors: {
        // Map CSS variables to Tailwind theme colors
        'bg-primary': 'var(--bg-primary)',
        'bg-deeper': 'var(--bg-deeper)',
        'surface': 'var(--surface)',
        'surface-hover': 'var(--surface-hover)',
        'border-color': 'var(--border-color)',
        'text-heading': 'var(--text-heading)',
        'text-body': 'var(--text-body)',
        'text-muted': 'var(--text-muted)',
        'text-secondary': 'var(--text-secondary)',
        'accent-blue': 'var(--accent-blue)',
        'accent-purple': 'var(--accent-purple)',
        
        // Additional semantic colors for cards
        'card-bg': 'var(--overlay)',           // Use root variable --overlay
        'card-bg-hover': 'var(--surface-hover)', // Use root variable --surface-hover
        'card-border': 'var(--border-color)',   // Use root variable --border-color

        // Keep existing palettes if needed for specific overrides or light theme
        background: "var(--background)", // Example if needed
        foreground: "var(--foreground)", // Example if needed
        neutral: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
        accent: {
          light: "#e0e7ff", // Light purple
          DEFAULT: "#818cf8", // Medium purple
          dark: "#4f46e5", // Dark purple
        },
        brand: {
          purple: "#7c3aed", // Vibrant purple from logo
          magenta: "#ec4899", // Vibrant pink/magenta from logo
          orange: "#f97316", // Vibrant orange from logo
          teal: "#0ea5e9", // Vibrant teal/blue from logo
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Nunito Sans", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        poppins: ["'Poppins'", "sans-serif"],
        nunito: ["'Nunito Sans'", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.375rem", // Medium radius, not pills
      },
      spacing: {
        // Generous spacing for layout
        xs: "0.5rem",
        sm: "0.75rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      gradientColorStops: {
        'brand-start': '#7c3aed', // Purple
        'brand-mid': '#ec4899',   // Magenta/Pink
        'brand-end': '#f97316',   // Orange
        // Map gradient variables too if needed
        'gradient-start': 'var(--accent-blue)',
        'gradient-end': 'var(--accent-purple)',
      },
    },
  },
  plugins: [],
};
