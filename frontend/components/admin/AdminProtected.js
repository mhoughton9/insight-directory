import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// List of admin user IDs - replace with your actual admin user IDs
// You can find your Clerk user ID in the Clerk dashboard or by logging user.id
const ADMIN_USER_IDS = ['user_2udVqD2UHTR7pqFQgAF7A2RT3PG']; // Example ID, replace with yours

/**
 * Component that protects admin routes by checking if the user is authenticated and an admin
 * Redirects to sign-in if not authenticated, or home if authenticated but not an admin
 */
export default function AdminProtected({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      // If not signed in, redirect to sign-in
      if (!isSignedIn) {
        router.push('/sign-in?redirect=/admin');
        return;
      }

      // Check if user is an admin
      const userIsAdmin = ADMIN_USER_IDS.includes(user.id);
      setIsAdmin(userIsAdmin);

      // If not an admin, redirect to home
      if (!userIsAdmin) {
        router.push('/');
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Show loading state while checking
  if (!isLoaded || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}
