/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core Brand Palette
        brand: {
          obsidian: '#0B0F19',
          lightgray: '#F8F9FC',
          safety: '#FF7B00',
          accent: '#00C8FF',
          success: '#00E676',
          danger: '#FF1744',
        },
        // CSS variable mappings compatible with Shadcn/custom overrides
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      screens: {
        'xs': '480px',
        'tablet': '481px',
        'desktop': '1025px',
      },
      animation: {
        'pulse-slow': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ai-pulse': 'ai-pulse 1.5s infinite alternate',
      },
      keyframes: {
        'ai-pulse': {
          '0%': { transform: 'scale(0.98)', opacity: '0.8' },
          '100%': { transform: 'scale(1.02)', opacity: '1' },
        }
      },
      boxShadow: {
        'raised': 'var(--shadow-raised)',
        'floating': 'var(--shadow-floating)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      }
    },
  },
  plugins: [],
}
