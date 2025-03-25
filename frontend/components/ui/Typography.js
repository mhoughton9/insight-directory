import React from 'react';
import PropTypes from 'prop-types';

/**
 * Typography components for consistent text styling across the application
 * Uses the project's font system: Lora for headings, Inter for body text
 */

/**
 * Heading component for page and section titles
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to display
 * @param {string} props.as - HTML element to render (h1, h2, etc.)
 * @param {string} props.size - Size variant (xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.rest - Additional props to pass to the element
 */
export const Heading = ({
  children,
  as: Component = 'h2',
  size = 'xl',
  className = '',
  ...rest
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
  };

  return (
    <Component
      className={`font-lora font-medium text-neutral-900 dark:text-white ${sizeClasses[size] || 'text-xl'} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
};

/**
 * Subheading component for secondary titles
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to display
 * @param {string} props.as - HTML element to render (h3, h4, etc.)
 * @param {string} props.size - Size variant (xs, sm, md, lg, xl)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.rest - Additional props to pass to the element
 */
export const Subheading = ({
  children,
  as: Component = 'h3',
  size = 'lg',
  className = '',
  ...rest
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <Component
      className={`font-inter font-medium text-neutral-800 dark:text-neutral-200 ${sizeClasses[size] || 'text-lg'} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
};

/**
 * Text component for body text and paragraphs
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to display
 * @param {string} props.as - HTML element to render (p, span, div)
 * @param {string} props.size - Size variant (xs, sm, md, lg, xl, 2xl)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.rest - Additional props to pass to the element
 */
export const Text = ({
  children,
  as: Component = 'p',
  size = 'md',
  className = '',
  ...rest
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };

  return (
    <Component
      className={`font-inter text-neutral-700 dark:text-neutral-300 ${sizeClasses[size] || 'text-base'} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
};

/**
 * Caption component for small, secondary text
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to display
 * @param {string} props.as - HTML element to render (span, p, div)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.rest - Additional props to pass to the element
 */
export const Caption = ({
  children,
  as: Component = 'span',
  className = '',
  ...rest
}) => {
  return (
    <Component
      className={`font-inter text-xs text-neutral-500 dark:text-neutral-400 ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
};

// PropTypes
Heading.propTypes = {
  children: PropTypes.node.isRequired,
  as: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']),
  className: PropTypes.string,
};

Subheading.propTypes = {
  children: PropTypes.node.isRequired,
  as: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};

Text.propTypes = {
  children: PropTypes.node.isRequired,
  as: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  className: PropTypes.string,
};

Caption.propTypes = {
  children: PropTypes.node.isRequired,
  as: PropTypes.string,
  className: PropTypes.string,
};
