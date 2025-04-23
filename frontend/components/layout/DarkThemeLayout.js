import Header from './DarkThemeHeader';
import Footer from './DarkThemeFooter';
import '../../styles/theme-variables.css';

export default function DarkThemeLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-body)]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
