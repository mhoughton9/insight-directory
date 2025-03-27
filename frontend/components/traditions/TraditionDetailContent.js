import React from 'react';
import { Heading, Text } from '../ui/Typography';
import { SectionContainer } from '../resources/sections';

/**
 * TraditionDetailContent component
 * Displays the main content of the tradition profile including description sections
 * @param {Object} props - Component props
 * @param {Object} props.tradition - Tradition data object
 */
const TraditionDetailContent = ({ tradition }) => {
  if (!tradition) return null;
  
  // Check if we have any description sections
  const hasDescriptionSections = 
    tradition.descriptionSections && 
    Object.keys(tradition.descriptionSections).length > 0;
  
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800 p-4 sm:p-6 mb-6 md:mb-8">
      {/* Basic description section - show if no detailed sections are available */}
      {!hasDescriptionSections && (
        <div className="mb-6 md:mb-8">
          <Heading as="h2" size="xl" className="mb-3 md:mb-4">
            About {tradition.name}
          </Heading>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {tradition.descriptionFull ? (
              tradition.descriptionFull.split('\n').map((paragraph, index) => (
                <Text key={index} className="mb-4 last:mb-0">{paragraph}</Text>
              ))
            ) : tradition.description ? (
              tradition.description.split('\n').map((paragraph, index) => (
                <Text key={index} className="mb-4 last:mb-0">{paragraph}</Text>
              ))
            ) : (
              <Text className="text-neutral-600 dark:text-neutral-400 italic">
                No detailed description available for this tradition.
              </Text>
            )}
          </div>
        </div>
      )}
      
      {/* Dynamic description sections */}
      {hasDescriptionSections && (
        <div className="mb-6 md:mb-8">
          <Heading as="h2" size="xl" className="mb-5 md:mb-6">
            About {tradition.name}
          </Heading>
          
          {/* In a Nutshell Section */}
          {tradition.descriptionSections.in_a_nutshell && (
            <SectionContainer 
              title="In a Nutshell (description)"
              content={tradition.descriptionSections.in_a_nutshell}
              type="text"
              className="mb-6"
            />
          )}
          
          {/* The Steel-man case Section */}
          {tradition.descriptionSections.the_steel_man_case && (
            <SectionContainer 
              title="The Steel-man case"
              content={tradition.descriptionSections.the_steel_man_case}
              type="text"
              className="mb-6"
            />
          )}
          
          {/* If you only read one book Section */}
          {tradition.descriptionSections.if_you_only_read_one_book && (
            <SectionContainer 
              title="If you only read one book"
              content={tradition.descriptionSections.if_you_only_read_one_book}
              type="text"
              className="mb-6"
            />
          )}
          
          {/* Common misunderstanding clarified Section */}
          {tradition.descriptionSections.common_misunderstanding_clarified && (
            <SectionContainer 
              title="Common misunderstanding clarified"
              content={tradition.descriptionSections.common_misunderstanding_clarified}
              type="text"
              className="mb-6"
            />
          )}
          
          {/* Practical Exercises Section */}
          {tradition.descriptionSections.practical_exercises && (
            <SectionContainer 
              title="Practical Exercises"
              content={tradition.descriptionSections.practical_exercises}
              type="array"
              className="mb-6"
            />
          )}
        </div>
      )}
      
      {/* Key Teachings section - always show if available */}
      {tradition.keyTeachings && tradition.keyTeachings.length > 0 && (
        <div className="mb-6 md:mb-8">
          <Heading as="h2" size="lg" className="mb-3 md:mb-4">
            Key Teachings
          </Heading>
          <ul className="list-disc pl-5 space-y-2">
            {tradition.keyTeachings.map((teaching, index) => (
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

export default TraditionDetailContent;
