import Link from 'next/link';

/**
 * About Section component for the home page
 * Displays information about the Awakening Directory
 */
const AboutSection = () => {
  return (
    <section className="py-12 md:py-16 px-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-4" style={{ fontFamily: 'Lora, serif' }}>
          About This <span className="text-accent">Directory</span>
        </h2>
        <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-8 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
          This directory aims to be a comprehensive collection of resources for those interested in spiritual awakening, 
          non-duality, and self-inquiry. Whether you're new to these topics or have been exploring them for years, 
          you'll find valuable resources to support your journey.
        </p>
        <Link 
          href="/about" 
          className="px-5 py-2 text-sm text-white rounded-md hover:shadow-lg transition-all duration-300 shadow-sm font-medium inline-block"
          style={{ background: 'var(--gradient-brand)', fontFamily: 'Inter, sans-serif' }}
        >
          Learn More About Us
        </Link>
      </div>
    </section>
  );
};

export default AboutSection;
