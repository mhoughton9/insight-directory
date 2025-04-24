import { useState, useEffect, useMemo, useCallback } from 'react'; 
import { useRouter } from 'next/router';
import Head from 'next/head';
import resourcesService from '../../../services/api/resources';
import { formatResourceType, normalizeResourceType, getPluralResourceType } from '../../../utils/resource-utils';
import { Heading, Text } from '../../../components/ui/Typography';
import { shuffleArray } from '../../../utils/array-utils'; 

// Components
import ResourceGrid from '../../../components/resources/ResourceGrid';
import BookListLayout from '../../../components/resources/BookListLayout';
import SortDropdown from '../../../components/ui/SortDropdown'; 
import RandomizeButton from '../../../components/ui/RandomizeButton'; 
import SearchInput from '../../../components/ui/SearchInput'; 

/**
 * Resource Type Page
 * Displays resources of a specific type with sorting, filtering, and randomization.
 */
export default function ResourceTypePage() {
  const router = useRouter();
  const { slug } = router.query;
  const type = slug ? normalizeResourceType(slug) : ''; 
  const formattedTypeName = formatResourceType(type);
  const pluralTypeName = getPluralResourceType(type);
  
  // State for all resources fetched from API
  const [allItems, setAllItems] = useState([]);
  // State for resources currently displayed (after filtering/sorting/shuffling)
  const [displayedItems, setDisplayedItems] = useState([]);
  // State for loading/error
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for UI controls
  const [currentSortKey, setCurrentSortKey] = useState('title_asc'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [shuffleTrigger, setShuffleTrigger] = useState(0); // New state for shuffle trigger
  
  // Define sort options based on resource type (example for books)
  // TODO: Define options dynamically based on 'type' if needed
  const sortOptions = useMemo(() => {
    // Determine the label for the primary identifier (Title or Name)
    const nameTypes = [
      'website', 'app', 'retreatCenter', 
      'videoChannel', 'podcast', 'blog', 'practice'
    ];
    const titleOrNameLabel = nameTypes.includes(type) ? 'Name' : 'Title';

    const baseOptions = [
      { key: 'title_asc', label: `${titleOrNameLabel} (A-Z)` },
      { key: 'title_desc', label: `${titleOrNameLabel} (Z-A)` },
    ];

    let finalOptions = [...baseOptions];
    let creatorLabel = '';

    // Determine the appropriate label based on type
    if (type === 'book') {
      creatorLabel = 'Author';
    } else if (['podcast', 'videoChannel', 'blog'].includes(type)) {
      creatorLabel = 'Creator';
    }

    // Add creator/author sort options only if a label was determined
    if (creatorLabel) {
      finalOptions = [
        ...finalOptions,
        { key: 'creator_asc', label: `${creatorLabel} (A-Z)` },
        { key: 'creator_desc', label: `${creatorLabel} (Z-A)` },
      ];
    }

    return finalOptions;
  }, [type]);

  // Fetch ALL resources of this type on initial load or type change
  useEffect(() => {
    if (!router.isReady || !type) return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setAllItems([]); 
        setDisplayedItems([]);
        
        // Backend defaults to title_asc sort if 'sort' is omitted
        // Pass { cache: false } to disable client-side caching for this request
        const response = await resourcesService.getAll({ type }, { cache: false }); 
        
        const fetchedResources = response.resources || [];
        
        setAllItems(fetchedResources); 
        // Initial display will be handled by the processing effect
        
      } catch (err) {
        console.error('Error fetching resources:', err); 
        setError(`Failed to load ${pluralTypeName.toLowerCase()}. Please try again later.`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [router.isReady, type]);

  // Process items whenever allItems, sort key, or search term changes
  useEffect(() => {
    let processed = [...allItems];

    // 1. Filter based on search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      processed = processed.filter(item => {
        const titleMatch = item.title && item.title.toLowerCase().includes(lowerSearchTerm);
        // Check if any name in the creator array matches the search term
        const creatorMatch = item.creator && Array.isArray(item.creator) && 
                           item.creator.some(name => name && name.toLowerCase().includes(lowerSearchTerm));
        return titleMatch || creatorMatch;
      });
    }

    // 2. Sort or Shuffle based on current sort key
    if (currentSortKey === 'random') {
      // Shuffle the filtered items
      shuffleArray(processed);
    } else {
      // Sort the filtered items
      processed.sort((a, b) => {
        const [field, direction] = currentSortKey.split('_');
        const dir = direction === 'asc' ? 1 : -1;

        let valA, valB;

        switch (field) {
          case 'title':
            valA = a.title || '';
            valB = b.title || '';
            return valA.localeCompare(valB) * dir;
          case 'creator': 
            // Sort by the first creator's name, handle empty/missing arrays
            valA = (a.creator && a.creator.length > 0) ? (a.creator[0] || '') : '';
            valB = (b.creator && b.creator.length > 0) ? (b.creator[0] || '') : '';
            return valA.localeCompare(valB) * dir;
          default:
            return 0;
        }
      });
    }

    setDisplayedItems(processed);

  }, [allItems, currentSortKey, searchTerm, shuffleTrigger]); // Added shuffleTrigger to dependencies

  // --- Handlers for UI controls --- 

  const handleSortChange = useCallback((newSortKey) => {
    setCurrentSortKey(newSortKey);
    // Effect hook will handle re-sorting
  }, []);

  const handleSearchChange = useCallback((newValue) => { 
    setSearchTerm(newValue); 
    // Effect hook will handle re-filtering
  }, []);

  // Handle Randomize Button Click
  const handleRandomize = useCallback(() => {
    setCurrentSortKey('random'); // Set sort key to trigger shuffle in effect
    setShuffleTrigger(prev => prev + 1); // Increment trigger to force re-shuffle
  }, []); 

  // Handle loading state
  if (!router.isReady || (!type && !isLoading)) { 
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{pluralTypeName || 'Resources'} | Insight Directory</title>
        <meta 
          name="description" 
          content={`Browse this comprehensive collection of ${pluralTypeName ? pluralTypeName.toLowerCase() : 'resources'} for awakening, non-duality, and self-inquiry.`} 
        />
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10 text-center">
          <Heading as="h1" size="4xl" className="mb-4">
            {pluralTypeName || 'Resources'}
          </Heading>
          <Text size="lg" className="max-w-3xl mx-auto">
            Browse this comprehensive collection of {pluralTypeName ? pluralTypeName.toLowerCase() : 'resources'} about awakening, non-duality, and self-inquiry.
          </Text>
          {/* Updated count display */}
          {allItems.length > 0 && !isLoading && (
            <Text 
              size="md" 
              className="mt-2" 
              style={{ color: 'var(--text-secondary)' }} 
            >
              Showing {displayedItems.length} of {allItems.length} {allItems.length === 1 ? formattedTypeName.toLowerCase() : pluralTypeName.toLowerCase()}
              {searchTerm && ` (filtered by "${searchTerm}")`}
            </Text>
          )}
        </header>

        {/* --- Controls Section --- */} 
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <SortDropdown 
              options={sortOptions}
              value={currentSortKey}
              onChange={handleSortChange}
              ariaLabel={`Sort ${pluralTypeName}`}
              className="w-48"
            />
            <RandomizeButton 
              onClick={handleRandomize} 
              ariaLabel={`Randomize ${pluralTypeName}`} 
            />
          </div>
          <div className="w-full sm:w-64">
            <SearchInput 
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={`Search ${pluralTypeName}...`}
              ariaLabel={`Search ${pluralTypeName}`}
            />
          </div>
        </div>

        {error ? (
          <div className="w-full max-w-5xl mx-auto p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-lg">
            <Text size="xl" className="text-red-600 dark:text-red-400">{error}</Text>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Pass displayedItems to the list/grid */} 
            {type === 'book' ? (
              <BookListLayout resources={displayedItems} isLoading={isLoading} />
            ) : (
              <ResourceGrid resources={displayedItems} isLoading={isLoading} />
            )}
            
            {/* Pagination controls removed */} 
            {/* {totalPages > 1 && (...)} */} 
          </>
        )}
      </div>
    </>
  );
}

// Need to define or import shuffleArray utility
// Example placeholder:
// const shuffleArray = (array) => { 
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
// };
