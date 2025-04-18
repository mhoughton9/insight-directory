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
      <div className={`${inter.variable} font-sans bg-[#0F1A2A] text-white min-h-screen`}>
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
    <div className={`${inter.variable} font-sans bg-[#0F1A2A] text-white min-h-screen`}>
      <Head>
        <title>Dark Theme Preview | Insight Directory</title>
        <meta name="description" content="Preview of the dark theme for Insight Directory" />
      </Head>

      {/* Navigation Bar */}
      <nav className="border-b border-gray-800 bg-[#162436]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/dark-theme-preview" className="flex-shrink-0">
                <Image 
                  src="/images/Logo3.PNG" 
                  alt="Insight Directory" 
                  width={180} 
                  height={40} 
                  className="h-10 w-auto" 
                />
              </Link>
              
              {/* Main Navigation */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href="/dark-theme-preview" className="text-white hover:text-indigo-400 px-3 py-2 text-sm font-medium">
                  Home
                </Link>
                <Link href="#" className="text-gray-300 hover:text-indigo-400 px-3 py-2 text-sm font-medium">
                  Resources
                </Link>
                <Link href="#" className="text-gray-300 hover:text-indigo-400 px-3 py-2 text-sm font-medium">
                  Teachers
                </Link>
                <Link href="#" className="text-gray-300 hover:text-indigo-400 px-3 py-2 text-sm font-medium">
                  Traditions
                </Link>
              </div>
            </div>
            
            {/* Right Navigation */}
            <div className="flex items-center">
              <Link href="#" className="text-gray-300 hover:text-indigo-400 px-3 py-2 text-sm font-medium">
                Sign In
              </Link>
              <Link href="#" className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-6 md:py-10 px-4 max-w-7xl mx-auto bg-[#0F1A2A]">
        <div 
          className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-12 rounded-xl p-6 relative overflow-hidden"
        >
          {/* Logo Display - left side */}
          <div className="relative z-10 w-64 h-64 md:w-[28rem] md:h-[28rem] hover:scale-105 transition-transform duration-500 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0F1A2A] z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0F1A2A] z-10"></div>
            <Image 
              src="/images/Logo3.PNG" 
              alt="Insight Directory Logo" 
              fill
              className="object-contain z-0"
              priority
            />
          </div>
          
          {/* Content Side */}
          <div className="relative z-10 flex flex-col flex-1 justify-center md:justify-start items-center md:items-start md:pt-8">
            {/* Logo Words */}
            <div className="relative w-full h-24 md:h-48 mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white">INSIGHT <span className="block">DIRECTORY</span></h1>
            </div>
            
            <div className="w-full flex flex-col items-center md:items-start space-y-6">
              {/* Description Text */}
              <div className="w-full text-center md:text-left">
                <Heading 
                  as="h2"
                  size="3xl"
                  className="text-white max-w-xl mb-0 leading-relaxed font-semibold text-[1.2em]"
                >
                  A comprehensive collection of resources for those interested in spiritual awakening, non-duality, and self-inquiry.
                </Heading>
              </div>
              
              {/* Call to Action */}
              <div className="flex justify-center md:justify-start items-center w-full">
                <Link 
                  href="/sign-up" 
                  className="px-8 py-3 text-lg text-white rounded-md hover:shadow-md transition-all duration-300 font-bold inline-block transform hover:translate-y-[-2px] bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign up for free
                </Link>
              </div>
              
              {/* Subtitle text */}
              <div className="text-center md:text-left w-full">
                <Text 
                  size="md" 
                  className="text-gray-300 max-w-xl leading-relaxed"
                >
                  Create an account to save your favorite resources and help others on their spiritual journey.
                </Text>
              </div>
            </div>

            {/* Subtle color accents */}
            <div className="hidden md:block absolute -z-10 top-[30%] right-[10%] w-24 h-24 rounded-full bg-indigo-600 opacity-10"></div>
            <div className="hidden md:block absolute -z-10 bottom-[20%] left-[20%] w-32 h-32 rounded-full bg-indigo-400 opacity-10"></div>
          </div>
        </div>
      </section>

      {/* Resource Categories Section */}
      <section className="py-12 px-4 bg-[#162436] border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Heading as="h2" size="3xl" className="text-white mb-4">
              Resource Categories
            </Heading>
            <Text size="xl" className="text-gray-300 max-w-3xl mx-auto">
              Explore our collection of resources by category
            </Text>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {resourceTypes.map((resourceType, index) => (
              <Link 
                key={resourceType.type} 
                href={`/resources/type/${resourceType.type.toLowerCase().replace(' ', '-')}`}
                className="flex flex-col items-center p-6 bg-[#0F1A2A] border border-gray-800 rounded-lg hover:border-indigo-500 transition-all duration-300 hover:shadow-md hover:shadow-indigo-900/20"
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
                <Heading as="h3" size="lg" className="text-white mb-2 text-center">
                  {resourceType.type}
                </Heading>
                <Text size="sm" className="text-gray-300 text-center">
                  {resourceType.description}
                </Text>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Traditions and Teachers Section */}
      <section className="py-12 px-4 bg-[#0F1A2A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Traditions */}
            <div>
              <Heading as="h2" size="2xl" className="text-white mb-6">
                Traditions
              </Heading>
              <div className="space-y-4">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-gray-800 rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  traditions.slice(0, 3).map((tradition) => (
                    <Link 
                      key={tradition._id} 
                      href={`/traditions/${tradition.slug}`}
                      className="block p-4 bg-[#162436] border border-gray-800 rounded-lg hover:border-indigo-500 transition-all duration-300"
                    >
                      <Heading as="h3" size="lg" className="text-white mb-2">
                        {tradition.name}
                      </Heading>
                      <Text size="sm" className="text-gray-300">
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
                  className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center"
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
              <Heading as="h2" size="2xl" className="text-white mb-6">
                Teachers
              </Heading>
              <div className="space-y-4">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-24 bg-gray-800 rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  teachers.slice(0, 3).map((teacher) => (
                    <Link 
                      key={teacher._id} 
                      href={`/teachers/${teacher.slug}`}
                      className="block p-4 bg-[#162436] border border-gray-800 rounded-lg hover:border-indigo-500 transition-all duration-300"
                    >
                      <Heading as="h3" size="lg" className="text-white mb-2">
                        {teacher.name}
                      </Heading>
                      <Text size="sm" className="text-gray-300">
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
                  className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center"
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

      {/* About Section */}
      <section className="py-12 px-4 bg-[#162436] border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <Heading as="h2" size="2xl" className="text-white mb-6">
            About Insight Directory
          </Heading>
          <Text size="lg" className="text-gray-300 mb-8">
            Insight Directory is a curated collection of resources for those interested in spiritual awakening, non-duality, and self-inquiry. Our mission is to connect seekers with high-quality resources that support their journey of self-discovery.
          </Text>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/about" 
              className="px-6 py-2 bg-[#0F1A2A] border border-gray-800 text-white rounded-md hover:border-indigo-500 transition-all duration-300"
            >
              Learn More
            </Link>
            <Link 
              href="/contact" 
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Preview Notice */}
      <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-lg z-50">
        <p className="text-sm font-medium">Dark Theme Preview</p>
        <Link href="/" className="text-xs text-indigo-200 hover:text-white">Return to Current Site</Link>
      </div>
    </div>
  );
}
