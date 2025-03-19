import Link from 'next/link';
import Image from 'next/image';
import Card from './Card';
import { BookIcon, VideoIcon, PodcastIcon, HeartIcon, CommentIcon } from './Icons';

export default function ResourceCard({ resource }) {
  // Helper function to get the appropriate icon based on resource type
  const getResourceTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'book':
        return <BookIcon size={14} className="mr-1" />;
      case 'video':
        return <VideoIcon size={14} className="mr-1" />;
      case 'podcast':
        return <PodcastIcon size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      {resource.coverImage && (
        <div className="relative h-48 w-full">
          <Image
            src={resource.coverImage}
            alt={resource.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4 flex-grow">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs font-medium px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded flex items-center">
            {getResourceTypeIcon(resource.type)}
            {resource.type}
          </span>
          {resource.tradition && (
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              {resource.tradition}
            </span>
          )}
        </div>
        <h3 className="text-lg font-medium mb-2">{resource.title}</h3>
        {resource.teacher && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            By {resource.teacher}
          </p>
        )}
        <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-3 mb-4">
          {resource.description}
        </p>
        <div className="flex justify-between items-center">
          <Link 
            href={`/resources/${resource.id}`}
            className="text-sm font-medium text-accent hover:text-accent-dark"
          >
            View Details
          </Link>
          <div className="flex items-center space-x-2">
            {resource.commentCount > 0 && (
              <div className="flex items-center text-xs text-neutral-600 dark:text-neutral-400">
                <CommentIcon size={14} className="mr-1" />
                {resource.commentCount}
              </div>
            )}
            <button className="text-neutral-600 dark:text-neutral-400 hover:text-accent">
              <HeartIcon size={16} filled={resource.isFavorited} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
