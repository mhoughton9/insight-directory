# UI Guidelines for Insight Directory

## Design Philosophy
- Minimalist, clean, and elegant design inspired by non-duality and clarity.
- Prioritize simplicity, stillness, and a calming user experience.
- Reduce cognitive load through spacious layouts and intuitive navigation.
- Visual design should feel timeless and distraction-free.

## Layout
- Generous use of whitespace between elements.
- Clear visual hierarchy with consistent section spacing.
- Simple, predictable navigation patterns.
- Grid-based layout system for consistency across pages.
- Multi-column layouts with colored dots for resource lists and categories.
- Card-based sections with subtle shadows for visual separation.

## Colors
- Brand colors:
  - Purple: #7c3aed
  - Magenta/Pink: #ec4899
  - Orange: #f97316
  - Teal/Blue: #0ea5e9
- Background: Light blue (#f0f9ff) for a calming, less stark alternative to pure white.
- Text: Dark gray or near-black for maximum readability.
- Accent colors from brand palette used for interactive elements and visual indicators.
- Colored dots (using brand colors) to precede list items for visual interest.

## Typography
- Primary body font: Inter (sans-serif) for clean readability.
- Accent/Heading font: Lora (serif) for section titles and special elements.
- Typography hierarchy:
  - Hero headings: Lora, larger size (3xl-5xl), lighter weight.
  - Section headings: Lora, medium size (2xl-3xl), with accent color for emphasis words.
  - Resource Categories heading: Lora, non-bold for a cleaner look.
  - Body text: Inter, comfortable reading size, regular weight.
  - Small details: Subtle and clear.
- Generous line height (leading-relaxed) and letter spacing for readability.

## Buttons & Inputs
- Rounded corners (medium radius, not pills).
- Primary buttons: 
  - Background color using brand gradient (purple to pink).
  - White text for contrast.
  - Subtle hover state with slight darkening.
  - Consistent messaging (e.g., "Sign up for free" in Hero section, "Learn more about us" in About section).
- Secondary buttons:
  - Transparent background with accent color border.
  - Accent color text.
  - Hover state changes background to very light accent color.
- Inputs are clean with clear labels and plenty of padding.

## Icons
- Use Lucide icons for a simple, modern icon set.
- Icons should be subtle and only used where they support comprehension.
- No decorative icons that don't add meaning.

## Animation & Interactions
- Subtle, purposeful animations that enhance usability:
  - Header navigation: Slight upward movement (-2px) on hover with color change.
  - Resource category cards: Soft gradient hover effect matching the category's icon color.
  - List items: Slight rightward movement (1px) on hover with color change.
  - Transition duration: 300ms for smooth, natural-feeling animations.
  - Use transform properties for performance optimization.
- All animations should have consistent timing and easing.
- Hover states should provide clear visual feedback without being distracting.

## Mobile Responsiveness
- Mobile-first design with simplified navigation.
- Touch-friendly buttons and links (minimum 44px touch target).
- Collapsible menus where appropriate.
- Responsive grid layout that adapts cleanly to tablet and phone screens.
- Increased font sizes on mobile for hero sections (text-4xl to text-5xl).
- Single-column layouts on mobile, multi-column on larger screens.

## Component Guidelines
- Reusable UI components: Cards, resource lists, filters, buttons.
- Components should be designed to allow future scaling (e.g., filters with multiple selections).
- Resource Categories section:
  - More pronounced rounded corners (rounded-xl)
  - Subtle shadow effect
  - Soft color gradient on hover that matches each category's icon color
  - Improved hover transitions with a slight border effect
  - Proper z-indexing to ensure text remains readable
- Card components:
  - Consistent padding (p-6 to p-8).
  - Subtle shadows (shadow-sm).
  - Rounded corners (rounded-lg).
  - Clear headings with accent colors for emphasis.

## Navigation Structure
- Simplified header with essential links: Resources, Teachers, Traditions, About
- No redundant "Home" link (logo serves this purpose)
- Path-based routing for resource types (/resources/type/book)
- Consistent styling across all navigation items

## Section Patterns
- Hero sections: Centered content with large typography and gradient background.
- Category sections: Two-column grid with colored dots preceding items.
- About sections: Clean typography with subtle decorative elements and centered call-to-action.
- Resource listings: Card-based layout with consistent information hierarchy.

## Design Inspiration
1. [Stripe](https://stripe.com): Clean, modern interface with subtle animations.
2. [Duuce](https://duuce.com/): Minimalist aesthetic, great use of layout and color balance.

## General Tone
- Clean, confident, and welcoming.
- The design should evoke a sense of calm and focus, aligning with themes of awakening and clarity.
