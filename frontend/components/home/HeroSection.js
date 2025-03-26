import Link from 'next/link';
import Image from 'next/image';
import { Heading, Text } from '../ui/Typography';
import { getTypographyClasses } from '../../utils/fontUtils';

/**
 * Hero section component for the home page
 * Displays the logo, description, and call-to-action in a side-by-side layout
 */
const HeroSection = () => {
  return (
    <section className="py-6 md:py-10 px-4 max-w-7xl mx-auto bg-transparent">
      <div 
        className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-12 rounded-xl p-6 relative overflow-hidden"
      >
        {/* Logo Display - left side */}
        <div className="relative z-10 w-64 h-64 md:w-[28rem] md:h-[28rem] hover:scale-105 transition-transform duration-500 flex-shrink-0">
          <Image 
            src="/images/logo.png" 
            alt="Insight Directory Logo" 
            fill
            className="object-contain"
            priority
          />
        </div>
        
        {/* Content Side */}
        <div className="relative z-10 flex flex-col flex-1 justify-center md:justify-start items-center md:items-start md:pt-8">
          {/* Logo Words - top of right side (2x bigger) */}
          <div className="relative w-full h-24 md:h-48 mb-8">
            <Image 
              src="/images/Logo_words.PNG" 
              alt="Insight Directory" 
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          
          <div className="w-full flex flex-col items-center md:items-start">
            {/* Description Text - larger with improved line spacing */}
            <div className="w-full">
              <Heading 
                as="h2"
                size="3xl"
                className={`text-neutral-800 max-w-xl text-center md:text-left mb-8 leading-loose font-semibold scale-125 md:ml-24 ${getTypographyClasses({ type: 'body', weight: 'SEMIBOLD' })}`}
              >
                A comprehensive collection of resources for those interested in spiritual awakening, non-duality, and self-inquiry.
              </Heading>
            </div>
            
            {/* Call to Action - Single button */}
            <div className="flex justify-center md:justify-start items-center w-full">
              <Link 
                href="/sign-up" 
                className={`px-8 py-3 text-lg text-white rounded-md hover:shadow-md transition-all duration-300 font-bold inline-block transform hover:translate-y-[-2px] hover:bg-brand-blue ${getTypographyClasses({ type: 'heading', weight: 'BOLD' })}`}
                style={{ 
                  backgroundColor: 'var(--brand-deep-blue)'
                }}
              >
                Sign up for free
              </Link>
            </div>
            <Text 
              size="md" 
              className={`text-neutral-600 mt-4 max-w-xl text-center md:text-left leading-relaxed ${getTypographyClasses({ type: 'body' })}`}
            >
              Create an account to save your favorite resources and help others on their spiritual journey.
            </Text>
          </div>

          {/* Subtle color accents */}
          <div className="hidden md:block absolute -z-10 top-[30%] right-[10%] w-24 h-24 rounded-full bg-brand-purple opacity-5"></div>
          <div className="hidden md:block absolute -z-10 bottom-[20%] left-[20%] w-32 h-32 rounded-full bg-brand-orange opacity-5"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
