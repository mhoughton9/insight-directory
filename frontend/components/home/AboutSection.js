import Link from 'next/link';
import { Heading, Text } from '../ui/Typography';

/**
 * About Section component for the home page
 * Displays information about the Insight Directory
 */
const AboutSection = () => {
  return (
    <section className="py-12 my-8 mx-auto max-w-[95%] bg-white dark:bg-neutral-900 rounded-xl shadow-sm">
      <div className="max-w-3xl mx-auto text-center px-4">
        <Heading as="h2" size="3xl" className="mb-4 text-neutral-800 dark:text-neutral-200">
          About This Directory
        </Heading>
        <Text size="lg" className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
          This directory aims to be a comprehensive collection of resources for those interested in spiritual awakening, 
          non-duality, and self-inquiry. Whether you're new to these topics or have been exploring them for years, 
          you'll find valuable resources to support your journey.
        </Text>
        <div className="flex justify-center">
          <Link 
            href="/about" 
            className="px-6 py-3 text-base bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-orange text-white rounded-md hover:shadow-lg transition-all duration-300 shadow-sm font-bold inline-block hover:translate-y-[-2px]"
            style={{ background: 'var(--gradient-brand)' }}
          >
            Learn more about us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
