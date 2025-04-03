import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { MenuIcon } from '../ui/Icons';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { Text } from '../ui/Typography';
import { getTypographyClasses } from '../../utils/fontUtils';

// List of admin user IDs - same as in AdminProtected.js
const ADMIN_USER_IDS = ['user_2udVqD2UHTR7pqFQgAF7A2RT3PG']; // Example ID, replace with yours

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const isAdmin = isLoaded && isSignedIn && ADMIN_USER_IDS.includes(user?.id);

  // Common navigation link classes
  const navLinkClasses = "text-neutral-700 hover:text-accent transition-all duration-300 transform hover:translate-y-[-2px]";
  
  // Common button classes
  const buttonClasses = "px-4 py-2 rounded-md text-neutral-800 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md";
  
  // Common button styles
  const buttonStyle = {
    background: 'var(--background)',
    border: '2px solid var(--brand-deep-blue)'
  };

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
            <Link href="/teachers" className={`${navLinkClasses} ${getTypographyClasses({ type: 'body' })}`}>
              <Text as="span">Teachers</Text>
            </Link>
            <Link href="/traditions" className={`${navLinkClasses} ${getTypographyClasses({ type: 'body' })}`}>
              <Text as="span">Traditions</Text>
            </Link>
            <Link href="/about" className={`${navLinkClasses} ${getTypographyClasses({ type: 'body' })}`}>
              <Text as="span">About</Text>
            </Link>
            <Link 
              href="/suggest" 
              className={`${buttonClasses} ${getTypographyClasses({ type: 'body' })}`}
              style={buttonStyle}
            >
              <Text as="span">Suggest a Resource</Text>
            </Link>
          </nav>
          
          <div className="flex items-center">
            <SignedIn>
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className={`${buttonClasses} bg-accent text-white ${getTypographyClasses({ type: 'body' })}`}
                  >
                    <Text as="span">Admin</Text>
                  </Link>
                )}
                <Link 
                  href="/profile" 
                  className={`${navLinkClasses} ${getTypographyClasses({ type: 'body' })}`}
                >
                  <Text as="span">Profile</Text>
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
                  className={`${navLinkClasses} ${getTypographyClasses({ type: 'body' })}`}
                >
                  <Text as="span">Sign in</Text>
                </Link>
                <Link 
                  href="/sign-up" 
                  className={`${buttonClasses} ${getTypographyClasses({ type: 'body' })}`}
                  style={buttonStyle}
                >
                  <Text as="span">Sign up</Text>
                </Link>
              </div>
            </SignedOut>
            
            <button 
              aria-label="Menu" 
              className="p-2 md:hidden text-neutral-800 transition-all duration-300 transform hover:translate-y-[-2px]" 
              style={{ 
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
            <Link href="/teachers" className={`${navLinkClasses} ${getTypographyClasses({ type: 'body' })}`}>
              <Text as="span">Teachers</Text>
            </Link>
            <Link href="/traditions" className={`${navLinkClasses} ${getTypographyClasses({ type: 'body' })}`}>
              <Text as="span">Traditions</Text>
            </Link>
            <Link href="/about" className={`${navLinkClasses} ${getTypographyClasses({ type: 'body' })}`}>
              <Text as="span">About</Text>
            </Link>
            <Link 
              href="/suggest" 
              className={`inline-block ${buttonClasses} w-fit ${getTypographyClasses({ type: 'body' })}`}
              style={buttonStyle}
            >
              <Text as="span">Suggest a Resource</Text>
            </Link>
            
            <SignedIn>
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className={`${navLinkClasses} text-accent font-semibold ${getTypographyClasses({ type: 'body' })}`}
                >
                  <Text as="span">Admin</Text>
                </Link>
              )}
              <Link href="/profile" className={`${navLinkClasses} ${getTypographyClasses({ type: 'body' })}`}>
                <Text as="span">Profile</Text>
              </Link>
            </SignedIn>
            
            <SignedOut>
              <div className="flex flex-col space-y-3 pt-2 border-t border-neutral-200">
                <Link 
                  href="/sign-in" 
                  className={`${navLinkClasses} ${getTypographyClasses({ type: 'body' })}`}
                >
                  <Text as="span">Sign in</Text>
                </Link>
                <Link 
                  href="/sign-up" 
                  className={`inline-block ${buttonClasses} w-fit ${getTypographyClasses({ type: 'body' })}`}
                  style={buttonStyle}
                >
                  <Text as="span">Sign up</Text>
                </Link>
              </div>
            </SignedOut>
          </nav>
        </div>
      )}
    </header>
  );
}
