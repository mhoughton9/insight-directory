/**
 * TypographyStyles.js
 * 
 * This file contains consistent typography styles for use across the application.
 * It provides a set of utility classes for headings, paragraphs, and other text elements
 * to ensure consistent styling across all pages.
 */

// Page title (h1) for detail pages
export const pageTitle = "text-2xl md:text-3xl lg:text-4xl font-medium text-neutral-800 dark:text-neutral-200 font-lora break-words";

// Section headings (h2) for content sections
export const sectionHeading = "text-xl md:text-2xl font-medium mb-3 md:mb-4 text-neutral-800 dark:text-neutral-200 font-lora";

// Sidebar headings (h2) for sidebar sections
export const sidebarHeading = "text-xl md:text-2xl font-medium mb-3 md:mb-4 text-neutral-800 dark:text-neutral-200 font-lora";

// Subheadings (h3) for content subsections
export const subheading = "text-lg md:text-xl font-medium mb-2 md:mb-3 text-neutral-800 dark:text-neutral-200 font-lora";

// Body text for main content
export const bodyText = "text-base text-neutral-700 dark:text-neutral-300 font-inter";

// Secondary text for descriptions, metadata
export const secondaryText = "text-sm text-neutral-600 dark:text-neutral-400 font-inter";

// Small text for metadata, dates, etc.
export const smallText = "text-xs text-neutral-500 dark:text-neutral-500 font-inter";

// Link text styling
export const linkText = "text-brand-purple hover:text-brand-purple-dark transition-colors font-inter";

// Detail label text (for key-value pairs in sidebars)
export const detailLabel = "text-neutral-500 dark:text-neutral-400 font-inter";

// Detail value text (for key-value pairs in sidebars)
export const detailValue = "text-neutral-800 dark:text-neutral-200 font-inter";

// Tag/pill styling
export const tagPill = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-purple bg-opacity-10 text-brand-purple dark:bg-opacity-20 hover:bg-opacity-20 transition-colors font-inter truncate max-w-[180px] md:max-w-[200px]";

// Breadcrumb styling
export const breadcrumbItem = "hover:text-brand-purple transition-colors whitespace-nowrap font-inter";
export const breadcrumbText = "text-neutral-500 dark:text-neutral-500 truncate max-w-[120px] sm:max-w-[150px] md:max-w-xs font-inter";

// Card container styling
export const cardContainer = "bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800 p-4 sm:p-6 mb-6 md:mb-8";

// Metadata text (dates, types, etc.)
export const metadataText = "text-sm text-neutral-500 dark:text-neutral-400 font-inter";

// Empty state text (when no content is available)
export const emptyStateText = "text-neutral-600 dark:text-neutral-400 italic font-inter";
