import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import teachersService from '../../services/api/teachers';
import TeacherGrid from '../../components/teachers/TeacherGrid';
import { Heading, Text } from '../../components/ui/Typography';

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
        
        setTeachers(teachersData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load teachers. Please try again later.');
        setLoading(false);
        setTeachers([]);
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
          <Heading as="h1" size="2xl" className="mb-4">
            Teachers
          </Heading>
          <Text 
            size="lg" 
            className="max-w-3xl mx-auto" 
            style={{ color: 'var(--text-secondary)' }} 
          >
            Explore spiritual teachers from various traditions who offer guidance on the path to awakening.
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
          <TeacherGrid teachers={teachers} isLoading={loading} />
        )}
      </div>
    </>
  );
}
