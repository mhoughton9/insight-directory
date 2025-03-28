import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const BookProcessingForm = ({ 
  resource, 
  processingNotes,
  onSuccess, 
  submitting, 
  setSubmitting, 
  error, 
  setError 
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    isbn: resource.bookDetails?.isbn || '',
    amazonLink: resource.bookDetails?.amazonLink || '',
    imageUrl: resource.imageUrl || '',
    pageCount: resource.bookDetails?.pageCount || ''
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Prepare the data for submission
      const bookData = {
        processed: true,
        processingNotes,
        bookDetails: {
          isbn: formData.isbn.trim(),
          amazonLink: formData.amazonLink.trim(),
          pageCount: formData.pageCount ? parseInt(formData.pageCount) : undefined
        },
        imageUrl: formData.imageUrl.trim()
      };
      
      // Submit the data
      const response = await fetch(`/api/admin/process/${resource._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process book');
      }
      
      onSuccess('Book processed successfully!');
    } catch (err) {
      console.error('Error processing book:', err);
      setError(err.message || 'Failed to process book');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Book Details */}
        <div>
          <h3 className="text-xl font-medium mb-4">Book Details</h3>
          
          {/* ISBN */}
          <div className="mb-4">
            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
              ISBN (optional)
            </label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 9781234567890"
            />
          </div>
          
          {/* Amazon Link */}
          <div className="mb-4">
            <label htmlFor="amazonLink" className="block text-sm font-medium text-gray-700 mb-1">
              Amazon Affiliate Link
            </label>
            <input
              type="text"
              id="amazonLink"
              name="amazonLink"
              value={formData.amazonLink}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://amazon.com/..."
            />
          </div>
          
          {/* Page Count */}
          <div className="mb-4">
            <label htmlFor="pageCount" className="block text-sm font-medium text-gray-700 mb-1">
              Page Count (optional)
            </label>
            <input
              type="number"
              id="pageCount"
              name="pageCount"
              value={formData.pageCount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 256"
              min="1"
            />
          </div>
        </div>
        
        {/* Right Column - Cover Image */}
        <div>
          <h3 className="text-xl font-medium mb-4">Book Cover</h3>
          
          {/* Image URL */}
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          {/* Image Preview */}
          <div className="mt-4">
            {formData.imageUrl ? (
              <div className="relative h-[300px] w-[200px] mx-auto border border-gray-300 rounded overflow-hidden">
                <Image 
                  src={formData.imageUrl} 
                  alt="Book cover preview" 
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/images/placeholder-book.png';
                  }}
                />
              </div>
            ) : (
              <div className="h-[300px] w-[200px] mx-auto bg-gray-200 flex items-center justify-center border border-gray-300 rounded">
                <p className="text-gray-500 text-center px-4">No cover image</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
        >
          {submitting ? 'Processing...' : 'Process Book'}
        </button>
      </div>
    </form>
  );
};

export default BookProcessingForm;
