import React, { useState } from 'react';
import Head from 'next/head';
import { useUser, useAuth, SignInButton } from '@clerk/nextjs';
import { Heading, Text } from '../components/ui/Typography';
import Button from '../components/ui/Button';

/**
 * Contact page component
 * Allows signed-in users to send a message to the site administrator.
 */
export default function ContactPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: '',
    isSubmitting: false,
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.message) {
      setSubmitStatus({
        submitted: true,
        success: false,
        message: 'Please fill out both subject and message fields.',
        isSubmitting: false,
      });
      return;
    }

    setSubmitStatus((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const token = await getToken(); // Get the Clerk authentication token
      if (!token) {
        throw new Error('Authentication token not available. Please ensure you are signed in.');
      }

      const contactData = {
        subject: formData.subject,
        message: formData.message,
        // User info like clerkId, name, email will be derived from the token on the backend via middleware
      };

      // --- Make the actual API call --- 
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message.');
      }
      // --- End API call --- 
      
      // Update state on successful submission
      setSubmitStatus({
        submitted: true,
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
        isSubmitting: false,
      });

      // Reset form
      setFormData({
        subject: '',
        message: '',
      });

    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus({
        submitted: true,
        success: false,
        message: 'There was an error sending your message. Please try again later.',
        isSubmitting: false,
      });
    }
  };

  // If Clerk is still loading, show a loading state
  if (!isLoaded) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-300 border-t-neutral-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Contact Us - Insight Directory</title>
        <meta name="description" content="Send a message to the Insight Directory team." />
      </Head>

      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Heading level="h1" className="text-center mb-8">Contact Us</Heading>

        {!isSignedIn ? (
          <div className="text-center p-6 border border-dashed border-border-neutral rounded-lg bg-bg-card shadow-sm">
            <Text className="mb-4">Please sign in to send us a message.</Text>
            <SignInButton mode="modal">
              <Button variant="secondary">Sign In</Button>
            </SignInButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Submission Status Message */}
            {submitStatus.submitted && (
              <div
                className={`p-4 rounded-md text-sm ${submitStatus.success ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}
                role="alert"
              >
                {submitStatus.message}
              </div>
            )}

            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-1">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-md bg-bg-card text-text-primary focus:ring-2 focus:ring-ring-focus focus:border-transparent"
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-1">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6" 
                required
                className="w-full px-4 py-2 border border-border rounded-md bg-bg-card text-text-primary focus:ring-2 focus:ring-ring-focus focus:border-transparent"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="mt-2">
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitStatus.isSubmitting}
              >
                {submitStatus.isSubmitting ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
