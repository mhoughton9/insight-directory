import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import traditionsService from '../../services/api/traditions';
import TraditionGrid from '../../components/traditions/TraditionGrid';

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
        
        // If no traditions found, use mock data
        if (traditionsData.length === 0) {
          setTraditions(generateMockTraditions());
        } else {
          setTraditions(traditionsData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching traditions:', err);
        setError('Failed to load traditions. Please try again later.');
        setLoading(false);
        
        // Use mock data in case of error
        setTraditions(generateMockTraditions());
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
          <h1 className="text-4xl font-medium text-neutral-900 dark:text-white mb-4" style={{ fontFamily: 'Lora, serif' }}>
            Traditions
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Explore spiritual traditions and paths that offer guidance on the journey to awakening.
          </p>
        </header>

        {error ? (
          <div className="w-full max-w-5xl mx-auto p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
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

/**
 * Generate mock tradition data for development and testing
 * @returns {Array} Array of mock tradition objects
 */
function generateMockTraditions() {
  return [
    {
      _id: 'tradition-1',
      name: 'Advaita Vedanta',
      description: 'A school of Hindu philosophy and religious practice emphasizing the oneness of Atman (soul) with Brahman (ultimate reality).',
      imageUrl: 'https://images.unsplash.com/photo-1518564747095-d2fbe3b08315?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      teachers: [
        { _id: 'teacher-1', name: 'Ramana Maharshi' },
        { _id: 'teacher-2', name: 'Nisargadatta Maharaj' }
      ]
    },
    {
      _id: 'tradition-2',
      name: 'Zen Buddhism',
      description: 'A tradition that emphasizes direct realization through meditation and mindful living, often using koans and zazen practice.',
      imageUrl: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      teachers: [
        { _id: 'teacher-3', name: 'Thich Nhat Hanh' },
        { _id: 'teacher-4', name: 'Shunryu Suzuki' }
      ]
    },
    {
      _id: 'tradition-3',
      name: 'Non-Duality',
      description: 'A contemporary approach to awakening that points to the fundamental non-separation between subject and object, self and other.',
      imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      teachers: [
        { _id: 'teacher-5', name: 'Rupert Spira' },
        { _id: 'teacher-6', name: 'Eckhart Tolle' }
      ]
    },
    {
      _id: 'tradition-4',
      name: 'Direct Path',
      description: 'An approach that directly investigates the nature of experience and consciousness, bypassing complex philosophical frameworks.',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      teachers: [
        { _id: 'teacher-7', name: 'Greg Goode' },
        { _id: 'teacher-8', name: 'Jean Klein' }
      ]
    },
    {
      _id: 'tradition-5',
      name: 'Dzogchen',
      description: 'A tradition within Tibetan Buddhism that focuses on discovering the "natural state" of mind, which is pure awareness.',
      imageUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      teachers: [
        { _id: 'teacher-9', name: 'Tenzin Wangyal Rinpoche' },
        { _id: 'teacher-10', name: 'Namkhai Norbu' }
      ]
    },
    {
      _id: 'tradition-6',
      name: 'Kashmir Shaivism',
      description: 'A non-dual tradition that recognizes all of reality as the divine play of consciousness and energy (Shiva and Shakti).',
      imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      teachers: [
        { _id: 'teacher-11', name: 'Swami Lakshmanjoo' },
        { _id: 'teacher-12', name: 'Sally Kempton' }
      ]
    },
    {
      _id: 'tradition-7',
      name: 'Sufism',
      description: 'The mystical dimension of Islam, focusing on direct experience of the divine through love, devotion, and inner practices.',
      imageUrl: 'https://images.unsplash.com/photo-1504198453758-3fab425087ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      teachers: [
        { _id: 'teacher-13', name: 'Rumi' },
        { _id: 'teacher-14', name: 'Llewellyn Vaughan-Lee' }
      ]
    },
    {
      _id: 'tradition-8',
      name: 'Christian Mysticism',
      description: 'The contemplative tradition within Christianity that emphasizes direct experience of God through prayer, silence, and surrender.',
      imageUrl: 'https://images.unsplash.com/photo-1548407260-da850faa41e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      teachers: [
        { _id: 'teacher-15', name: 'Thomas Merton' },
        { _id: 'teacher-16', name: 'Cynthia Bourgeault' }
      ]
    }
  ];
}
