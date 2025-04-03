import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser, useAuth } from '@clerk/nextjs';
import { Heading, Text } from '../components/ui/Typography';
import { SignInButton } from '@clerk/nextjs';

/**
 * Resource suggestion form component
 * Allows users to suggest new resources to be added to the directory
 */
export default function SuggestResourcePage() {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    link: '',
    creator: '',
    additionalInfo: ''
  });
  
  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: '',
    isSubmitting: false
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
    'Retreat Center',
    'Teacher',
    'Tradition'
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
        message: 'Please fill out all required fields.',
        isSubmitting: false
      });
      return;
    }

    try {
      // Set submitting state
      setSubmitStatus(prev => ({ ...prev, isSubmitting: true }));
      
      // Get the authentication token
      const token = await getToken();
      
      // Prepare the data for submission
      const suggestionData = {
        ...formData,
        // Convert type to lowercase and remove spaces for backend compatibility
        type: formData.type.toLowerCase().replace(/ /g, ''),
        // Include the user ID for authentication
        clerkId: user.id
      };
      
      // Add user info if available
      if (user) {
        suggestionData.submitterName = user.fullName || '';
        suggestionData.submitterEmail = user.primaryEmailAddress?.emailAddress || '';
      }
      
      // Submit to API
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(suggestionData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error submitting suggestion');
      }
      
      // Success state
      setSubmitStatus({
        submitted: true,
        success: true,
        message: 'Thank you for your suggestion! We will review it soon.',
        isSubmitting: false
      });
      
      // Reset form
      setFormData({
        title: '',
        type: '',
        description: '',
        link: '',
        creator: '',
        additionalInfo: ''
      });
      
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setSubmitStatus({
        submitted: true,
        success: false,
        message: error.message || 'There was an error submitting your suggestion. Please try again later.',
        isSubmitting: false
      });
    }
  };

  // If Clerk is still loading, show a loading state
  if (!isLoaded) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-300 border-t-neutral-600 mx-auto"></div>
        <p className="mt-4 text-neutral-600">Loading...</p>
      </div>
    );
  }

  // If user is not signed in, show sign-in prompt
  if (!isSignedIn) {
    return (
      <>
        <Head>
          <title>Suggest a Resource - Insight Directory</title>
          <meta name="description" content="Suggest a resource to be added to the Insight Directory." />
        </Head>

        <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
          <Heading as="h1" size="4xl" className="mb-8">
            Suggest a Resource
          </Heading>
          
          <Text size="lg" className="mb-8">
            To suggest a resource, please sign in with your account first.
          </Text>
          
          <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 text-center">
            <Text className="mb-6">
              Sign in to suggest resources for the Insight Directory.
            </Text>
            
            <SignInButton mode="modal">
              <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </>
    );
  }

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
              <p className="text-sm text-neutral-500 mt-1">
                Any other details that might be helpful (e.g., why you recommend this resource)
              </p>
            </div>

            {/* Submit Button */}
            <div className="mt-2">
              <button
                type="submit"
                disabled={submitStatus.isSubmitting}
                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {submitStatus.isSubmitting ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    Submitting...
                  </>
                ) : (
                  'Submit Suggestion'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
