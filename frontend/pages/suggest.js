import React, { useState } from 'react';
import Head from 'next/head';
import { Heading, Text } from '../components/ui/Typography';

/**
 * Resource suggestion form component
 * Allows users to suggest new resources to be added to the directory
 */
export default function SuggestResourcePage() {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    link: '',
    creator: '',
    email: '',
    additionalInfo: ''
  });
  
  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  // Resource types matching the types used in the rest of the application
  const resourceTypes = [
    'Book',
    'Video Channel',
    'Podcast',
    'Website',
    'Blog',
    'Practice',
    'App',
    'Retreat Center'
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.type || !formData.description) {
      setSubmitStatus({
        submitted: true,
        success: false,
        message: 'Please fill out all required fields.'
      });
      return;
    }

    try {
      // In a real implementation, this would send data to an API endpoint
      // For now, we'll just simulate a successful submission
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success state
      setSubmitStatus({
        submitted: true,
        success: true,
        message: 'Thank you for your suggestion! We will review it soon.'
      });
      
      // Reset form
      setFormData({
        title: '',
        type: '',
        description: '',
        link: '',
        creator: '',
        email: '',
        additionalInfo: ''
      });
      
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setSubmitStatus({
        submitted: true,
        success: false,
        message: 'There was an error submitting your suggestion. Please try again later.'
      });
    }
  };

  return (
    <>
      <Head>
        <title>Suggest a Resource - Insight Directory</title>
        <meta name="description" content="Suggest a resource to be added to the Insight Directory." />
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Heading as="h1" size="4xl" className="mb-8 text-center">
          Suggest a Resource
        </Heading>
        
        <Text size="lg" className="mb-8 text-center">
          Know of a valuable resource for spiritual awakening, non-duality, or self-inquiry? 
          Please share it with us, and we'll consider adding it to the directory.
        </Text>

        {submitStatus.submitted && (
          <div className={`p-4 mb-8 rounded-md ${submitStatus.success ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`}>
            <Text className="text-center">{submitStatus.message}</Text>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
          <div className="grid grid-cols-1 gap-6">
            {/* Resource Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Resource Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:border-transparent"
                required
              />
            </div>

            {/* Resource Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Resource Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:border-transparent"
                required
              >
                <option value="">Select a type</option>
                {resourceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Resource Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:border-transparent"
                required
              ></textarea>
            </div>

            {/* Resource Link */}
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Link (if available)
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:border-transparent"
              />
            </div>

            {/* Creator/Author */}
            <div>
              <label htmlFor="creator" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Creator/Author
              </label>
              <input
                type="text"
                id="creator"
                name="creator"
                value={formData.creator}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:border-transparent"
              />
            </div>

            {/* Your Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:border-transparent"
              />
              <Text size="xs" className="mt-1 text-neutral-500 dark:text-neutral-400">
                Optional. We'll only use this to contact you if we have questions about your suggestion.
              </Text>
            </div>

            {/* Additional Information */}
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Additional Information
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:border-transparent"
              ></textarea>
              <Text size="xs" className="mt-1 text-neutral-500 dark:text-neutral-400">
                Any other details that might help us understand why this resource should be included.
              </Text>
            </div>

            {/* Submit Button */}
            <div className="mt-2 flex justify-center">
              <button
                type="submit"
                className="px-6 py-3 rounded-md text-neutral-800 dark:text-white transition-all duration-300 transform hover:translate-y-[-2px]"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  background: 'var(--background)',
                  border: '2px solid transparent',
                  backgroundImage: 'linear-gradient(var(--background), var(--background)), var(--gradient-brand)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                }}
              >
                Submit Suggestion
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
