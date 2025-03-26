# Insight Directory Typography Style Guide

## Overview

This document outlines the typography system used throughout the Insight Directory application. The system is designed to ensure consistency, readability, and alignment with the brand identity.

## Font Families

### Primary Font: Poppins
- **Usage**: Headings, titles, and emphasis text
- **Weights**: 700 (Bold), 600 (SemiBold), 500 (Medium)
- **CSS Variable**: `--font-primary`
- **Tailwind Class**: `font-poppins`

### Secondary Font: Nunito Sans
- **Usage**: Body text, paragraphs, and UI elements
- **Weights**: 400 (Regular), 600 (SemiBold)
- **CSS Variable**: `--font-secondary`
- **Tailwind Class**: `font-nunito`

## Typography Components

The application uses a set of reusable Typography components to maintain consistency:

### Heading
```jsx
<Heading as="h1" size="2xl" className="custom-class">Title</Heading>
```

- **Props**:
  - `as`: HTML element to render (h1, h2, h3, etc.)
  - `size`: Text size (2xl, xl, lg, md, sm)
  - `className`: Additional CSS classes

### Text
```jsx
<Text size="base" className="custom-class">Paragraph content</Text>
```

- **Props**:
  - `as`: HTML element to render (p, span, div, etc.)
  - `size`: Text size (xl, lg, base, sm, xs)
  - `className`: Additional CSS classes

## Font Utilities

The `fontUtils.js` file provides utility functions for consistent typography styling:

### Constants

```js
// Font weights
export const FONT_WEIGHTS = {
  LIGHT: '300',
  REGULAR: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
};

// Font sizes
export const FONT_SIZES = {
  XS: '0.75rem',   // 12px
  SM: '0.875rem',  // 14px
  BASE: '1rem',    // 16px
  LG: '1.125rem',  // 18px
  XL: '1.25rem',   // 20px
  '2XL': '1.5rem', // 24px
  '3XL': '1.875rem', // 30px
  '4XL': '2.25rem',  // 36px
  '5XL': '3rem',     // 48px
};
```

### Helper Functions

```js
// Get typography classes based on type and options
export const getTypographyClasses = ({
  type = 'body',
  weight = 'REGULAR',
  size = 'BASE',
  lineHeight = 'NORMAL',
  letterSpacing = 'NORMAL'
} = {}) => {
  // Returns appropriate CSS classes
};
```

## Usage Guidelines

1. **Always use Typography components** for text elements instead of raw HTML elements
2. **Avoid inline font styles** - use the Typography components or utility functions
3. **Maintain hierarchy** - use appropriate heading levels (h1, h2, h3) for semantic structure
4. **Consistent spacing** - maintain consistent margins between text elements

## Examples

### Page Title
```jsx
<Heading as="h1" size="3xl" className="mb-4">
  About Insight Directory
</Heading>
```

### Section Title
```jsx
<Heading as="h2" size="xl" className="mb-3">
  Featured Teachers
</Heading>
```

### Card Title
```jsx
<Heading as="h3" size="lg" className="mb-2">
  Teacher Name
</Heading>
```

### Body Text
```jsx
<Text className="mb-4">
  Regular paragraph text using the Nunito Sans font.
</Text>
```

### Small Text / Caption
```jsx
<Text size="sm" className="text-neutral-500">
  Last updated: March 2025
</Text>
```

## Dark Mode Considerations

The typography system works seamlessly with dark mode. Text colors are controlled through Tailwind's dark mode classes:

```jsx
<Text className="text-neutral-800 dark:text-neutral-200">
  This text adapts to light/dark mode
</Text>
```
