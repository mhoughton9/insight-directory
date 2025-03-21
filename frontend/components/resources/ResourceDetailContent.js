import React from 'react';
import * as Typography from '../common/TypographyStyles';
import { normalizeResourceType } from '../../utils/resource-utils';

/**
 * ResourceDetailContent component
 * Displays the main content of the resource including description and content
 * @param {Object} props - Component props
 * @param {Object} props.resource - Resource data object
 */
const ResourceDetailContent = ({ resource }) => {
  if (!resource) return null;
  
  return (
    <div className={Typography.cardContainer}>
      <div className="mb-6 md:mb-8">
        <h2 className={Typography.sectionHeading}>
          About this {normalizeResourceType(resource.type)}
        </h2>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {resource.description ? (
            resource.description.split('\n').map((paragraph, index) => (
              <p key={index} className={`${Typography.bodyText} mb-4 last:mb-0`}>{paragraph}</p>
            ))
          ) : (
            <p className={Typography.emptyStateText}>
              No detailed description available for this resource.
            </p>
          )}
        </div>
      </div>
      
      {/* Additional content section - if present */}
      {resource.content && (
        <div className="mt-6 md:mt-8">
          <h2 className={Typography.sectionHeading}>Content</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {resource.content.split('\n').map((paragraph, index) => (
              <p key={index} className={`${Typography.bodyText} mb-4 last:mb-0`}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetailContent;
