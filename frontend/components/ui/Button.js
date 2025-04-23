export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const baseClasses = "rounded font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "text-white focus:ring-accent hover:brightness-110",
    secondary: "bg-transparent border border-[rgba(255,255,255,0.3)] text-[var(--theme-text-primary)] hover:bg-[var(--theme-surface-hover)] focus:ring-neutral-300",
    outline: "border border-neutral-300 hover:bg-neutral-100 text-neutral-800 focus:ring-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:text-neutral-200",
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const buttonStyle = variant === 'primary' ? { background: 'var(--theme-gradient-button)' } : {};
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={buttonStyle}
      {...props}
    >
      {children}
    </button>
  );
}
