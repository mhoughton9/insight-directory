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
          
          {/* What students say Section */}
          {teacher.descriptionSections.what_students_say && (
            <SectionContainer 
              title="What students say"
              content={teacher.descriptionSections.what_students_say}
              type="text"
              className="mb-6"
            />
          )}
          
          {/* Common Misunderstanding clarified Section */}
          {teacher.descriptionSections.common_misunderstanding_clarified && (
            <SectionContainer 
              title="Common Misunderstanding clarified"
              content={teacher.descriptionSections.common_misunderstanding_clarified}
              type="text"
              className="mb-6"
            />
          )}
          
          {/* If you only read/watch one thing Section */}
          {teacher.descriptionSections.if_you_only_read_watch_one_thing && (
            <SectionContainer 
              title="If you only read/watch one thing"
              content={teacher.descriptionSections.if_you_only_read_watch_one_thing}
              type="text"
              className="mb-6"
            />
          )}
          
          {/* Quotes worth remembering Section */}
          {teacher.descriptionSections.quotes_worth_remembering && (
            <SectionContainer 
              title="Quotes worth remembering"
              content={teacher.descriptionSections.quotes_worth_remembering}
              type="array"
              className="mb-6"
            />
          )}
        </div>
      )}
      
      {/* Key Teachings section - always show if available */}
      {teacher.keyTeachings && teacher.keyTeachings.length > 0 && (
        <div className="mb-6 md:mb-8">
          <Heading as="h2" size="lg" className="mb-3 md:mb-4">
            Key Teachings
          </Heading>
          <ul className="list-disc pl-5 space-y-2">
            {teacher.keyTeachings.map((teaching, index) => (
              <li key={index} className="text-neutral-700 dark:text-neutral-300">
                {teaching}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TeacherDetailContent;
