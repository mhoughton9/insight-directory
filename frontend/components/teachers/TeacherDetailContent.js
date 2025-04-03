import React from 'react';
import { Heading, Text } from '../ui/Typography';
import { SectionContainer } from '../resources/sections';

/**
 * TeacherDetailContent component
 * Displays the main content of the teacher profile including description sections
 * @param {Object} props - Component props
 * @param {Object} props.teacher - Teacher data object
 */
const TeacherDetailContent = ({ teacher }) => {
  if (!teacher) return null;
  
  // Check if we have any description sections
  const hasDescriptionSections = 
    teacher.descriptionSections && 
    Object.keys(teacher.descriptionSections).length > 0;
  
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800 p-4 sm:p-6 mb-6 md:mb-8">
      {/* Basic biography section - show if no detailed sections are available */}
      {!hasDescriptionSections && (
        <div className="mb-6 md:mb-8">
          <Heading as="h2" size="xl" className="mb-3 md:mb-4">
            About {teacher.name}
          </Heading>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {teacher.biographyFull ? (
              teacher.biographyFull.split('\n').map((paragraph, index) => (
                <Text key={index} className="mb-4 last:mb-0">{paragraph}</Text>
              ))
            ) : teacher.biography ? (
              teacher.biography.split('\n').map((paragraph, index) => (
                <Text key={index} className="mb-4 last:mb-0">{paragraph}</Text>
              ))
            ) : (
              <Text className="text-neutral-600 dark:text-neutral-400 italic">
                No detailed biography available for this teacher.
              </Text>
            )}
          </div>
        </div>
      )}
      
      {/* Dynamic description sections */}
      {hasDescriptionSections && (
        <div className="mb-6 md:mb-8">
          <Heading as="h2" size="xl" className="mb-5 md:mb-6">
            About {teacher.name}
          </Heading>
          
          {/* In a Nutshell Section */}
          {teacher.descriptionSections.in_a_nutshell && (
            <SectionContainer 
              title="In a Nutshell"
              content={teacher.descriptionSections.in_a_nutshell}
              type="text"
              className="mb-6"
            />
          )}
          
          {/* Key Contributions Section */}
          {teacher.descriptionSections.key_contributions && (
            <SectionContainer 
              title="Key Contributions"
              content={teacher.descriptionSections.key_contributions}
              type="text"
              className="mb-6"
            />
          )}
          
          {/* Teaching Style Section */}
          {teacher.descriptionSections.teaching_style && (
            <SectionContainer 
              title="Teaching Style"
              content={teacher.descriptionSections.teaching_style}
              type="text"
              className="mb-6"
            />
          )}
          
          {/* Historical Context Section */}
          {teacher.descriptionSections.historical_context && (
            <SectionContainer 
              title="Historical Context"
              content={teacher.descriptionSections.historical_context}
              type="text"
              className="mb-6"
            />
          )}
          
          {/* Notable Quotes Section */}
          {teacher.descriptionSections.notable_quotes && (
            <SectionContainer 
              title="Notable Quotes"
              content={teacher.descriptionSections.notable_quotes}
              type="array"
              className="mb-6"
            />
          )}
        </div>
      )}
      
      {/* Key Teachings section removed as requested */}
    </div>
  );
};

export default TeacherDetailContent;
