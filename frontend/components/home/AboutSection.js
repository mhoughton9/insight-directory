import React from 'react';
import Link from 'next/link';
import { Heading, Text } from '../ui/Typography';
import Button from '../ui/Button';

/**
 * About Section component for the home page
 * Displays information about the Insight Directory
 */
const AboutSection = () => {
  return (
    // Outer section: Apply deep background and vertical padding, make it full width
    <section className="py-16 sm:py-24 bg-[var(--theme-bg-deep)]">
      {/* Inner container: Constrain content width and center it */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Heading as="h2" size="3xl" className="mb-6">
          About This Directory
        </Heading>
        <Text size="lg" className="text-caption-color mb-8 leading-relaxed">
          This directory aims to be a comprehensive collection of resources for those interested in awakening, 
          non-duality, and self-inquiry. Whether you're new to these topics or have been exploring them for years, 
          you'll find valuable resources to support your journey.
        </Text>
        <div className="flex justify-center">
          <Link href="/about">
            <Button variant="primary" size="lg">
              Learn more about us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
