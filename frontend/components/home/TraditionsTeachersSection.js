import Link from 'next/link';
import { Heading, Text } from '../ui/Typography';
import { getTypographyClasses } from '../../utils/fontUtils';

/**
 * Traditions and Teachers Section component for the home page
 * Displays traditions and teachers in a two-column layout
 * @param {Object} props - Component props
 * @param {Array} props.traditions - Array of tradition objects
 * @param {Array} props.teachers - Array of teacher objects
 * @param {Array} props.brandColors - Array of brand colors for styling
 */
const TraditionsTeachersSection = ({ traditions, teachers, brandColors }) => {
  // Common button classes
  const buttonClasses = "inline-block px-4 py-2 rounded-md text-neutral-800 dark:text-white transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md";
  
  // Common button styles
  const buttonStyle = {
    background: 'var(--background)',
    border: '2px solid var(--brand-deep-blue)'
  };

  return (
    <section className="py-12 my-8 mx-auto max-w-7xl bg-white rounded-xl shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Traditions Column */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-6 rounded-xl shadow-sm">
            <Heading as="h3" size="xl" className="mb-6 text-neutral-800 dark:text-neutral-200 text-center">
              Traditions
            </Heading>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {Array.isArray(traditions) && traditions.slice(0, 10).map((tradition, index) => {
                // Assign colors from brand palette based on index
                const color = brandColors[index % brandColors.length];
                
                return (
                  <div key={tradition._id} className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                    <Link href={`/traditions/${tradition._id}`} className="transition-all duration-300 transform hover:translate-y-[-2px] inline-block">
                      <Text as="span" size="md" className="hover:text-accent">
                        {tradition.name}
                      </Text>
                    </Link>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-6">
              <Link 
                href="/traditions" 
                className={buttonClasses}
                style={buttonStyle}
              >
                <Text as="span" size="sm" className={getTypographyClasses({ type: 'body', weight: 'SEMIBOLD' })}>
                  View All Traditions
                </Text>
              </Link>
            </div>
          </div>
          
          {/* Teachers Column */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-6 rounded-xl shadow-sm">
            <Heading as="h3" size="xl" className="mb-6 text-neutral-800 dark:text-neutral-200 text-center">
              Teachers
            </Heading>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {Array.isArray(teachers) && teachers.slice(0, 10).map((teacher, index) => {
                // Assign colors from brand palette based on index
                const color = brandColors[index % brandColors.length];
                
                return (
                  <div key={teacher._id} className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                    <Link href={`/teachers/${teacher._id}`} className="transition-all duration-300 transform hover:translate-y-[-2px] inline-block">
                      <Text as="span" size="md" className="hover:text-accent">
                        {teacher.name}
                      </Text>
                    </Link>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-6">
              <Link 
                href="/teachers" 
                className={buttonClasses}
                style={buttonStyle}
              >
                <Text as="span" size="sm" className={getTypographyClasses({ type: 'body', weight: 'SEMIBOLD' })}>
                  View All Teachers
                </Text>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TraditionsTeachersSection;
