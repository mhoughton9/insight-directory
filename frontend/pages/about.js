import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Heading, Text } from '../components/ui/Typography';
import Button from '../components/ui/Button'; // Import Button component

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
        <Heading as="h1" size="4xl" className="mb-8 text-center text-text-primary">
          About This Directory
        </Heading>

        <div className="prose prose-lg dark:prose-invert mx-auto">
          <Text size="lg" className="mb-6">
            The Insight Directory is a curated collection of resources focused on awakening, non-duality, and self-inquiry. My only goal in creating this site is to help more people recognize their true nature.
          </Text>

          <Text size="lg" className="mb-6">
            The internet has made these teachings more accessible than ever, but finding the best resources can be challenging since they're spread across many sites and often mixed with confusing or bad information. I saw a chance to address this problem by gathering the most directly helpful and effective materials, teachers, and traditions together in one site.
          </Text>

          <Text size="lg" className="mb-6">
            Each resource is chosen because it points directly toward awakening and self-recognition. Some are designed to spark curiosity and open the door to what's possible. Others go deeper, offering philosophical or spiritual context. And some provide clear, practical, step-by-step guidance for those ready to engage directly.
          </Text>

          <Text size="lg" className="mb-6">
            I’ve tried to be thoughtful about designing the site in a way that avoids influencing users with my own biases. For example, I chose not to include any "featured resources" sections highlighting my personal favorites. Instead, users can sort resources by community favorites, leveraging collective insights. While the site will evolve—and no single person can perfectly judge what's best—I remain committed to the original purpose: helping as many people as possible awaken to their true nature.
          </Text>

          <Text size="lg" className="mb-6">
            In the future, limited commenting features will be introduced to gather useful crowd-sourced perspectives. My intention isn't to build a sprawling review platform, but simply to offer a thoughtfully designed tool that makes it easier to find effective resources.
          </Text>

          <Text size="lg" className="mb-6">
            Everyone approaches this journey in their own way—what resonates for one person might not for another. Whether you're new to these concepts or have spent years exploring, I hope The Insight Directory helps you find exactly what you need.
          </Text>

          <div className="rounded-xl shadow-sm p-6 mt-8 mb-6 transition-all duration-200 hover:shadow-md" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', borderWidth: '1px', borderStyle: 'solid' }}>
            <Heading as="h2" size="2xl" className="mb-4 text-center text-text-primary">
              Have a Resource to Suggest?
            </Heading>
            <Text className="mb-4 text-center text-text-primary">
              Know of a valuable resource that should be included in this directory? I welcome suggestions for books, teachers, podcasts, and other materials that align with the focus of this site.
            </Text>
            <div className="flex justify-center">
              <Link href="/suggest">
                <Button variant="secondary" size="lg">
                  Suggest a Resource
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
