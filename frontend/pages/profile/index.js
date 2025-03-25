import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useUser } from '@clerk/nextjs';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useUserContext } from '@/contexts/UserContext';

const ProfilePage = () => {
  const { user } = useUser();
  const { favorites, loading } = useUserContext();
  const [activeTab, setActiveTab] = useState('favorites');
  const [favoriteResources, setFavoriteResources] = useState([]);
  const [favoriteTeachers, setFavoriteTeachers] = useState([]);
  const [favoriteTraditions, setFavoriteTraditions] = useState([]);

  useEffect(() => {
    // Fetch favorite items when favorites IDs are available
    const fetchFavoriteItems = async () => {
      if (!favorites) return;

      try {
        // Fetch favorite resources
        if (favorites.resources?.length > 0) {
          const resourcesResponse = await fetch(`/api/resources?ids=${favorites.resources.join(',')}`);
          if (resourcesResponse.ok) {
            const data = await resourcesResponse.json();
            setFavoriteResources(data.resources || []);
          }
        } else {
          setFavoriteResources([]);
        }

        // Fetch favorite teachers
        if (favorites.teachers?.length > 0) {
          const teachersResponse = await fetch(`/api/teachers?ids=${favorites.teachers.join(',')}`);
          if (teachersResponse.ok) {
            const data = await teachersResponse.json();
            setFavoriteTeachers(data.teachers || []);
          }
        } else {
          setFavoriteTeachers([]);
        }

        // Fetch favorite traditions
        if (favorites.traditions?.length > 0) {
          const traditionsResponse = await fetch(`/api/traditions?ids=${favorites.traditions.join(',')}`);
          if (traditionsResponse.ok) {
            const data = await traditionsResponse.json();
            setFavoriteTraditions(data.traditions || []);
          }
        } else {
          setFavoriteTraditions([]);
        }
      } catch (error) {
      }
    };

    // Initial fetch when component mounts or favorites change
    fetchFavoriteItems();
    
    // Set up listener for the custom favorites-changed event
    const handleFavoritesChanged = (event) => {
      fetchFavoriteItems();
    };
    
    window.addEventListener('favorites-changed', handleFavoritesChanged);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('favorites-changed', handleFavoritesChanged);
    };
  }, [favorites]); // React to changes in favorites

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <Head>
          <title>Your Profile | Insight Directory</title>
          <meta name="description" content="Manage your profile and view your favorites on Insight Directory" />
        </Head>

        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center mb-8 p-6 bg-white rounded-lg shadow-sm">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
              <img 
                src={user?.imageUrl || '/images/default-avatar.png'} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-medium" style={{ fontFamily: 'Lora, serif' }}>
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-neutral-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-neutral-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('favorites')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'favorites' ? 'border-neutral-800 text-neutral-800' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Favorites
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'comments' ? 'border-neutral-800 text-neutral-800' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Comments
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-neutral-800 text-neutral-800' : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'}`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Settings
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'favorites' && (
            <div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse inline-block h-8 w-8 rounded-full bg-neutral-200"></div>
                  <p className="mt-2 text-neutral-500" style={{ fontFamily: 'Inter, sans-serif' }}>Loading your favorites...</p>
                </div>
              ) : (
                <div>
                  {/* Resources */}
                  <div className="mb-8">
                    <h2 className="text-xl font-medium mb-4" style={{ fontFamily: 'Lora, serif' }}>Favorite Resources</h2>
                    {favoriteResources.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favoriteResources.map(resource => (
                          <div key={resource._id} className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-medium" style={{ fontFamily: 'Lora, serif' }}>{resource.title}</h3>
                            <p className="text-sm text-neutral-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{resource.type}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-500" style={{ fontFamily: 'Inter, sans-serif' }}>You haven't favorited any resources yet.</p>
                    )}
                  </div>

                  {/* Teachers */}
                  <div className="mb-8">
                    <h2 className="text-xl font-medium mb-4" style={{ fontFamily: 'Lora, serif' }}>Favorite Teachers</h2>
                    {favoriteTeachers.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favoriteTeachers.map(teacher => (
                          <div key={teacher._id} className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-medium" style={{ fontFamily: 'Lora, serif' }}>{teacher.name}</h3>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-500" style={{ fontFamily: 'Inter, sans-serif' }}>You haven't favorited any teachers yet.</p>
                    )}
                  </div>

                  {/* Traditions */}
                  <div>
                    <h2 className="text-xl font-medium mb-4" style={{ fontFamily: 'Lora, serif' }}>Favorite Traditions</h2>
                    {favoriteTraditions.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favoriteTraditions.map(tradition => (
                          <div key={tradition._id} className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-medium" style={{ fontFamily: 'Lora, serif' }}>{tradition.name}</h3>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-500" style={{ fontFamily: 'Inter, sans-serif' }}>You haven't favorited any traditions yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="py-4">
              <p className="text-neutral-500 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>Comments feature coming soon.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="py-4">
              <p className="text-neutral-500 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>Settings feature coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
