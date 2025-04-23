import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import traditionsService from '../../services/api/traditions';
import TraditionGrid from '../../components/traditions/TraditionGrid';
import { Heading, Text } from '../../components/ui/Typography';

/**
 * Traditions Page
 * Displays a grid of spiritual traditions with their images, names, and descriptions
 */
export default function TraditionsPage() {
  // State for traditions data
  const [traditions, setTraditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch traditions data
  useEffect(() => {
    const fetchTraditions = async () => {
      try {
        setLoading(true);
        const response = await traditionsService.getAll();
        
        // Extract data from response and ensure it's an array
        let traditionsData = [];
        
        if (Array.isArray(response)) {
          traditionsData = response;
        } else if (response && response.traditions && Array.isArray(response.traditions)) {
          traditionsData = response.traditions;
        } else if (response && typeof response === 'object') {
          // If it's a single tradition object
          traditionsData = [response];
        }
        
        setTraditions(traditionsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load traditions. Please try again later.');
        setLoading(false);
        setTraditions([]);
      }
    };
    
    fetchTraditions();
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
          <TraditionGrid traditions={traditions} isLoading={loading} />
        )}
      </div>
    </>
  );
}
