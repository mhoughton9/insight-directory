# Dark Theme Implementation Guide for Insight Directory

## Implementation Strategy

This document outlines the step-by-step approach to implementing the dark theme across the Insight Directory platform while maintaining code quality and minimizing regressions.

## Phase 1: Setup CSS Variables and Theming Infrastructure

### 1. Create a Global CSS Variables File

Create a file at `frontend/styles/theme-variables.css` that will contain all theme variables:

```css
:root {
  /* Light theme variables (current default) */
  --light-bg-primary: #FFFFFF;
  --light-bg-secondary: #F5F6F8;
  /* ... other light theme variables */
  
  /* Dark theme variables */
  --dark-bg-primary: #0F2A47;
  --dark-bg-deeper: #0A1F36;
  --dark-surface: #1E3A59;
  --dark-surface-hover: #2A4A6A;
  --dark-overlay: #2D5275;
  --dark-border-color: #1A2130;
  
  /* Typography */
  --dark-text-heading: #E8E0CE;
  --dark-text-body: #F5F6F8;
  --dark-text-muted: #9CA3B0;
  
  /* Gradients */
  --simplified-gradient: linear-gradient(90deg, #1E90FF, #9370DB);
  --simplified-gradient-hover: linear-gradient(90deg, #4BA5FF, #A385E0);
}

/* Apply dark theme variables as default */
:root {
  --bg-primary: var(--dark-bg-primary);
  --bg-deeper: var(--dark-bg-deeper);
  --surface: var(--dark-surface);
  --surface-hover: var(--dark-surface-hover);
  --overlay: var(--dark-overlay);
  --border-color: var(--dark-border-color);
  
  --text-heading: var(--dark-text-heading);
  --text-body: var(--dark-text-body);
  --text-muted: var(--dark-text-muted);
  
  --gradient: var(--simplified-gradient);
  --gradient-hover: var(--simplified-gradient-hover);
}

/* Optional: Light theme class for future theme switching */
.light-theme {
  --bg-primary: var(--light-bg-primary);
  --bg-deeper: var(--light-bg-secondary);
  /* ... map all other variables to light theme */
}
```

### 2. Create Component-Specific Theme Files

Create modular theme files for major components:

- `frontend/styles/components/buttons.css`
- `frontend/styles/components/cards.css`
- `frontend/styles/components/typography.css`
- `frontend/styles/components/layout.css`

Each file should use the global variables defined above.

## Phase 2: Update Core Layout Components

### 1. Update the Layout Component

Modify `frontend/components/layout/Layout.js` to use the new theme variables:

```jsx
import '../styles/theme-variables.css';

// Add a conditional class for admin pages
const Layout = ({ children, isAdminPage = false }) => {
  return (
    <div className={isAdminPage ? 'light-theme' : ''}>
      {/* Rest of layout */}
    </div>
  );
};
```

### 2. Create a Theme Context (Optional for Theme Switching)

If you want to support theme switching in the future:

```jsx
// frontend/contexts/ThemeContext.js
import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light-theme');
    localStorage.setItem('theme', newTheme);
  };
  
  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setTheme('light');
      document.documentElement.classList.add('light-theme');
    }
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## Phase 3: Component-by-Component Migration

Implement the dark theme in this order to minimize disruption:

### 1. Global Elements

- Header/Navigation
- Footer
- Main layout containers

### 2. Core Components

- Typography (headings, paragraphs)
- Buttons
- Cards
- Form elements

### 3. Page-Specific Components

- Home page
- Resource listings
- Detail pages
- Search functionality

## Phase 4: Testing and Refinement

### 1. Cross-Browser Testing

Test the dark theme implementation on:
- Chrome
- Firefox
- Safari
- Edge

### 2. Responsive Testing

Verify the theme works correctly on:
- Mobile phones
- Tablets
- Desktop

### 3. Accessibility Testing

- Verify contrast ratios meet WCAG AA standards
- Test with screen readers
- Ensure keyboard navigation works properly

## Phase 5: Admin Section Protection

### 1. Isolate Admin Styles

Create a separate admin-specific layout component:

```jsx
// frontend/components/layout/AdminLayout.js
import '../styles/admin-styles.css'; // Keep existing light theme styles

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      {/* Admin-specific header, navigation, etc. */}
      {children}
    </div>
  );
};
```

### 2. Update Admin Pages

Ensure all admin pages use the AdminLayout component instead of the main Layout.

## Optional: Theme Switching Implementation

If you decide to support theme switching:

### 1. Add Theme Toggle Component

```jsx
// frontend/components/ui/ThemeToggle.js
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="theme-toggle"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
};
```

### 2. Add to Navigation

Add the ThemeToggle component to your main navigation bar.

## Migration Checklist

Use this checklist to track progress:

- [ ] Create theme variables CSS file
- [ ] Update Layout component
- [ ] Migrate global elements (header, footer)
- [ ] Migrate core components
- [ ] Migrate page-specific components
- [ ] Isolate admin section
- [ ] Cross-browser testing
- [ ] Responsive testing
- [ ] Accessibility testing
- [ ] (Optional) Implement theme switching

## Fallback Plan

If issues arise during implementation:

1. Create a feature flag system to enable/disable the dark theme
2. Keep a backup of original styles
3. Implement changes in a separate branch before merging to main

## Conclusion

This phased approach ensures a smooth transition to the dark theme while maintaining the existing admin functionality and providing a path for future theme switching if desired.
