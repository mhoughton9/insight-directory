import { useEffect, useState } from 'react';
import { useUserContext } from '../../contexts/UserContext';
import { HeartIcon } from 'lucide-react';
import { useRouter } from 'next/router';

/**
 * FavoriteButton component for toggling favorite status of resources, teachers, and traditions
 * @param {Object} props
 * @param {string} props.type - The type of item (resource, teacher, tradition)
 * @param {string} props.id - The ID of the item
 * @param {string} [props.size='default'] - Size of the button (small, default, large)
 * @param {boolean} [props.showText=false] - Whether to show text next to the icon
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {Function} [props.onError] - Optional callback for error handling
 */
const FavoriteButton = ({ 
  type, 
  id, 
  size = 'default', 
  showText = false, 
  className = '',
  onError
 }) => {
  const { isSignedIn, isItemFavorited, toggleFavorite, isItemPending, favorites } = useUserContext();
  const router = useRouter();
  
  // Get the current favorite state - include the favorites dependency to ensure re-renders
  const isFavorited = isItemFavorited(type, id);
  
  // Get the pending state
  const isPending = isItemPending(type, id);
  
  // Local error state
  const [error, setError] = useState(null);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  /**
   * Handle the toggle favorite action
   */
  const handleToggleFavorite = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (!isSignedIn) {
      // Redirect to sign-up page instead of just showing an error
      router.push('/sign-up');
      return;
    }

    if (isPending) return; // Prevent multiple clicks during pending state
    
    try {
      // Call API through UserContext
      const success = await toggleFavorite(type, id);
      
      if (!success) {
        setError('Failed to update favorite status');
        if (onError) onError('Failed to update favorite status');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to update favorite status';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    }
  };

  // Size classes - adjusted for better mobile responsiveness
  const sizeClasses = {
    small: 'h-4 w-4 sm:h-5 sm:w-5',
    default: 'h-5 w-5 sm:h-6 sm:w-6',
    large: 'h-6 w-6 sm:h-8 sm:w-8'
  };

  // Determine button styles - use a simpler approach with explicit colors
  const buttonClasses = `
    inline-flex items-center justify-center
    ${isPending ? 'opacity-70 cursor-wait' : 'cursor-pointer'}
    ${error ? 'ring-2 ring-red-300' : ''}
    transition-colors duration-200 ease-in-out focus:outline-none
    ${className}
  `;

  // Determine icon color based on favorited state
  const iconColor = isFavorited ? 'text-red-500' : 'text-gray-700';

  return (
    <div className="relative">
      <button
        onClick={handleToggleFavorite}
        className={buttonClasses}
        disabled={isPending}
        aria-label={isFavorited ? `Remove from favorites` : `Add to favorites`}
        title={!isSignedIn ? 'Sign in to add to favorites' : (isFavorited ? 'Remove from favorites' : 'Add to favorites')}
      >
        {isPending ? (
          <div className="animate-pulse">
            <HeartIcon 
              className={`${sizeClasses[size] || sizeClasses.default} ${isFavorited ? 'fill-current' : ''} ${iconColor}`}
            />
          </div>
        ) : (
          <HeartIcon 
            className={`${sizeClasses[size] || sizeClasses.default} ${isFavorited ? 'fill-current' : ''} ${iconColor}`}
          />
        )}
        {showText && (
          <span className={`ml-2 text-sm sm:text-base font-medium ${isFavorited ? 'text-red-500' : 'text-gray-700'}`}>
            {isFavorited ? 'Favorited' : 'Favorite'}
          </span>
        )}
      </button>
      
      {error && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-red-100 text-red-800 text-xs rounded-md whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
};

export default FavoriteButton;