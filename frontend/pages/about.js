import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Heading, Text } from '../components/ui/Typography';

/**
 * About page component
 * Provides information about the purpose and mission of the Insight Directory
 */
export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About - Insight Directory</title>
        <meta name="description" content="Learn about the Insight Directory, a curated collection of resources for spiritual awakening, non-duality, and self-inquiry." />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Heading as="h1" size="4xl" className="mb-8 text-center">
          About This Directory
        </Heading>

        <div className="prose prose-lg dark:prose-invert mx-auto">
          <Text size="lg" className="mb-6">
            The Insight Directory is a collection of resources focused on spiritual awakening, non-duality, and self-inquiry. I created this directory because these topics have been the most fascinating and life-changing I've ever come across.
          </Text>

          <Text size="lg" className="mb-6">
            After several years of deep interest in these subjects, I continue to discover valuable resources I wish I'd known about earlier. I've often thought it would be helpful to have a single site that brings together the best materials in one place.
          </Text>

          <Text size="lg" className="mb-6">
            While there are countless spiritual books and resources available, this directory specifically focuses on those related to awakening, non-duality, self-inquiry, and practices that point toward these experiences.
          </Text>

          <Text size="lg" className="mb-6">
            Each individual resonates with different teaching styles and approaches. What speaks deeply to one person might not connect with another. This directory aims to help you explore various approaches to find what works best for you, whether you're new to these concepts or have been exploring them for years.
          </Text>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm p-6 mt-8 mb-6 transition-all duration-200 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700">
            <Heading as="h2" size="2xl" className="mb-4 text-center">
              Have a Resource to Suggest?
            </Heading>
            <Text className="mb-4 text-center">
              Know of a valuable resource that should be included in this directory? I welcome suggestions for books, teachers, podcasts, and other materials that align with the focus of this site.
            </Text>
            <div className="flex justify-center">
              <Link 
                href="/suggest" 
                className="inline-block px-6 py-3 rounded-md text-neutral-800 dark:text-white transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md"
                style={{ 
                  background: 'var(--background)',
                  border: '2px solid var(--brand-deep-blue)'
                }}
              >
                Suggest a Resource
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
