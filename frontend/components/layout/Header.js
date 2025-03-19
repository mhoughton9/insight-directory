import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { MenuIcon, SearchIcon, UserIcon } from '../ui/Icons';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and Site Name */}
        <Link href="/" className="flex items-center space-x-3">
          <Image 
            src="/images/logo.png" 
            alt="Awakening Directory Logo" 
            width={52} 
            height={52} 
            className="rounded-sm"
          />
          <span className="font-medium text-2xl" style={{ fontFamily: 'Lora, serif' }}>Awakening Directory</span>
        </Link>
        
        {/* Right Side Navigation and Controls */}
        <div className="flex items-center">
          {/* Desktop Navigation - Moved to right side */}
          <nav className="hidden md:flex items-center space-x-6 mr-6">
            <Link href="/resources" className="text-neutral-700 dark:text-neutral-300 hover:text-accent transition-all duration-300 transform hover:translate-y-[-2px]">
              Resources
            </Link>
            <Link href="/teachers" className="text-neutral-700 dark:text-neutral-300 hover:text-accent transition-all duration-300 transform hover:translate-y-[-2px]">
              Teachers
            </Link>
            <Link href="/traditions" className="text-neutral-700 dark:text-neutral-300 hover:text-accent transition-all duration-300 transform hover:translate-y-[-2px]">
              Traditions
            </Link>
            <Link href="/about" className="text-neutral-700 dark:text-neutral-300 hover:text-accent transition-all duration-300 transform hover:translate-y-[-2px]">
              About
            </Link>
          </nav>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button aria-label="Search" className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-accent">
              <SearchIcon size={20} />
            </button>
            <button aria-label="Account" className="p-2 text-neutral-700 dark:text-neutral-300 hover:text-accent">
              <UserIcon size={20} />
            </button>
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
            <Link href="/resources" className="text-neutral-700 dark:text-neutral-300">
              Resources
            </Link>
            <Link href="/teachers" className="text-neutral-700 dark:text-neutral-300">
              Teachers
            </Link>
            <Link href="/traditions" className="text-neutral-700 dark:text-neutral-300">
              Traditions
            </Link>
            <Link href="/about" className="text-neutral-700 dark:text-neutral-300">
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
