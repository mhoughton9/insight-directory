import Link from 'next/link';

/**
 * About Section component for the home page
 * Displays information about the Awakening Directory
 */
const AboutSection = () => {
  return (
    <section className="py-12 bg-neutral-50 dark:bg-neutral-800">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-2xl md:text-3xl font-medium mb-4 text-neutral-800 dark:text-neutral-200" style={{ fontFamily: 'Lora, serif' }}>
          About This Directory
        </h2>
        <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
          This directory aims to be a comprehensive collection of resources for those interested in spiritual awakening, 
          non-duality, and self-inquiry. Whether you're new to these topics or have been exploring them for years, 
          you'll find valuable resources to support your journey.
        </p>
        <div className="flex justify-center">
          <Link 
            href="/about" 
            className="px-5 py-2 text-sm bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-orange text-white rounded-md hover:shadow-lg transition-all duration-300 shadow-sm font-medium inline-block"
            style={{ background: 'var(--gradient-brand)', fontFamily: 'Inter, sans-serif' }}
          >
            Learn more about us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
