import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-neutral-200 dark:border-neutral-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} Awakening Resources Directory
            </p>
          </div>
          <nav className="flex space-x-6">
            <Link href="/about" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent">
              About
            </Link>
            <Link href="/contact" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-accent">
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
