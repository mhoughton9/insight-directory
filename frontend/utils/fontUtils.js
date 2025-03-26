/**
 * Font utility functions for consistent typography across the application
 */

/**
 * Font family constants that match our typography system
 */
export const FONTS = {
  // Heading font (Poppins)
  HEADING: 'Poppins, sans-serif',
  
  // Body text font (Nunito Sans)
  BODY: 'Nunito Sans, sans-serif',
};

/**
 * Font weight constants
 */
export const WEIGHTS = {
  LIGHT: 300,
  REGULAR: 400,
  MEDIUM: 500,
  SEMIBOLD: 600,
  BOLD: 700,
};

/**
 * Font size constants with responsive variants
 * Matches Tailwind's text size classes
 */
export const SIZES = {
  XS: 'text-xs',         // 0.75rem
  SM: 'text-sm',         // 0.875rem
  BASE: 'text-base',     // 1rem
  LG: 'text-lg',         // 1.125rem
  XL: 'text-xl',         // 1.25rem
  '2XL': 'text-2xl',     // 1.5rem
  '3XL': 'text-3xl',     // 1.875rem
  '4XL': 'text-4xl',     // 2.25rem
  '5XL': 'text-5xl',     // 3rem
  '6XL': 'text-6xl',     // 3.75rem
};

/**
 * Line height constants
 */
export const LINE_HEIGHTS = {
  NONE: 'leading-none',      // 1
  TIGHT: 'leading-tight',    // 1.25
  SNUG: 'leading-snug',      // 1.375
  NORMAL: 'leading-normal',  // 1.5
  RELAXED: 'leading-relaxed', // 1.625
  LOOSE: 'leading-loose',    // 2
};

/**
 * Letter spacing constants
 */
export const LETTER_SPACING = {
  TIGHTER: 'tracking-tighter', // -0.05em
  TIGHT: 'tracking-tight',     // -0.025em
  NORMAL: 'tracking-normal',   // 0
  WIDE: 'tracking-wide',       // 0.025em
  WIDER: 'tracking-wider',     // 0.05em
  WIDEST: 'tracking-widest',   // 0.1em
};

/**
 * Returns the appropriate font family based on the element type
 * @param {string} type - The type of element ('heading' or 'body')
 * @returns {Object} - The style object with fontFamily property
 */
export const getFontStyle = (type = 'body') => {
  return {
    fontFamily: type.toLowerCase() === 'heading' ? FONTS.HEADING : FONTS.BODY
  };
};

/**
 * Returns a combined style object with the appropriate font family
 * @param {string} type - The type of element ('heading' or 'body')
 * @param {Object} additionalStyles - Additional styles to merge
 * @returns {Object} - The combined style object
 */
export const withFont = (type = 'body', additionalStyles = {}) => {
  return {
    ...getFontStyle(type),
    ...additionalStyles
  };
};

/**
 * Returns a complete typography style object with font family, weight, size, etc.
 * @param {Object} options - Typography options
 * @param {string} options.type - The type of element ('heading' or 'body')
 * @param {number} options.weight - Font weight (300, 400, 500, 600, 700)
 * @param {string} options.size - Font size key (XS, SM, BASE, etc.)
 * @param {string} options.lineHeight - Line height key (NONE, TIGHT, etc.)
 * @param {string} options.letterSpacing - Letter spacing key (TIGHT, NORMAL, etc.)
 * @param {Object} options.additionalStyles - Additional styles to merge
 * @returns {Object} - The complete typography style object
 */
export const getTypographyStyle = ({
  type = 'body',
  weight = WEIGHTS.REGULAR,
  size = 'BASE',
  lineHeight = 'NORMAL',
  letterSpacing = 'NORMAL',
  additionalStyles = {}
} = {}) => {
  return {
    fontFamily: type.toLowerCase() === 'heading' ? FONTS.HEADING : FONTS.BODY,
    fontWeight: weight,
    fontSize: size,
    lineHeight: lineHeight,
    letterSpacing: letterSpacing,
    ...additionalStyles
  };
};

/**
 * Returns the appropriate Tailwind class for a given typography style
 * @param {Object} options - Typography options
 * @param {string} options.type - Element type ('heading' or 'body')
 * @param {string} options.weight - Weight key (LIGHT, REGULAR, etc.)
 * @param {string} options.size - Size key (XS, SM, BASE, etc.)
 * @param {string} options.lineHeight - Line height key (NONE, TIGHT, etc.)
 * @param {string} options.letterSpacing - Letter spacing key (TIGHT, NORMAL, etc.)
 * @returns {string} - Space-separated string of Tailwind classes
 */
export const getTypographyClasses = ({
  type = 'body',
  weight = 'REGULAR',
  size = 'BASE',
  lineHeight = 'NORMAL',
  letterSpacing = 'NORMAL',
} = {}) => {
  const fontClass = type.toLowerCase() === 'heading' ? 'font-poppins' : 'font-nunito';
  const weightClass = `font-${weight.toLowerCase()}`;
  const sizeClass = SIZES[size] || SIZES.BASE;
  const lineHeightClass = LINE_HEIGHTS[lineHeight] || LINE_HEIGHTS.NORMAL;
  const letterSpacingClass = LETTER_SPACING[letterSpacing] || LETTER_SPACING.NORMAL;
  
  return `${fontClass} ${weightClass} ${sizeClass} ${lineHeightClass} ${letterSpacingClass}`;
};

/**
 * Returns the appropriate text color class based on theme and importance
 * @param {string} importance - Importance level ('primary', 'secondary', 'tertiary')
 * @param {boolean} isDark - Whether dark mode is active
 * @returns {string} - Tailwind text color class
 */
export const getTextColorClass = (importance = 'primary', isDark = false) => {
  const colorMap = {
    primary: isDark ? 'text-white' : 'text-neutral-900',
    secondary: isDark ? 'text-neutral-200' : 'text-neutral-800',
    tertiary: isDark ? 'text-neutral-400' : 'text-neutral-600',
    muted: isDark ? 'text-neutral-500' : 'text-neutral-500',
  };
  
  return colorMap[importance] || colorMap.primary;
};
