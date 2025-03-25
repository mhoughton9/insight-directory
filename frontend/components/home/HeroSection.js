import Link from 'next/link';
import { Heading, Text } from '../ui/Typography';

/**
 * Hero section component for the home page
 * Displays the main heading, description, and call-to-action
 */
const HeroSection = () => {
  return (
    <section className="py-10 md:py-16 px-4 max-w-6xl mx-auto text-center">
      <Heading as="h1" size="6xl" className="mb-6 text-center">
        <span className="text-black dark:text-white">Insight</span> Directory
      </Heading>
      <Text size="xl" className="text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto text-center mb-8 leading-relaxed">
        A comprehensive collection of resources for those interested in spiritual awakening, non-duality, and self-inquiry.
      </Text>
      <div className="flex justify-center">
        <Link 
          href="/sign-up" 
          className="px-6 py-3 text-base bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-orange text-white rounded-md hover:shadow-lg transition-all duration-300 shadow-sm font-bold inline-block transform hover:translate-y-[-2px]"
          style={{ background: 'var(--gradient-brand)' }}
        >
          Sign up for free
        </Link>
      </div>
      <Text size="sm" className="text-neutral-600 dark:text-neutral-400 mt-3 max-w-2xl mx-auto">
        Create an account to save your favorite resources and help others on their spiritual journey.
      </Text>
    </section>
  );
};

export default HeroSection;
