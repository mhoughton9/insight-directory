# Insight Directory UI Style Guide

## Detail Pages Consistency Guidelines

This document outlines the common UI patterns and styling guidelines for detail pages (Teacher, Tradition, Resource) to ensure consistency across the application.

### Layout Structure

#### Page Layout
- Two-column layout on desktop (main content 2/3, sidebar 1/3)
- Single column stacked layout on mobile (sidebar below main content)
- Maximum width container with centered content

#### Spacing
- Section margins: `mb-8` (2rem, 32px) between major sections
- Inner section padding: `p-6` (1.5rem, 24px) for content containers
- Component spacing: `mb-6` (1.5rem, 24px) between components within a section
- List item spacing: `mb-4` (1rem, 16px) between items in a list

#### Containers
- Content containers: `bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800`
- Section headers: `text-2xl font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora`
- Subsection headers: `text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-200 font-lora border-b border-neutral-100 dark:border-neutral-800 pb-2`

### Typography

#### Fonts
- Headings: `font-lora` (serif font for headings)
- Body text: `font-inter` (sans-serif for readability)

#### Text Sizes
- Page title: `text-3xl md:text-4xl`
- Section headers: `text-2xl`
- Subsection headers: `text-lg`
- Body text: `text-base`
- Small text: `text-sm`

#### Text Colors
- Headings: `text-neutral-800 dark:text-neutral-200`
- Body text: `text-neutral-700 dark:text-neutral-300`
- Secondary text: `text-neutral-600 dark:text-neutral-400`
- Links: `text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300`

### Common Components

#### Breadcrumbs
- Container: `flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-4`
- Separator: `mx-2 text-neutral-400 dark:text-neutral-500`
- Current page: `text-neutral-700 dark:text-neutral-300`

#### Action Buttons
- Primary: `px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors`
- Secondary: `px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 rounded-md transition-colors`
- Icon buttons: `p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-full transition-colors`

#### Cards
- Container: `bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800 overflow-hidden`
- Image container: `aspect-w-16 aspect-h-9 relative`
- Content padding: `p-4`

#### Tags/Pills
- Container: `px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md text-xs`
- Interactive: `hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors`

### Responsive Breakpoints

- Mobile: Default styles
- Tablet: `md:` prefix (768px and above)
- Desktop: `lg:` prefix (1024px and above)
- Large Desktop: `xl:` prefix (1280px and above)

### Dark Mode

All components should support dark mode using the `dark:` prefix for Tailwind classes. The color scheme should maintain sufficient contrast in both light and dark modes.

### Accessibility

- Maintain a minimum contrast ratio of 4.5:1 for normal text
- Use semantic HTML elements
- Ensure proper focus states for interactive elements
- Include appropriate ARIA attributes where needed
