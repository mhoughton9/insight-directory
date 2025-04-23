import DarkThemeHeader from './DarkThemeHeader';
import Footer from './Footer';
import DarkThemeWrapper from './DarkThemeWrapper';

export default function Layout({ children }) {
  return (
    <DarkThemeWrapper>
      <div className="flex flex-col min-h-screen">
        <DarkThemeHeader />
        <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
        <Footer />
      </div>
    </DarkThemeWrapper>
  );
}
