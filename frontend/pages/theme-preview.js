import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Components
import { Heading, Text } from '../components/ui/Typography';
import ResourceCard from '../components/resources/ResourceCard';
import TeacherCard from '../components/teachers/TeacherCard';
import TraditionCard from '../components/traditions/TraditionCard';

/**
 * Theme Preview Page
 * A preview of the site with a new dark theme inspired by IndieHackers
 */
export default function ThemePreview() {
  const [featuredResources, setFeaturedResources] = useState([]);
  const [featuredTeachers, setFeaturedTeachers] = useState([]);
  const [featuredTraditions, setFeaturedTraditions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch featured content
  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        setIsLoading(true);
        
        // Fetch resources
        const resourcesRes = await fetch('/api/resources?limit=4');
        const resourcesData = await resourcesRes.json();
        
        // Fetch teachers
        const teachersRes = await fetch('/api/teachers?limit=3');
        const teachersData = await teachersRes.json();
        
        // Fetch traditions
        const traditionsRes = await fetch('/api/traditions?limit=3');
        const traditionsData = await traditionsRes.json();
        
        setFeaturedResources(resourcesData.resources || []);
        setFeaturedTeachers(teachersData.teachers || []);
        setFeaturedTraditions(traditionsData.traditions || []);
      } catch (error) {
        console.error('Error fetching featured content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedContent();
  }, []);
  
  return (
    <div className="min-h-screen bg-[#0E1217] text-white">
      <Head>
        <title>Theme Preview | Awakening Resources Directory</title>
        <meta name="description" content="Preview of the new dark theme for Awakening Resources Directory" />
      </Head>
      
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/theme-preview" className="flex-shrink-0">
                <Image 
                  src="/images/Logo5.png" 
                  alt="Awakening Resources Directory" 
                  width={180} 
                  height={40} 
                  className="h-10 w-auto" 
                />
              </Link>
              
              {/* Main Navigation */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href="/theme-preview" className="text-white hover:text-indigo-400 px-3 py-2 text-sm font-medium">
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
      <div className="bg-[#161B22] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">Awakening Resources</span>
              <span className="block text-indigo-400">Directory</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover resources, teachers, and traditions for spiritual awakening, non-duality, and self-inquiry.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                  Explore Resources
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Resources */}
      <div className="py-12 bg-[#0E1217]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <h2 className="text-base text-indigo-400 font-semibold tracking-wide uppercase">Discover</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              Featured Resources
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
              Explore our curated collection of books, videos, podcasts, and more.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              [...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-800 rounded-lg h-64 animate-pulse"></div>
              ))
            ) : (
              featuredResources.map(resource => (
                <div key={resource._id} className="transform transition duration-500 hover:scale-105">
                  <ResourceCard resource={resource} />
                </div>
              ))
            )}
          </div>
          
          <div className="mt-10 text-center">
            <Link href="#" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              View All Resources
              <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Featured Teachers & Traditions */}
      <div className="py-12 bg-[#161B22] border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Teachers Section */}
            <div>
              <div className="mb-8">
                <h2 className="text-base text-indigo-400 font-semibold tracking-wide uppercase">Learn From</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white">
                  Featured Teachers
                </p>
                <p className="mt-4 max-w-2xl text-xl text-gray-300">
                  Discover wisdom from contemporary and traditional teachers.
                </p>
              </div>
              
              <div className="space-y-6">
                {isLoading ? (
                  [...Array(3)].map((_, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg h-32 animate-pulse"></div>
                  ))
                ) : (
                  featuredTeachers.map(teacher => (
                    <div key={teacher._id} className="transform transition duration-500 hover:scale-105">
                      <TeacherCard teacher={teacher} />
                    </div>
                  ))
                )}
              </div>
              
              <div className="mt-8">
                <Link href="#" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  View All Teachers
                  <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Traditions Section */}
            <div>
              <div className="mb-8">
                <h2 className="text-base text-indigo-400 font-semibold tracking-wide uppercase">Explore</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white">
                  Featured Traditions
                </p>
                <p className="mt-4 max-w-2xl text-xl text-gray-300">
                  Discover various paths and approaches to awakening.
                </p>
              </div>
              
              <div className="space-y-6">
                {isLoading ? (
                  [...Array(3)].map((_, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg h-32 animate-pulse"></div>
                  ))
                ) : (
                  featuredTraditions.map(tradition => (
                    <div key={tradition._id} className="transform transition duration-500 hover:scale-105">
                      <TraditionCard tradition={tradition} />
                    </div>
                  ))
                )}
              </div>
              
              <div className="mt-8">
                <Link href="#" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  View All Traditions
                  <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to dive deeper?</span>
            <span className="block text-indigo-200">Create an account today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50">
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-[#0E1217] border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Image 
                src="/images/Logo5.png" 
                alt="Awakening Resources Directory" 
                width={150} 
                height={40} 
                className="h-8 w-auto" 
              />
              <p className="mt-4 text-gray-300">
                Connecting seekers with resources for spiritual awakening and self-discovery.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="#" className="text-gray-300 hover:text-white">Books</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white">Videos</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white">Podcasts</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white">Practices</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Explore</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="#" className="text-gray-300 hover:text-white">Teachers</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white">Traditions</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white">Topics</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white">About</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="#" className="text-gray-300 hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white">Terms</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} Awakening Resources Directory. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Preview Notice */}
      <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-lg">
        <p className="text-sm font-medium">Theme Preview</p>
        <Link href="/" className="text-xs text-indigo-200 hover:text-white">Return to Current Site</Link>
      </div>
    </div>
  );
}
