import Link from 'next/link';
import Image from 'next/image';
import { Heading, Text } from '../ui/Typography';
import { getTypographyClasses } from '../../utils/fontUtils';
import Button from '../ui/Button';

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
          {/* Apply negative margin only on medium screens and up to shift left */}
          <div className="relative w-full h-24 md:h-48 mb-8 md:-ml-4">
            <Image 
              src="/images/Logo4_Words.PNG" 
              alt="Insight Directory" 
              fill
              className="object-contain object-left"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          <div className="w-full flex flex-col items-center md:items-start space-y-6">
            {/* Description Text - larger with improved line spacing */}
            <div className="w-full text-center md:text-left">
              <p className="text-lg md:text-xl mb-2 max-w-xl font-nunito">
                A comprehensive collection of resources for those interested in spiritual awakening, non-duality, and self-inquiry.
              </p>
            </div>
            
            {/* Call to Action - Single button */}
            <div className="flex justify-center md:justify-start items-center w-full">
              <Link href="/sign-up" passHref>
                <Button 
                  variant="primary" 
                  size="lg"
                  className={`font-bold ${getTypographyClasses({ type: 'heading', weight: 'BOLD' })}`} 
                >
                  Sign up for free
                </Button>
              </Link>
            </div>
            
            {/* Subtitle text */}
            <div className="text-center md:text-left w-full">
              <Text 
                size="md" 
                className="opacity-80 max-w-xl font-nunito"
              >
                Create an account to save your favorite resources and help others on their spiritual journey.
              </Text>
            </div>
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
