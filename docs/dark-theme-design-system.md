# Insight Directory - Dark Theme Design System

This document provides a comprehensive guide to the navy blue dark theme styling for the Insight Directory website. It serves as a reference for developers implementing the dark theme across the site.

## Color Palette

### Background Colors

| Name | CSS Variable | Hex Value | Usage |
|------|-------------|-----------|-------|
| Primary Background | `--theme-bg-primary` | `#0F2A47` | Main background color for most sections |
| Secondary Background | `--theme-bg-secondary` | `#0A1F36` | Darker background for contrast areas |
| Surface Primary | `--theme-surface-primary` | `#1E3A59` | Card backgrounds, containers |
| Surface Secondary | `--theme-surface-secondary` | `#1E3A59` | Alternative card backgrounds |
| Surface Hover | `--theme-surface-hover` | `#2A4A6A` | Hover state for cards and interactive elements |
| Border Divider | `--theme-border-divider` | `#1A2130` | Section dividers |
| Border Subtle | `--theme-border-subtle` | `rgba(255,255,255,0.1)` | Subtle borders for cards and containers |

### Text Colors

| Name | CSS Variable | Hex Value | Usage |
|------|-------------|-----------|-------|
| Text Primary | `--theme-text-primary` | `#F5F6F8` | Main text color (headings, body text) |
| Text Secondary | `--theme-text-secondary` | `#9CA3B0` | Secondary text (descriptions, captions) |
| Logo Text | `.logoText` | `#E8E0CE` | Reserved exclusively for logo text |

### Button Colors

| Name | CSS Variable | Value | Usage |
|------|-------------|-------|-------|
| Gradient Button | `--theme-gradient-button` | Linear gradient from `#1E90FF` to `#9370DB` | Primary call-to-action buttons |
| Secondary Button Border | N/A (inline style) | `rgba(255,255,255,0.3)` | Border for secondary buttons |

## Typography

### Fonts

- **Headings**: Poppins (font-poppins)
- **Body**: Inter (font-sans)

### Text Sizes

| Component | Size | Class |
|-----------|------|-------|
| Hero Heading | 4xl | `text-4xl` |
| Section Headings | 3xl | `text-3xl` |
| Subsection Headings | 2xl | `text-2xl` |
| Card Headings | lg | `text-lg` |
| Body Text | base | `text-base` |
| Description Text | lg to xl | `text-lg md:text-xl` |
| Helper Text | md | `text-md` |

## Components

### Primary Button

```jsx
<Link 
  href="/path" 
  className="px-4 py-2 text-white rounded-md font-medium transition-all duration-200 ease-in-out hover:brightness-110"
  style={{ background: 'var(--theme-gradient-button)' }}
>
  Button Text
</Link>
```

### Secondary Button

```jsx
<Link 
  href="/path" 
  className="px-4 py-2 border border-[rgba(255,255,255,0.3)] text-[var(--theme-text-primary)] rounded-md hover:bg-[var(--theme-surface-hover)] bg-transparent"
>
  Button Text
</Link>
```

### Resource Card

```jsx
<Link 
  href="/path"
  className="flex flex-col items-center p-6 transition-all duration-300 bg-[var(--theme-surface-primary)] border border-[var(--theme-border-subtle)] rounded-lg hover:bg-[var(--theme-surface-hover)]"
>
  {/* Card content */}
</Link>
```

### Section Divider

```jsx
<div className="border-t border-[var(--theme-border-divider)] w-full"></div>
```

## Layout Guidelines

### Section Backgrounds

Alternate between primary and secondary backgrounds for visual rhythm:

1. Hero Section: `bg-[var(--theme-bg-primary)]`
2. Resource Categories: `bg-[var(--theme-bg-secondary)]`
3. Traditions/Teachers: `bg-[var(--theme-surface-primary)]`
4. About Section: `bg-[var(--theme-bg-secondary)]`

### Text Width Constraints

Apply `max-w-xl` to longer text blocks to prevent them from stretching too wide on larger screens.

### Responsive Considerations

- Text alignment: Center on mobile, left-aligned on desktop
- Button alignment: Center on mobile, left-aligned on desktop
- Grid layouts: Adjust columns based on screen size

## Implementation Notes

1. The dark theme is applied by adding the `.navy-theme` class to the main container
2. CSS variables are defined in `globals.css`
3. When using the `<Heading>` and `<Text>` components, always pass the appropriate color class via the `className` prop

## Reference Implementation

The dark theme preview page (`dark-theme-preview.js`) serves as a complete reference implementation of all the styling guidelines in this document.
