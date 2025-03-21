import { useEffect } from 'react';
import { useUserContext } from '../../contexts/UserContext';
import { HeartIcon } from 'lucide-react';

/**
 * FavoriteButton component for toggling favorite status of resources, teachers, and traditions
 * @param {Object} props
 * @param {string} props.type - The type of item (resource, teacher, tradition)
 * @param {string} props.id - The ID of the item
 * @param {string} [props.size='default'] - Size of the button (small, default, large)
 * @param {boolean} [props.showText=false] - Whether to show text next to the icon
 * @param {string} [props.className=''] - Additional CSS classes
 */
const FavoriteButton = ({ type, id, size = 'default', showText = false, className = '' }) => {
  const { isSignedIn, isItemFavorited, toggleFavorite, isItemPending } = useUserContext();
  
  // Get the current favorite state
  const isFavorited = isItemFavorited(type, id);
  
  // Get the pending state
  const isPending = isItemPending(type, id);

  // Handle favorite toggle
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      // If not signed in, we could add a callback to redirect to sign-in page
      // or trigger a sign-in modal
      console.log('User needs to sign in to favorite items');
      return;
    }

    if (isPending) return; // Prevent multiple clicks during pending state
    
    // Call API through UserContext - action is determined automatically by the context
    await toggleFavorite(type, id);
  };

  // Size classes - adjusted for better mobile responsiveness
  const sizeClasses = {
    small: 'h-5 w-5 sm:h-6 sm:w-6',
    default: 'h-6 w-6 sm:h-8 sm:w-8',
    large: 'h-8 w-8 sm:h-10 sm:w-10'
  };

  // Determine button styles
  const buttonClasses = `
    inline-flex items-center justify-center rounded-full 
    ${isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-500'} 
    ${isPending ? 'opacity-70 cursor-wait' : 'cursor-pointer'}
    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
    ${className}
  `;

  return (
    <button
      onClick={handleToggleFavorite}
      className={buttonClasses}
      disabled={isPending || !isSignedIn}
      aria-label={isFavorited ? `Remove from favorites` : `Add to favorites`}
      title={!isSignedIn ? 'Sign in to add to favorites' : (isFavorited ? 'Remove from favorites' : 'Add to favorites')}
    >
      {isPending ? (
        <div className="animate-pulse">
          <HeartIcon 
            className={`${sizeClasses[size] || sizeClasses.default} ${isFavorited ? 'fill-current' : ''}`}
          />
        </div>
      ) : (
        <HeartIcon 
          className={`${sizeClasses[size] || sizeClasses.default} ${isFavorited ? 'fill-current' : ''}`}
        />
      )}
      {showText && (
        <span className="ml-2 text-sm sm:text-base">
          {isFavorited ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;