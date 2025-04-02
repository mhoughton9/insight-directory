import React from 'react';
import { Heading, Text } from '../ui/Typography';
import { formatResourceType, normalizeResourceType } from '../../utils/resource-utils';
import { getSectionsForResourceType } from '../../utils/resource-section-config';
import { SectionContainer } from './sections';

/**
 * ResourceDetailContent component
 * Displays the main content of the resource including description and content
 * @param {Object} props - Component props
 * @param {Object} props.resource - Resource data object
 */
const ResourceDetailContent = ({ resource }) => {
  if (!resource) return null;
  
  // Get the appropriate sections for this resource type
  const sections = getSectionsForResourceType(resource.type);
  
  // Check if we have any description sections
  const hasDescriptionSections = 
    resource.descriptionSections && 
    Object.keys(resource.descriptionSections).length > 0;
  
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-800 p-4 sm:p-6 mb-6 md:mb-8">
      {/* Basic description section - show if no detailed sections are available */}
      {!hasDescriptionSections && (
        <div className="mb-6 md:mb-8">
          <Heading as="h2" size="xl" className="mb-3 md:mb-4">
            About this {formatResourceType(resource.type)}
          </Heading>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {resource.description ? (
              resource.description.split('\n').map((paragraph, index) => (
                <Text key={index} className="mb-4 last:mb-0">{paragraph}</Text>
              ))
            ) : (
              <Text className="text-neutral-600 dark:text-neutral-400 italic">
                No detailed description available for this resource.
              </Text>
            )}
          </div>
        </div>
      )}
      
      {/* Dynamic description sections */}
      {hasDescriptionSections && (
        <div className="mb-6 md:mb-8">
          <Heading as="h2" size="xl" className="mb-5 md:mb-6">
            About this {formatResourceType(resource.type)}
          </Heading>
          
          {sections.map((section) => (
            <SectionContainer
              key={section.key}
              title={section.label}
              type={section.type}
              content={resource.descriptionSections?.[section.key]}
            />
          ))}
        </div>
      )}
      
      {/* Additional content section - if present */}
      {resource.content && (
        <div className="mt-6 md:mt-8">
          <Heading as="h2" size="xl" className="mb-3 md:mb-4">
            Content
          </Heading>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {resource.content.split('\n').map((paragraph, index) => (
              <Text key={index} className="mb-4 last:mb-0">{paragraph}</Text>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetailContent;
