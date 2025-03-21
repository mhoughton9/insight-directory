import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Higher-order component to protect routes that require authentication
 * Redirects to sign-in page if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Wait until Clerk loads the user data
    if (!isLoaded) return;

    // If user is not signed in, redirect to sign-in page
    if (!isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show nothing while loading or redirecting
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse">
          <div className="h-12 w-12 bg-neutral-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  // If user is authenticated, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
