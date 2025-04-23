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
    <div className="rounded-lg shadow-sm border p-4 sm:p-6 mb-6 md:mb-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)' }}>
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
              <Text className="text-text-secondary italic">
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
              title="In a Nutshell"
              content={tradition.descriptionSections.in_a_nutshell}
              type="text"
              className="mb-6"
            />
          )}
          
          {/* Historical Context Section */}
          {tradition.descriptionSections.historical_context && (
            <SectionContainer 
              title="Historical Context"
              content={tradition.descriptionSections.historical_context}
              type="text"
              className="mb-6"
            />
          )}
          
          {/* Key Teachings Section */}
          {tradition.descriptionSections.key_teachings && (
            <SectionContainer 
              title="Key Teachings"
              content={tradition.descriptionSections.key_teachings}
              type="text"
              className="mb-6"
            />
          )}
          
          {/* Practices Section */}
          {tradition.descriptionSections.practices && (
            <SectionContainer 
              title="Practices"
              content={tradition.descriptionSections.practices}
              type="text"
              className="mb-6"
            />
          )}
          
          {/* Modern Relevance Section */}
          {tradition.descriptionSections.modern_relevance && (
            <SectionContainer 
              title="Modern Relevance"
              content={tradition.descriptionSections.modern_relevance}
              type="text"
              className="mb-6"
            />
          )}
        </div>
      )}
      
      {/* Key Teachings section removed as requested */}
    </div>
  );
};

export default TraditionDetailContent;
