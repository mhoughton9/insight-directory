import Link from 'next/link';
import { Text } from '../ui/Typography';
import { getTypographyClasses } from '../../utils/fontUtils';

export default function DarkThemeFooter() {
  // Dark theme footer link classes
  const footerLinkClasses = "text-[var(--dark-text-muted)] hover:text-white transition-all duration-300";

  return (
    <footer className="bg-[var(--dark-bg-deeper)] border-t border-[rgba(255,255,255,0.1)] py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Text size="sm" className="text-[var(--dark-text-muted)]">
              {new Date().getFullYear()} Insight Directory
            </Text>
          </div>
          <nav className="flex space-x-6">
            <Link href="/" className={`${footerLinkClasses} ${getTypographyClasses({ type: 'body', size: 'SM' })}`}>
              <Text as="span" size="sm">Home</Text>
            </Link>
            <Link href="/teachers" className={`${footerLinkClasses} ${getTypographyClasses({ type: 'body', size: 'SM' })}`}>
              <Text as="span" size="sm">Teachers</Text>
            </Link>
            <Link href="/traditions" className={`${footerLinkClasses} ${getTypographyClasses({ type: 'body', size: 'SM' })}`}>
              <Text as="span" size="sm">Traditions</Text>
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
