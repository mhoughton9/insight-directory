/**
 * TypographyStyles.js
 * 
 * This file contains consistent typography styles for use across the application.
 * It provides a set of utility classes for headings, paragraphs, and other text elements
 * to ensure consistent styling across all pages.
 */

// Page title (h1) for detail pages
export const pageTitle = "text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-neutral-200 font-poppins break-words";

// Section headings (h2) for content sections
export const sectionHeading = "text-xl md:text-2xl font-bold mb-3 md:mb-4 text-neutral-800 dark:text-neutral-200 font-poppins";

// Sidebar headings (h2) for sidebar sections
export const sidebarHeading = "text-xl md:text-2xl font-bold mb-3 md:mb-4 text-neutral-800 dark:text-neutral-200 font-poppins";

// Subheadings (h3) for content subsections
export const subheading = "text-lg md:text-xl font-semibold mb-2 md:mb-3 text-neutral-800 dark:text-neutral-200 font-poppins";

// Body text for main content
export const bodyText = "text-base text-neutral-700 dark:text-neutral-300 font-nunito";

// Secondary text for descriptions, metadata
export const secondaryText = "text-sm text-neutral-600 dark:text-neutral-400 font-nunito";

// Small text for metadata, dates, etc.
export const smallText = "text-xs text-neutral-500 dark:text-neutral-500 font-nunito";

// Link text styling
export const linkText = "text-brand-purple hover:text-brand-purple-dark transition-colors font-nunito";

// Detail label text (for key-value pairs in sidebars)
export const detailLabel = "text-neutral-500 dark:text-neutral-400 font-nunito";

// Detail value text (for key-value pairs in sidebars)
export const detailValue = "text-neutral-800 dark:text-neutral-200 font-nunito";

// Tag/pill styling
export const tagPill = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-purple bg-opacity-10 text-brand-purple dark:bg-opacity-20 hover:bg-opacity-20 transition-colors font-nunito truncate max-w-[180px] md:max-w-[200px]";

// Breadcrumb styling
export const breadcrumbItem = "hover:text-brand-purple transition-colors whitespace-nowrap font-nunito";
export const breadcrumbText = "text-neutral-500 dark:text-neutral-500 truncate max-w-[120px] sm:max-w-[150px] md:max-w-xs font-nunito";

// Card container styling
export const cardContainer = "bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800 p-4 sm:p-6 mb-6 md:mb-8";

// Metadata text (dates, types, etc.)
export const metadataText = "text-sm text-neutral-500 dark:text-neutral-400 font-nunito";

// Empty state text (when no content is available)
export const emptyStateText = "text-neutral-600 dark:text-neutral-400 italic font-nunito";
