import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { MenuIcon } from '../ui/Icons';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and Site Name */}
        <Link href="/" className="flex items-center space-x-3">
          <Image 
            src="/images/logo.png" 
            alt="Insight Directory Logo" 
            width={52} 
            height={52} 
            className="rounded-sm"
          />
          <span className="font-medium text-2xl" style={{ fontFamily: 'Lora, serif' }}>Insight Directory</span>
        </Link>
        
        {/* Right Side Navigation and Controls */}
        <div className="flex items-center">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 mr-6">
            <Link href="/teachers" className="text-neutral-700 dark:text-neutral-300 hover:text-accent transition-all duration-300 transform hover:translate-y-[-2px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Teachers
            </Link>
            <Link href="/traditions" className="text-neutral-700 dark:text-neutral-300 hover:text-accent transition-all duration-300 transform hover:translate-y-[-2px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Traditions
            </Link>
            <Link 
              href="/suggest" 
              className="px-4 py-2 bg-neutral-800 dark:bg-neutral-700 text-white rounded-md hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Suggest a Resource
            </Link>
            <Link href="/about" className="text-neutral-700 dark:text-neutral-300 hover:text-accent transition-all duration-300 transform hover:translate-y-[-2px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              About
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center">
            <button 
              aria-label="Menu" 
              className="p-2 md:hidden text-neutral-700 dark:text-neutral-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MenuIcon size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-neutral-200 dark:border-neutral-800">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link href="/teachers" className="text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'Inter, sans-serif' }}>
              Teachers
            </Link>
            <Link href="/traditions" className="text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'Inter, sans-serif' }}>
              Traditions
            </Link>
            <Link 
              href="/suggest" 
              className="inline-block px-4 py-2 bg-neutral-800 dark:bg-neutral-700 text-white rounded-md hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors w-fit"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Suggest a Resource
            </Link>
            <Link href="/about" className="text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'Inter, sans-serif' }}>
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
