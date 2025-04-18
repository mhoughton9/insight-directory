# Insight Directory Dark Theme Design System

## Color Palette

### Base Colors

| Name | Hex Code | Usage |
|------|----------|-------|
| Primary Background | `#0F2A47` | Main background color |
| Deeper Background | `#0A1F36` | Header, footer, and alternating sections |
| Surface | `#1E3A59` | Cards, inputs, and interactive elements |
| Surface Hover | `#2A4A6A` | Hover state for cards and interactive elements |
| Overlay | `#2D5275` | Modal backgrounds and overlays |
| Border Color | `#1A2130` | Subtle borders between sections |

### Typography Colors

| Name | Hex Code | Usage |
|------|----------|-------|
| Heading Text | `#E8E0CE` | Headings (h1, h2, h3) |
| Body Text | `#F5F6F8` | Main content text |
| Secondary Text | `#9CA3B0` | Helper text, captions, and secondary information |

### Accent Colors

| Name | Hex Code | Usage |
|------|----------|-------|
| Blue | `#1E90FF` | Primary accent color, used in gradients |
| Purple | `#9370DB` | Secondary accent color, used in gradients |
| Indigo | `#6610F2` | Links and interactive elements |

### Gradient

```css
background: linear-gradient(90deg, #1E90FF, #9370DB);
```

Hover state:
```css
background: linear-gradient(90deg, #4BA5FF, #A385E0);
```

## Typography

- **Font Family**: Inter (variable font)
- **Headings**: Light beige (#E8E0CE)
  - H1: 2.5rem (40px), font-weight: 700
  - H2: 2rem (32px), font-weight: 700
  - H3: 1.5rem (24px), font-weight: 600
- **Body Text**: Soft white (#F5F6F8)
  - Regular: 1rem (16px), font-weight: 400
  - Large: 1.125rem (18px), font-weight: 400
- **Secondary Text**: Mid-grey (#9CA3B0)
  - Small: 0.875rem (14px), font-weight: 400

## Components

### Buttons

#### Primary Button

```css
background: linear-gradient(90deg, #1E90FF, #9370DB);
color: white;
border-radius: 4px;
border: none;
padding: 0.5rem 1rem;
font-weight: 500;
```

Hover state:
```css
background: linear-gradient(90deg, #4BA5FF, #A385E0);
```

#### Secondary Button

```css
background-color: transparent;
color: #F5F6F8;
border: 1px solid #3A4150;
border-radius: 4px;
padding: 0.5rem 1rem;
font-weight: 500;
```

Hover state:
```css
border-color: #9CA3B0;
color: white;
```

### Cards

```css
background-color: #1E3A59;
border-radius: 8px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.35);
```

Hover state:
```css
background-color: #2A4A6A;
```

### Section Dividers

```css
border-top: 1px solid #1A2130;
border-bottom: 1px solid #1A2130;
```

## Layout Guidelines

### Spacing

- **Extra Small**: 0.25rem (4px)
- **Small**: 0.5rem (8px)
- **Medium**: 1rem (16px)
- **Large**: 1.5rem (24px)
- **Extra Large**: 2rem (32px)
- **2XL**: 3rem (48px)

### Container Widths

- **Small**: 640px
- **Medium**: 768px
- **Large**: 1024px
- **Extra Large**: 1280px
- **2XL**: 1536px

### Border Radius

- **Small**: 4px (buttons, inputs)
- **Medium**: 8px (cards, containers)
- **Large**: 12px (modals, featured elements)
- **Full**: 9999px (avatars, badges)

## Accessibility Guidelines

- Maintain a minimum contrast ratio of 4.5:1 for normal text
- Use 3:1 minimum contrast for large text (18px+ or 14px+ bold)
- Ensure interactive elements have clear hover/focus states
- Avoid using color alone to convey information

## Implementation Notes

1. Use CSS variables for all colors to make site-wide changes easier
2. Apply the dark theme to all user-facing pages only
3. Keep admin pages unchanged with the current light theme
4. Use the `dark-theme.module.css` as the source of truth for all styling
