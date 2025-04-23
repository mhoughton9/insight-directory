import Link from 'next/link';
import { Heading, Text } from '../ui/Typography';
import { getTypographyClasses } from '../../utils/fontUtils';
import Button from '../ui/Button'; // Import Button component

/**
 * Traditions and Teachers Section component for the home page
 * Displays traditions and teachers in a two-column layout
 * @param {Object} props - Component props
 * @param {Array} props.traditions - Array of tradition objects
 * @param {Array} props.teachers - Array of teacher objects
 * @param {Array} props.brandColors - Array of brand colors for styling
 */
const TraditionsTeachersSection = ({ traditions, teachers, brandColors }) => {
  return (
    // Outer section: Use primary background (inherited) and vertical padding
    <section className="py-16 sm:py-24">
      {/* Inner container: Constrain content width and center it */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          
          {/* Traditions Column */}
          <div className="text-center">
            <Heading as="h2" size="3xl" className="mb-4">
              Traditions
            </Heading>
            <Text size="lg" className="text-[var(--theme-text-secondary)] mb-8">
              Explore spiritual traditions from around the world
            </Text>
            
            {Array.isArray(traditions) && traditions.length > 0 ? (
              <div className="space-y-4 mb-8">
                {traditions.slice(0, 6).map((tradition, index) => (
                  <Link 
                    key={tradition._id} 
                    href={`/traditions/${tradition._id}`} 
                    className="block text-[var(--theme-text-primary)] hover:text-[var(--button-gradient-start)] transition-colors"
                  >
                    {tradition.name}
                  </Link>
                ))}
              </div>
            ) : null}
            
            <div className="mt-4">
              <Button href="/traditions" variant="secondary">
                View all traditions
              </Button>
            </div>
          </div>

          {/* Teachers Column */}
          <div className="text-center">
            <Heading as="h2" size="3xl" className="mb-4">
              Teachers
            </Heading>
            <Text size="lg" className="text-[var(--theme-text-secondary)] mb-8">
              Learn from awakened masters and guides
            </Text>
            
            {Array.isArray(teachers) && teachers.length > 0 ? (
              <div className="space-y-4 mb-8">
                {teachers.slice(0, 6).map((teacher, index) => (
                  <Link 
                    key={teacher._id} 
                    href={`/teachers/${teacher._id}`} 
                    className="block text-[var(--theme-text-primary)] hover:text-[var(--button-gradient-start)] transition-colors"
                  >
                    {teacher.name}
                  </Link>
                ))}
              </div>
            ) : null}
            
            <div className="mt-4">
              <Button href="/teachers" variant="secondary">
                View all teachers
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TraditionsTeachersSection;
