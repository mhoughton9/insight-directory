import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

const BookManager = () => {
  const router = useRouter();
  const [currentBook, setCurrentBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({ processed: 0, total: 0, remaining: 0 });
  const [formData, setFormData] = useState({
    isbn: '',
    amazonUrl: '',
    imageUrl: '',
    pageCount: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch the next unprocessed book
  const fetchNextBook = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage('');
      
      const response = await fetch('/api/admin/books/next-unprocessed');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch next book');
      }
      
      setProgress(data.progress);
      
      if (data.allProcessed) {
        setCurrentBook(null);
        setError('No more books to process!');
      } else if (data.book) {
        setCurrentBook(data.book);
        // Pre-fill form with existing data if available
        setFormData({
          isbn: data.book.isbn || '',
          amazonUrl: data.book.url || '',
          imageUrl: '',
          pageCount: data.book.bookDetails?.pages || ''
        });
      } else {
        setCurrentBook(null);
        setError('No books found to process');
      }
    } catch (err) {
      console.error('Error fetching next book:', err);
      setError(err.message || 'Failed to fetch next book');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Process ISBN to remove dashes and spaces
  const processIsbn = (isbn) => {
    // If ISBN is empty, return empty string
    if (!isbn) return '';
    // Remove all non-alphanumeric characters
    return isbn.replace(/[^0-9X]/gi, '');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentBook) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Process the ISBN to remove dashes and spaces
      const processedFormData = {
        ...formData,
        isbn: processIsbn(formData.isbn)
      };
      
      const response = await fetch(`/api/admin/books/${currentBook._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(processedFormData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update book');
      }
      
      setSuccessMessage(`Successfully updated "${currentBook.title}"`);
      
      // Wait a moment before fetching the next book
      setTimeout(() => {
        fetchNextBook();
      }, 1500);
    } catch (err) {
      console.error('Error updating book:', err);
      setError(err.message || 'Failed to update book');
    } finally {
      setSubmitting(false);
    }
  };

  // Skip current book
  const handleSkip = async () => {
    if (!currentBook) return;
    
    if (confirm('Are you sure you want to skip this book? It will be excluded from the processing queue.')) {
      try {
        setSubmitting(true);
        setError(null);
        
        const response = await fetch(`/api/admin/books/${currentBook._id}/skip`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to skip book');
        }
        
        setSuccessMessage(`Successfully skipped "${currentBook.title}"`);
        
        // Wait a moment before fetching the next book
        setTimeout(() => {
          fetchNextBook();
        }, 1000);
      } catch (err) {
        console.error('Error skipping book:', err);
        setError(err.message || 'Failed to skip book');
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Delete current book
  const handleDelete = async () => {
    if (!currentBook) return;
    
    if (confirm(`WARNING: Are you sure you want to DELETE "${currentBook.title}" from the database? This action cannot be undone.`)) {
      try {
        setSubmitting(true);
        setError(null);
        
        const response = await fetch(`/api/admin/books/${currentBook._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete book');
        }
        
        setSuccessMessage(`Successfully deleted "${currentBook.title}"`);
        
        // Wait a moment before fetching the next book
        setTimeout(() => {
          fetchNextBook();
        }, 1000);
      } catch (err) {
        console.error('Error deleting book:', err);
        setError(err.message || 'Failed to delete book');
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Load first book on component mount
  useEffect(() => {
    fetchNextBook();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Head>
        <title>Book Manager | Insight Directory Admin</title>
        <meta name="description" content="Admin tool for managing book data" />
      </Head>

      <h1 className="text-3xl font-semibold mb-6 text-center">Book Data Manager</h1>
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress: {progress.processed} of {progress.total} books processed</span>
          <span>{progress.remaining} books remaining</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progress.total > 0 ? (progress.processed / progress.total) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading next book...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          {error === 'No more books to process!' && (
            <div className="mt-4">
              <p className="text-green-600 font-medium mb-4">All books have been processed! </p>
              <Link 
                href="/admin" 
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200"
              >
                Return to Admin Dashboard
              </Link>
            </div>
          )}
        </div>
      ) : currentBook ? (
        <div>
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}
          
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-2">{currentBook.title}</h2>
            <p className="text-gray-700 mb-4 line-clamp-3">{currentBook.description}</p>
            
            {currentBook.bookDetails?.author && (
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Author:</span> {Array.isArray(currentBook.bookDetails.author) 
                  ? currentBook.bookDetails.author.join(', ')
                  : currentBook.bookDetails.author}
              </p>
            )}
            
            {currentBook.bookDetails?.yearPublished && (
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Year:</span> {currentBook.bookDetails.yearPublished}
              </p>
            )}

            {/* Display current page count */}
            <p className="text-gray-600">
              <span className="font-medium">Pages:</span> {currentBook.bookDetails?.pages || 'Not specified'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                ISBN <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter ISBN-10 or ISBN-13 (dashes are OK)"
              />
              <p className="mt-1 text-sm text-gray-500">
                You can enter either ISBN-10 or ISBN-13 format. Leave blank if the book doesn't have an ISBN.
              </p>
            </div>
            
            <div>
              <label htmlFor="amazonUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Amazon Affiliate Link
              </label>
              <input
                type="url"
                id="amazonUrl"
                name="amazonUrl"
                value={formData.amazonUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Amazon affiliate URL"
                required
              />
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Book Cover Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter image URL from Amazon"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Tip: Right-click on the book cover image on Amazon and select "Copy image address"
              </p>
            </div>

            <div>
              <label htmlFor="pageCount" className="block text-sm font-medium text-gray-700 mb-1">
                Page Count <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                id="pageCount"
                name="pageCount"
                value={formData.pageCount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter page count"
                min="1"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter only if you want to update the current page count shown above.
              </p>
            </div>
            
            <div className="flex justify-between pt-4">
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
                  disabled={submitting}
                >
                  Skip This Book
                </button>
                
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition duration-200"
                  disabled={submitting}
                >
                  Delete Resource
                </button>
              </div>
              
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200 flex items-center"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                    Processing...
                  </>
                ) : (
                  'Save and Continue'
                )}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

// Wrap with AdminLayout
const ProtectedBookManager = () => (
  <AdminLayout>
    <BookManager />
  </AdminLayout>
);

export default ProtectedBookManager;
