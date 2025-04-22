import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Heading, Text } from '../components/ui/Typography';
import traditionsService from '../services/api/traditions';
import teachersService from '../services/api/teachers';

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

// Loading fallback component
const LoadingFallback = () => (
  <div className="w-full max-w-5xl mx-auto p-8 text-center">
    <p className="text-xl text-gray-300">Loading...</p>
  </div>
);

export default function DarkThemePreview() {
  // State for data from API
  const [traditions, setTraditions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API with improved error handling and caching
  useEffect(() => {
    // Fetch traditions and teachers data
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
        
        setTraditions(traditionsData.slice(0, 3));
        setTeachers(teachersData.slice(0, 3));
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
      <div className={`${inter.variable} font-sans navy-theme`}>
        <div className="w-full max-w-5xl mx-auto p-8 text-center bg-red-900/20 rounded-lg">
          <p className="text-xl text-red-400">{error}</p>
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
    <div className={`${inter.variable} font-sans navy-theme`}>
      <Head>
        <title>Dark Theme Preview | Insight Directory</title>
        <meta name="description" content="Preview of the dark theme for Insight Directory" />
      </Head>

      {/* Navigation Bar */}
      <nav className="bg-[var(--theme-bg-secondary)] py-2 border-b border-[var(--theme-border-divider)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center">
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
                      src="/images/Logo4_Words_no_bg.png"
                      alt="Insight Directory"
                      width={130}
                      height={30}
                      className="h-auto w-auto max-w-[130px]"
                    />
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/teachers" className="text-[var(--theme-text-primary)] opacity-80 hover:opacity-100 font-medium">Teachers</Link>
              <Link href="/traditions" className="text-[var(--theme-text-primary)] opacity-80 hover:opacity-100 font-medium">Traditions</Link>
              <Link href="/about" className="text-[var(--theme-text-primary)] opacity-80 hover:opacity-100 font-medium">About</Link>
              <Link href="/suggest" className={`px-4 py-1 border border-[rgba(255,255,255,0.3)] rounded-md font-medium text-[var(--theme-text-primary)] bg-transparent hover:bg-[var(--theme-surface-hover)]`}>Suggest a Resource</Link>
              <Link href="/signin" className="text-[var(--theme-text-primary)] opacity-80 hover:opacity-100 font-medium">Sign in</Link>
              <Link 
                href="/signup" 
                className="px-4 py-1 text-white rounded-md font-medium transition-all duration-200 ease-in-out hover:brightness-110"
                style={{ background: 'var(--theme-gradient-button)' }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`py-12 md:py-20 bg-[var(--theme-bg-primary)] w-full`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
            {/* Logo Display - left side */}
            <div className="w-80 h-80 md:w-96 md:h-96 flex-shrink-0 relative">
              <Image 
                src="/images/logo.png" 
                alt="Insight Directory Logo" 
                width={384}
                height={384}
                priority
                className="object-contain"
              />
            </div>
            {/* Content Side */}
            <div className="flex flex-col flex-1 justify-center items-center md:items-start">
              {/* Logo Words */}
              <div className="mb-6">
                <Image
                  src="/images/Logo4_Words_no_bg.png"
                  alt="Insight Directory"
                  width={400}
                  height={100}
                  className="h-auto w-auto max-w-[400px]"
                />
              </div>
              
              {/* Description Text */}
              <div className="w-full text-center md:text-left mb-6">
                <p className={`text-lg md:text-xl mb-2 text-[var(--theme-text-primary)] max-w-xl`}>
                  A comprehensive collection of resources for those interested in spiritual awakening, non-duality, and self-inquiry.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row justify-center md:justify-start mb-4">
                <Link 
                  href="/resources" 
                  className="px-4 py-2 text-white rounded-md font-medium transition-all duration-200 ease-in-out hover:brightness-110"
                  style={{ background: 'var(--theme-gradient-button)' }}
                >
                  Explore Resources
                </Link>
                <Link 
                  href="/about" 
                  className={`ml-4 px-4 py-2 border border-[rgba(255,255,255,0.3)] text-[var(--theme-text-primary)] rounded-md hover:bg-[var(--theme-surface-hover)] bg-transparent`}>
                  Learn More
                </Link>
              </div>

              {/* Helper Text */}
              <div className="text-center md:text-left">
                <Text 
                  size="md" 
                  className="text-[var(--theme-text-primary)] opacity-80 max-w-xl">
                  Create an account to save your favorite resources and help others on their spiritual journey.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Categories Section */}
      <section className={`py-12 px-4 bg-[var(--theme-bg-secondary)]`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className={`mb-4 text-[var(--theme-text-primary)]`}>
              Resource Categories
            </Heading>
            <Text size="xl" className="text-[var(--theme-text-secondary)]">
              Explore our collection of resources by category
            </Text>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {resourceTypes.map((resourceType, index) => (
              <Link 
                key={resourceType.type} 
                href={`/resources/type/${resourceType.type.toLowerCase().replace(' ', '-')}`}
                className={`flex flex-col items-center p-6 transition-all duration-300 bg-[var(--theme-surface-primary)] border border-[var(--theme-border-subtle)] rounded-lg hover:bg-[var(--theme-surface-hover)]`}
              >
                <div 
                  className="w-12 h-12 flex items-center justify-center rounded-full mb-4"
                  style={{ 
                    backgroundColor: `${brandColors[index % brandColors.length]}20`,
                    color: brandColors[index % brandColors.length]
                  }}
                >
                  {resourceType.icon}
                </div>
                <Heading as="h3" size="lg" className="text-[var(--theme-text-primary)] mb-2 text-center">
                  {resourceType.type}
                </Heading>
                <Text size="md" className="text-[var(--theme-text-secondary)] text-center">
                  {resourceType.description}
                </Text>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Traditions and Teachers Section */}
      <section className={`py-12 px-4 bg-[var(--theme-surface-primary)]`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Traditions */}
            <div>
              <div className="text-center mb-6">
                <Heading as="h2" size="2xl" className={`mb-4 text-[var(--theme-text-primary)]`}>
                  Traditions
                </Heading>
                <Text size="lg" className="text-[var(--theme-text-secondary)]">
                  Explore spiritual traditions from around the world
                </Text>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-[var(--theme-surface-secondary)] rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  traditions.slice(0, 3).map((tradition) => (
                    <Link 
                      key={tradition._id} 
                      href={`/traditions/${tradition.slug}`}
                      className={`block p-4 transition-all duration-300 bg-[var(--theme-surface-secondary)] rounded-lg`}
                    >
                      <Heading as="h3" size="lg" className="text-[var(--theme-text-primary)] mb-2">
                        {tradition.name}
                      </Heading>
                      <Text size="sm" className="text-[var(--theme-text-secondary)]">
                        {tradition.description ? (
                          tradition.description.length > 120 ? 
                            `${tradition.description.substring(0, 120)}...` : 
                            tradition.description
                        ) : 'Explore this tradition'}
                      </Text>
                    </Link>
                  ))
                )}
              </div>
              <div className="mt-6">
                <Link 
                  href="/traditions" 
                  className="text-[var(--theme-text-primary)] hover:text-[var(--theme-text-primary)] font-medium inline-flex items-center"
                >
                  View all traditions
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            {/* Teachers */}
            <div>
              <div className="text-center mb-6">
                <Heading as="h2" size="2xl" className={`mb-4 text-[var(--theme-text-primary)]`}>
                  Teachers
                </Heading>
                <Text size="lg" className="text-[var(--theme-text-secondary)]">
                  Learn from awakened masters and guides
                </Text>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-[var(--theme-surface-secondary)] rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  teachers.slice(0, 3).map((teacher) => (
                    <Link 
                      key={teacher._id} 
                      href={`/teachers/${teacher.slug}`}
                      className={`block p-4 transition-all duration-300 bg-[var(--theme-surface-secondary)] rounded-lg`}
                    >
                      <Heading as="h3" size="lg" className="text-[var(--theme-text-primary)] mb-2">
                        {teacher.name}
                      </Heading>
                      <Text size="sm" className="text-[var(--theme-text-secondary)]">
                        {teacher.biography ? (
                          teacher.biography.length > 120 ? 
                            `${teacher.biography.substring(0, 120)}...` : 
                            teacher.biography
                        ) : 'Learn about this teacher'}
                      </Text>
                    </Link>
                  ))
                )}
              </div>
              <div className="mt-6">
                <Link 
                  href="/teachers" 
                  className="text-[var(--theme-text-primary)] hover:text-[var(--theme-text-primary)] font-medium inline-flex items-center"
                >
                  View all teachers
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-[var(--theme-border-divider)] w-full"></div>

      {/* About Section */}
      <section className={`py-16 bg-[var(--theme-bg-secondary)]`}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className={`text-3xl font-bold mb-6 text-[var(--theme-text-primary)]`}>
            About This Directory
          </h2>
          <p className={`mb-8 text-[var(--theme-text-secondary)]`}>
            This directory aims to be a comprehensive collection of resources for those interested in
            spiritual awakening, non-duality, and self-inquiry. Whether you're new to these topics or have
            been exploring them for years, you'll find valuable resources to support your journey.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link 
              href="/about" 
              className="px-4 py-2 text-white rounded-md font-medium transition-all duration-200 ease-in-out hover:brightness-110"
              style={{ background: 'var(--theme-gradient-button)' }}
            >
              Learn more about us
            </Link>
          </div>
        </div>
      </section>

      {/* Preview Notice */}
      <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 bg-[var(--theme-gradient-button)] text-white`}>
        <p className="text-sm font-medium">Dark Theme Preview</p>
        <Link href="/" className={`text-xs text-[var(--theme-text-secondary)] hover:text-white`}>Return to Current Site</Link>
      </div>
    </div>
  );
}
