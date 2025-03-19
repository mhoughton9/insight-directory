import Link from 'next/link';

/**
 * Hero section component for the home page
 * Displays the main heading, description, and call-to-action
 */
const HeroSection = () => {
  return (
    <section className="py-10 md:py-16 px-4 max-w-6xl mx-auto text-center">
      <h1 className="text-4xl md:text-4xl lg:text-5xl mb-4 tracking-tight text-black dark:text-white" style={{ fontFamily: 'Lora, serif' }}>
        <span className="text-black dark:text-white">Awakening</span> Directory
      </h1>
      <p className="text-lg md:text-xl font-light text-neutral-700 dark:text-neutral-300 max-w-3xl mb-6 mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
        A comprehensive collection of resources for those interested in spiritual awakening, non-duality, and self-inquiry.
      </p>
      <div className="flex justify-center">
        <Link 
          href="/signup" 
          className="px-5 py-2 text-sm bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-orange text-white rounded-md hover:shadow-lg transition-all duration-300 shadow-sm font-medium inline-block"
          style={{ background: 'var(--gradient-brand)', fontFamily: 'Inter, sans-serif' }}
        >
          Sign up for free
        </Link>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
        Create an account to save your favorite resources and leave comments to help others on their spiritual journey.
      </p>
    </section>
  );
};

export default HeroSection;
