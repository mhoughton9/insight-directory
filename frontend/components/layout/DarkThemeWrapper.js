export default function DarkThemeWrapper({ children }) {
  return (
    <div className="dark navy-theme"> {/* Include both classes */} 
      {children}
    </div>
  );
}
