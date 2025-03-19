export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const baseClasses = "rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-accent hover:bg-accent-dark text-white focus:ring-accent",
    secondary: "bg-neutral-200 hover:bg-neutral-300 text-neutral-800 focus:ring-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200",
    outline: "border border-neutral-300 hover:bg-neutral-100 text-neutral-800 focus:ring-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:text-neutral-200",
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
