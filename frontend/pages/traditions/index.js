import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import traditionsService from '../../services/api/traditions';
import TraditionGrid from '../../components/traditions/TraditionGrid';
import { Heading, Text } from '../../components/ui/Typography';
import SortDropdown from '../../components/ui/SortDropdown';
import SearchInput from '../../components/ui/SearchInput';
import RandomizeButton from '../../components/ui/RandomizeButton';
import { shuffleArray } from '../../utils/arrayUtils';

/**
 * Traditions Page
 * Displays a grid of spiritual traditions with searching, sorting, and shuffling.
 */
export default function TraditionsPage() {
  // State for data fetching and management
  const [allItems, setAllItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for UI controls
  const [currentSortKey, setCurrentSortKey] = useState('name_asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [shuffleTrigger, setShuffleTrigger] = useState(0);

  // Fetch initial data
  useEffect(() => {
    const fetchTraditions = async () => {
      try {
        setLoading(true);
        const response = await traditionsService.getAll();

        let traditionsData = [];
        if (response && response.traditions && Array.isArray(response.traditions)) {
          traditionsData = response.traditions;
        } else {
          console.warn('Unexpected data format received from traditionsService.getAll:', response);
        }

        setAllItems(traditionsData);
        setDisplayedItems(traditionsData);
        setError(null);
      } catch (err) {
        console.error('Failed to load traditions:', err);
        setError('Failed to load traditions. Please try again later.');
        setAllItems([]);
        setDisplayedItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTraditions();
  }, []);

  // Define sort options
  const sortOptions = useMemo(() => [
    { key: 'name_asc', label: 'Name (A-Z)' },
    { key: 'name_desc', label: 'Name (Z-A)' },
  ], []);

  // Effect to filter, sort, and shuffle items based on controls
  useEffect(() => {
    let processed = [...allItems];

    // 1. Filter by search term (case-insensitive)
    if (searchTerm) {
      processed = processed.filter(tradition =>
        tradition.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Shuffle or Sort
    if (currentSortKey === 'random') {
      shuffleArray(processed);
    } else {
      processed.sort((a, b) => {
        const [field, direction] = currentSortKey.split('_'); // Should always be 'name'
        const valA = a[field] || '';
        const valB = b[field] || '';
        const compare = valA.localeCompare(valB, undefined, { sensitivity: 'base' });
        return direction === 'asc' ? compare : -compare;
      });
    }

    setDisplayedItems(processed);

  }, [allItems, currentSortKey, searchTerm, shuffleTrigger]);

  // --- Handlers for UI controls ---
  const handleSortChange = useCallback((selectedKey) => {
    setCurrentSortKey(selectedKey);
  }, []);

  const handleSearchChange = useCallback((newValue) => {
    setSearchTerm(newValue);
  }, []);

  const handleRandomize = useCallback(() => {
    setCurrentSortKey('random');
    setShuffleTrigger(prev => prev + 1);
  }, []);

  return (
    <>
      <Head>
        <title>Traditions | Insight Directory</title>
        <meta name="description" content="Explore spiritual traditions and paths to awakening" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10 text-center">
          <Heading as="h1" size="2xl" className="mb-4">
            Traditions
          </Heading>
          <Text
            size="lg"
            className="max-w-3xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Explore spiritual traditions and paths that offer guidance on the journey to awakening.
          </Text>
        </header>

        {/* Controls Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4"> {/* Group sort/shuffle on left */}
            <SortDropdown
              options={sortOptions}
              value={currentSortKey}
              onChange={handleSortChange}
            />
            <RandomizeButton onClick={handleRandomize} />
          </div>
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search traditions by name..."
            className="w-full sm:w-64" /* Search on right */
          />
        </div>

        {/* Display Area */}
        {error ? (
          <div className="w-full max-w-5xl mx-auto p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-lg">
            <Text size="xl" className="text-red-600 dark:text-red-400">{error}</Text>
            <button
              onClick={() => window.location.reload()} // Simple retry
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <TraditionGrid traditions={displayedItems} isLoading={loading} />
        )}
      </div>
    </>
  );
}
