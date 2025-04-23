import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { MenuIcon } from '../ui/Icons';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

// List of admin user IDs - same as in AdminProtected.js
const ADMIN_USER_IDS = ['user_2udVqD2UHTR7pqFQgAF7A2RT3PG']; // Example ID, replace with yours

export default function DarkThemeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const isAdmin = isLoaded && isSignedIn && ADMIN_USER_IDS.includes(user?.id);

  return (
    <nav className="bg-[var(--theme-bg-secondary)] py-2 border-b border-[var(--theme-border-divider)]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="Insight Directory Logo"
                width={48}
                height={48}
                priority
                className="h-auto w-auto mr-2"
              />
              <div className="relative w-auto" style={{ top: '2px' }}>
                <Image
                  src="/images/Logo4_Words.PNG"
                  alt="Insight Directory"
                  width={140}
                  height={32}
                  className="h-auto w-auto max-w-[140px]"
                  priority
                />
              </div>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center">
          <nav className="hidden md:flex items-center space-x-6 mr-6">
            <Link href="/teachers" className="text-[var(--theme-text-primary)] opacity-80 hover:opacity-100 font-medium" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: '1.05rem' }}>
              Teachers
            </Link>
            <Link href="/traditions" className="text-[var(--theme-text-primary)] opacity-80 hover:opacity-100 font-medium" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: '1.05rem' }}>
              Traditions
            </Link>
            <Link href="/about" className="text-[var(--theme-text-primary)] opacity-80 hover:opacity-100 font-medium" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: '1.05rem' }}>
              About
            </Link>
            <Link 
              href="/suggest" 
              className={`px-4 py-1 border border-[rgba(255,255,255,0.3)] rounded-md font-medium text-[var(--theme-text-primary)] bg-transparent hover:bg-[var(--theme-surface-hover)]`}
              style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
            >
              Suggest a Resource
            </Link>
          </nav>
          
          <div className="flex items-center">
            <SignedIn>
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className={`px-4 py-1 border border-[rgba(255,255,255,0.3)] rounded-md font-medium text-[var(--theme-text-primary)] bg-transparent hover:bg-[var(--theme-surface-hover)]`}
                    style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: '1.05rem' }}
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  href="/profile" 
                  className="text-[var(--theme-text-primary)] opacity-80 hover:opacity-100 font-medium"
                  style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: '1.05rem' }}
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
                  className="text-[var(--theme-text-primary)] opacity-80 hover:opacity-100 font-medium"
                  style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: '1.05rem' }}
                >
                  Sign in
                </Link>
                <Link 
                  href="/sign-up" 
                  className="px-4 py-1 text-white rounded-md font-medium transition-all duration-200 ease-in-out hover:brightness-110"
                  style={{ background: 'var(--theme-gradient-button)', fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: '1.05rem' }}
                >
                  Sign up
                </Link>
              </div>
            </SignedOut>
            
            <button 
              aria-label="Menu" 
              className="p-2 md:hidden text-[var(--theme-text-primary)] opacity-80 hover:opacity-100" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-[var(--theme-bg-secondary)] border-t border-[var(--theme-border-divider)]">
          <nav className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col space-y-4">
            <Link href="/teachers" className="text-[var(--theme-text-primary)] opacity-80 hover:opacity-100 font-medium" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: '1.05rem' }}>
              Teachers
            </Link>
            <Link href="/traditions" className="text-[var(--theme-text-primary)] opacity-80 hover:opacity-100 font-medium" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: '1.05rem' }}>
              Traditions
            </Link>
            <Link href="/about" className="text-[var(--theme-text-primary)] opacity-80 hover:opacity-100 font-medium" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: '1.05rem' }}>
              About
            </Link>
            <Link 
              href="/suggest" 
              className={`inline-block px-4 py-1 border border-[rgba(255,255,255,0.3)] rounded-md font-medium text-[var(--theme-text-primary)] bg-transparent hover:bg-[var(--theme-surface-hover)] w-fit`}
              style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
            >
              Suggest a Resource
            </Link>
            
            <SignedIn>
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className={`inline-block px-4 py-1 border border-[rgba(255,255,255,0.3)] rounded-md font-medium text-[var(--theme-text-primary)] bg-transparent hover:bg-[var(--theme-surface-hover)] w-fit`}
                  style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: '1.05rem' }}
                >
                  Admin
                </Link>
              )}
              <Link href="/profile" className="text-[var(--theme-text-primary)] opacity-80 hover:opacity-100 font-medium" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: '1.05rem' }}>
                Profile
              </Link>
            </SignedIn>
            
            <SignedOut>
              <div className="flex flex-col space-y-3 pt-2 border-t border-[var(--theme-border-divider)]">
                <Link 
                  href="/sign-in" 
                  className="text-[var(--theme-text-primary)] opacity-80 hover:opacity-100 font-medium"
                  style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: '1.05rem' }}
                >
                  Sign in
                </Link>
                <Link 
                  href="/sign-up" 
                  className={`inline-block px-4 py-1 text-white rounded-md font-medium transition-all duration-200 ease-in-out hover:brightness-110 w-fit`}
                  style={{ background: 'var(--theme-gradient-button)', fontFamily: 'ui-sans-serif, system-ui, sans-serif', fontSize: '1.05rem' }}
                >
                  Sign up
                </Link>
              </div>
            </SignedOut>
          </nav>
        </div>
      )}
    </nav> 
  );
}
