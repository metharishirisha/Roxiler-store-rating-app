import React, { useState, useEffect } from 'react';
import { Store, storeService } from '../services/storeService';
import Navbar from '../components/Navbar';
import StoreCard from '../components/StoreCard';
import RatingModal from '../components/RatingModal';
import { Search, Filter, MapPin, Star } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    filterStores();
  }, [stores, searchTerm, selectedCategory, selectedLocation]);

  const loadStores = async () => {
    try {
      const data = await storeService.fetchStores();
      setStores(data);
      setFilteredStores(data);
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStores = () => {
    let filtered = stores;

    if (searchTerm) {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(store => store.category === selectedCategory);
    }

    if (selectedLocation) {
      filtered = filtered.filter(store => store.location === selectedLocation);
    }

    setFilteredStores(filtered);
  };

  const handleStoreClick = (store: Store) => {
    setSelectedStore(store);
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = async (rating: number, comment: string) => {
    if (selectedStore) {
      try {
        await storeService.submitRating(selectedStore.id, rating, comment);
        setIsRatingModalOpen(false);
        setSelectedStore(null);
        // Refresh stores to update ratings
        loadStores();
      } catch (error) {
        console.error('Error submitting rating:', error);
      }
    }
  };

  const categories = [...new Set(stores.map(store => store.category))];
  const locations = [...new Set(stores.map(store => store.location))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Great Stores</h1>
          <p className="text-gray-600">Rate and review your favorite local businesses</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedLocation('');
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map(store => (
            <StoreCard
              key={store.id}
              store={store}
              onClick={handleStoreClick}
            />
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {selectedStore && (
        <RatingModal
          store={selectedStore}
          isOpen={isRatingModalOpen}
          onClose={() => {
            setIsRatingModalOpen(false);
            setSelectedStore(null);
          }}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
};

export default UserDashboard;