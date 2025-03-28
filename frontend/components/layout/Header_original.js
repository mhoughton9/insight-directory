import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { MenuIcon } from '../ui/Icons';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-neutral-200">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Header-specific cropped logo - updated version */}
        <Link href="/" className="flex items-center">
          <div className="relative h-16 w-56">
            <Image 
              src="/images/Logo_header.PNG?v=2" 
              alt="Insight Directory Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        
        {/* Right Side Navigation and Controls */}
        <div className="flex items-center">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 mr-6">
            <Link href="/teachers" className="text-neutral-700 hover:text-accent transition-all duration-300 transform hover:translate-y-[-2px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Teachers
            </Link>
            <Link href="/traditions" className="text-neutral-700 hover:text-accent transition-all duration-300 transform hover:translate-y-[-2px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Traditions
            </Link>
            <Link href="/about" className="text-neutral-700 hover:text-accent transition-all duration-300 transform hover:translate-y-[-2px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              About
            </Link>
            <Link 
              href="/suggest-resource" 
              className="px-4 py-2 rounded-md text-neutral-800 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                background: 'var(--background)',
                border: '2px solid transparent',
                backgroundImage: 'linear-gradient(var(--background), var(--background)), var(--gradient-brand)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box'
              }}
            >
              Suggest a Resource
            </Link>
          </nav>
          
          <div className="flex items-center">
            <SignedIn>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/profile" 
                  className="text-neutral-700 hover:text-accent transition-all duration-300 transform hover:translate-y-[-2px]" 
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Profile
                </Link>
                <div className="h-8 w-8">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonAvatarBox: {
                          width: '32px',
                          height: '32px'
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </SignedIn>
            
            <SignedOut>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/sign-in" 
                  className="text-neutral-700 hover:text-accent transition-all duration-300 transform hover:translate-y-[-2px]" 
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Sign in
                </Link>
                <Link 
                  href="/sign-up" 
                  className="px-4 py-2 rounded-md text-neutral-800 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md" 
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    background: 'var(--background)',
                    border: '2px solid transparent',
                    backgroundImage: 'linear-gradient(var(--background), var(--background)), var(--gradient-brand)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box'
                  }}
                >
                  Sign up
                </Link>
              </div>
            </SignedOut>
            
            <button 
              aria-label="Menu" 
              className="p-2 md:hidden text-neutral-800 transition-all duration-300 transform hover:translate-y-[-2px]" 
              style={{ 
                fontFamily: 'Inter, sans-serif',
                background: 'var(--background)',
                border: '2px solid transparent',
                backgroundImage: 'linear-gradient(var(--background), var(--background)), var(--gradient-brand)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box'
              }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MenuIcon size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link href="/teachers" className="text-neutral-700 transition-all duration-300 transform hover:translate-y-[-2px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Teachers
            </Link>
            <Link href="/traditions" className="text-neutral-700 transition-all duration-300 transform hover:translate-y-[-2px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Traditions
            </Link>
            <Link href="/about" className="text-neutral-700 transition-all duration-300 transform hover:translate-y-[-2px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              About
            </Link>
            <Link 
              href="/suggest-resource" 
              className="inline-block px-4 py-2 rounded-md text-neutral-800 w-fit transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md" 
              style={{ 
                fontFamily: 'Inter, sans-serif',
                background: 'var(--background)',
                border: '2px solid transparent',
                backgroundImage: 'linear-gradient(var(--background), var(--background)), var(--gradient-brand)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box'
              }}
            >
              Suggest a Resource
            </Link>
            
            <SignedIn>
              <Link href="/profile" className="text-neutral-700 transition-all duration-300 transform hover:translate-y-[-2px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Profile
              </Link>
            </SignedIn>
            
            <SignedOut>
              <div className="flex flex-col space-y-3 pt-2 border-t border-neutral-200">
                <Link 
                  href="/sign-in" 
                  className="text-neutral-700 transition-all duration-300 transform hover:translate-y-[-2px]" 
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Sign in
                </Link>
                <Link 
                  href="/sign-up" 
                  className="inline-block px-4 py-2 rounded-md text-neutral-800 w-fit transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md" 
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    background: 'var(--background)',
                    border: '2px solid transparent',
                    backgroundImage: 'linear-gradient(var(--background), var(--background)), var(--gradient-brand)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box'
                  }}
                >
                  Sign up
                </Link>
              </div>
            </SignedOut>
          </nav>
        </div>
      )}
    </header>
  );
}
