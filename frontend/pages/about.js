import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

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
        <h1 className="text-4xl font-normal text-neutral-800 dark:text-neutral-100 mb-8 text-center" style={{ fontFamily: 'Lora, serif' }}>
          About This Directory
        </h1>

        <div className="prose prose-lg dark:prose-invert mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
          <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
            The Insight Directory is a collection of resources focused on spiritual awakening, non-duality, and self-inquiry. I created this directory because these topics have been the most fascinating and life-changing I've ever come across.
          </p>

          <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
            After several years of deep interest in these subjects, I continue to discover valuable resources I wish I'd known about earlier. I've often thought it would be helpful to have a single site that brings together the best materials in one place.
          </p>

          <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
            While there are countless spiritual books and resources available, this directory specifically focuses on those related to awakening, non-duality, self-inquiry, and practices that point toward these experiences.
          </p>

          <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
            Each individual resonates with different teaching styles and approaches. What speaks deeply to one person might not connect with another. This directory aims to help you explore various approaches to find what works best for you, whether you're new to these concepts or have been exploring them for years.
          </p>

          <div className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-lg mt-8 mb-6">
            <h2 className="text-2xl font-normal text-neutral-800 dark:text-neutral-100 mb-4" style={{ fontFamily: 'Lora, serif' }}>
              Have a Resource to Suggest?
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-4">
              Know of a valuable resource that should be included in this directory? I welcome suggestions for books, teachers, podcasts, and other materials that align with the focus of this site.
            </p>
            <Link 
              href="/suggest" 
              className="inline-block px-6 py-3 bg-neutral-800 dark:bg-neutral-700 text-white rounded-md hover:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
            >
              Suggest a Resource
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
