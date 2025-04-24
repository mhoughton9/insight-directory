import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Inter } from 'next/font/google';
import traditionsService from '../services/api/traditions';
import teachersService from '../services/api/teachers';
import Link from 'next/link';

// Configure the Inter font
const inter = {
  variable: '--font-inter',
  subsets: ['latin']
};

// Resource types for the categories section with SVG icons
const resourceTypes = [
  {
    type: 'Book',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    ),
    description: 'Books on non-duality, spirituality, and awakening'
  },
  {
    type: 'Video Channel',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
      </svg>
    ),
    description: 'Talks, interviews, and guided meditations'
  },
  {
    type: 'Podcast',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
      </svg>
    ),
    description: 'Audio discussions and teachings'
  },
  {
    type: 'Website',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
    description: 'Websites dedicated to spiritual teachings'
  },
  {
    type: 'Blog',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    description: 'Essays and writings on spiritual topics'
  },
  {
    type: 'Practice',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
    ),
    description: 'Meditation and self-inquiry practices'
  },
  {
    type: 'App',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
    description: 'Mobile and desktop applications for spiritual growth'
  },
  {
    type: 'Retreat Center',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
    description: 'Places for in-person retreats and gatherings'
  }
];

// Lazy load components for better performance
const HeroSection = lazy(() => import('../components/home/HeroSection'));
const ResourceCategoriesSection = lazy(() => import('../components/home/ResourceCategoriesSection'));
const TraditionsTeachersSection = lazy(() => import('../components/home/TraditionsTeachersSection'));
const AboutSection = lazy(() => import('../components/home/AboutSection'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="w-full max-w-5xl mx-auto p-8 text-center">
    <p className="text-xl text-gray-600 dark:text-gray-300">Loading...</p>
  </div>
);

export default function Home() {
  // State for data from API
  const [traditions, setTraditions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API with improved error handling and caching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch traditions and teachers in parallel with cache options
        const [traditionsResponse, teachersResponse] = await Promise.all([
          traditionsService.getAll({ cache: true }),
          teachersService.getAll({ cache: true })
        ]);
        
        // Extract data from responses and ensure they're arrays
        const traditionsData = traditionsResponse?.traditions || traditionsResponse || [];
        const teachersData = teachersResponse?.teachers || teachersResponse || [];
        
        setTraditions(traditionsData);
        setTeachers(teachersData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Brand colors for consistent rendering
  const brandColors = [
    '#7c3aed', // Purple
    '#ec4899', // Pink
    '#f97316', // Orange
    '#0ea5e9'  // Blue
  ];

  // Handle error state
  if (error) {
    return (
      <div className={`${inter.variable} font-sans`}>
        <div className="w-full max-w-5xl mx-auto p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${inter.variable} font-sans`}>
      {/* Use Suspense for code splitting and lazy loading */}
      <Suspense fallback={<LoadingFallback />}>
        <HeroSection />
      </Suspense>

      {/* Loading State */}
      {loading ? (
        <LoadingFallback />
      ) : (
        <>
          {/* Resource Categories Section */}
          <Suspense fallback={<LoadingFallback />}>
            <ResourceCategoriesSection resourceTypes={resourceTypes} brandColors={brandColors} />
          </Suspense>

          {/* Traditions and Teachers Section */}
          <Suspense fallback={<LoadingFallback />}>
            <TraditionsTeachersSection 
              traditions={traditions} 
              teachers={teachers} 
              brandColors={brandColors} 
            />
          </Suspense>

          {/* Site Introduction */}
          <Suspense fallback={<LoadingFallback />}>
            <AboutSection />
          </Suspense>
        </>
      )}
    </div>
  );
}
