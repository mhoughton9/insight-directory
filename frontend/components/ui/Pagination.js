import React from 'react';

/**
 * Pagination component for navigating through paginated content
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxDisplayedPages = 5
}) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;
  
  // Calculate the range of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // If we have fewer pages than the max to display, show all pages
    if (totalPages <= maxDisplayedPages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }
    
    // Otherwise, show a window of pages around the current page
    const halfWindow = Math.floor(maxDisplayedPages / 2);
    let startPage = Math.max(1, currentPage - halfWindow);
    let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxDisplayedPages) {
      startPage = Math.max(1, endPage - maxDisplayedPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <nav className="flex justify-center my-4" aria-label="Pagination">
      <ul className="inline-flex items-center gap-1 rounded-lg p-1" style={{
        backgroundColor: 'rgba(30, 58, 89, 0.5)'
      }}>
        {/* Previous page button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80 hover:scale-105'}`}
            style={{
              backgroundColor: 'var(--theme-surface-primary, #1E3A59)',
              color: 'var(--theme-text-secondary, #9CA3B0)'
            }}
            aria-label="Previous page"
          >
            <span className="sr-only">Previous</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </li>
        
        {/* First page if not in view */}
        {pageNumbers[0] > 1 && (
          <>
            <li>
              <button
                onClick={() => onPageChange(1)}
                className="flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 hover:bg-opacity-80 hover:scale-105"
                style={{
                  backgroundColor: 'var(--theme-surface-primary, #1E3A59)',
                  color: 'var(--theme-text-secondary, #9CA3B0)'
                }}
              >
                1
              </button>
            </li>
            {pageNumbers[0] > 2 && (
              <li>
                <span className="flex items-center justify-center w-8 h-8 rounded-md"
                  style={{
                    backgroundColor: 'var(--theme-surface-primary, #1E3A59)',
                    color: 'var(--theme-text-secondary, #9CA3B0)'
                  }}
                >
                  ...
                </span>
              </li>
            )}
          </>
        )}
        
        {/* Page numbers */}
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${currentPage !== number ? 'hover:bg-opacity-80 hover:scale-105' : ''}`}
              style={{
                backgroundColor: currentPage === number ? 'var(--theme-accent-blue, #1E90FF)' : 'var(--theme-surface-primary, #1E3A59)',
                color: currentPage === number ? 'var(--theme-text-primary, #F5F6F8)' : 'var(--theme-text-secondary, #9CA3B0)'
              }}
              aria-current={currentPage === number ? 'page' : undefined}
            >
              {number}
            </button>
          </li>
        ))}
        
        {/* Last page if not in view */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <li>
                <span className="flex items-center justify-center w-8 h-8 rounded-md"
                  style={{
                    backgroundColor: 'var(--theme-surface-primary, #1E3A59)',
                    color: 'var(--theme-text-secondary, #9CA3B0)'
                  }}
                >
                  ...
                </span>
              </li>
            )}
            <li>
              <button
                onClick={() => onPageChange(totalPages)}
                className="flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 hover:bg-opacity-80 hover:scale-105"
                style={{
                  backgroundColor: 'var(--theme-surface-primary, #1E3A59)',
                  color: 'var(--theme-text-secondary, #9CA3B0)'
                }}
              >
                {totalPages}
              </button>
            </li>
          </>
        )}
        
        {/* Next page button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80 hover:scale-105'}`}
            style={{
              backgroundColor: 'var(--theme-surface-primary, #1E3A59)',
              color: 'var(--theme-text-secondary, #9CA3B0)'
            }}
            aria-label="Next page"
          >
            <span className="sr-only">Next</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
