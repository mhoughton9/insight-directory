import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import teachersService from '../../services/api/teachers';
import TeacherGrid from '../../components/teachers/TeacherGrid';

/**
 * Teachers Page
 * Displays a grid of teachers with their images, names, and descriptions
 */
export default function TeachersPage() {
  // State for teachers data
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch teachers data
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await teachersService.getAll();
        
        // Extract data from response and ensure it's an array
        let teachersData = [];
        
        if (Array.isArray(response)) {
          teachersData = response;
        } else if (response && response.teachers && Array.isArray(response.teachers)) {
          teachersData = response.teachers;
        } else if (response && typeof response === 'object') {
          // If it's a single teacher object
          teachersData = [response];
        }
        
        // If no teachers found, use mock data
        if (teachersData.length === 0) {
          setTeachers(generateMockTeachers());
        } else {
          setTeachers(teachersData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teachers:', err);
        setError('Failed to load teachers. Please try again later.');
        setLoading(false);
        
        // Use mock data in case of error
        setTeachers(generateMockTeachers());
      }
    };
    
    fetchTeachers();
  }, []);

  return (
    <>
      <Head>
        <title>Teachers | Insight Directory</title>
        <meta name="description" content="Explore spiritual teachers and their teachings" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-medium text-neutral-900 dark:text-white mb-4" style={{ fontFamily: 'Lora, serif' }}>
            Teachers
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Explore spiritual teachers from various traditions who offer guidance on the path to awakening.
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
          <TeacherGrid teachers={teachers} isLoading={loading} />
        )}
      </div>
    </>
  );
}

/**
 * Generate mock teacher data for development and testing
 * @returns {Array} Array of mock teacher objects
 */
function generateMockTeachers() {
  return [
    {
      _id: 'teacher-1',
      name: 'Eckhart Tolle',
      biography: 'Author of "The Power of Now" who teaches presence and spiritual awakening.',
      imageUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      traditions: [
        { _id: 'trad-1', name: 'Non-duality' },
        { _id: 'trad-2', name: 'Contemporary Spirituality' }
      ]
    },
    {
      _id: 'teacher-2',
      name: 'Adyashanti',
      biography: 'Zen teacher known for direct, experiential teachings on awakening.',
      imageUrl: 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      traditions: [
        { _id: 'trad-3', name: 'Zen Buddhism' },
        { _id: 'trad-1', name: 'Non-duality' }
      ]
    },
    {
      _id: 'teacher-3',
      name: 'Rupert Spira',
      biography: 'British teacher exploring the nature of experience and consciousness.',
      imageUrl: 'https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      traditions: [
        { _id: 'trad-1', name: 'Non-duality' },
        { _id: 'trad-4', name: 'Advaita Vedanta' }
      ]
    },
    {
      _id: 'teacher-4',
      name: 'Mooji',
      biography: 'Offers direct guidance on self-realization through self-inquiry.',
      imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      traditions: [
        { _id: 'trad-4', name: 'Advaita Vedanta' },
        { _id: 'trad-1', name: 'Non-duality' }
      ]
    },
    {
      _id: 'teacher-5',
      name: 'Tara Brach',
      biography: 'Psychologist integrating Western psychology with Eastern spiritual practices.',
      imageUrl: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      traditions: [
        { _id: 'trad-5', name: 'Buddhism' },
        { _id: 'trad-6', name: 'Mindfulness' }
      ]
    },
    {
      _id: 'teacher-6',
      name: 'Ram Dass',
      biography: 'Spiritual teacher known for bridging Eastern spirituality with Western minds.',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      traditions: [
        { _id: 'trad-7', name: 'Hinduism' },
        { _id: 'trad-8', name: 'Bhakti Yoga' }
      ]
    },
    {
      _id: 'teacher-7',
      name: 'Pema Chödrön',
      biography: 'Buddhist nun known for accessible teachings on meditation and compassion.',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      traditions: [
        { _id: 'trad-9', name: 'Tibetan Buddhism' },
        { _id: 'trad-10', name: 'Shambhala Buddhism' }
      ]
    },
    {
      _id: 'teacher-8',
      name: 'Thich Nhat Hanh',
      biography: 'Zen monk teaching mindfulness and engaged Buddhism for everyday life.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      traditions: [
        { _id: 'trad-3', name: 'Zen Buddhism' },
        { _id: 'trad-6', name: 'Mindfulness' }
      ]
    }
  ];
}
