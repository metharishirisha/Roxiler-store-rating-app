import React, { useState, useEffect } from 'react';
import { Store, Rating, storeService } from '../services/storeService';
import Navbar from '../components/Navbar';
import { Star, TrendingUp, Users, MessageCircle, Calendar } from 'lucide-react';

const StoreOwnerDashboard: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      loadRatings(selectedStore.id);
    }
  }, [selectedStore]);

  const loadStores = async () => {
    try {
      const data = await storeService.fetchStores();
      setStores(data);
      if (data.length > 0) {
        setSelectedStore(data[0]);
      }
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRatings = async (storeId: string) => {
    try {
      const data = await storeService.fetchStoreRatings(storeId);
      setRatings(data);
    } catch (error) {
      console.error('Error loading ratings:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Owner Dashboard</h1>
          <p className="text-gray-600">Manage your store ratings and customer feedback</p>
        </div>

        {/* Store Selector */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Store</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stores.map(store => (
              <button
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedStore?.id === store.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900">{store.name}</h3>
                <p className="text-sm text-gray-600">{store.category}</p>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{store.averageRating.toFixed(1)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedStore && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Store Stats */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Average Rating</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {selectedStore.averageRating.toFixed(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">Total Ratings</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {selectedStore.totalRatings}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageCircle className="h-5 w-5 text-purple-500 mr-2" />
                      <span className="text-sm text-gray-600">With Comments</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {ratings.filter(r => r.comment).length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = ratings.filter(r => r.rating === star).length;
                    const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center">
                        <span className="text-sm w-8">{star}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-2" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 ml-2 w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Ratings List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Ratings</h3>
                {ratings.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No ratings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ratings.map(rating => (
                      <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <div className="flex items-center mr-3">
                              {renderStars(rating.rating)}
                            </div>
                            <span className="font-medium text-gray-900">{rating.userName}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        {rating.comment && (
                          <p className="text-gray-700 mt-2">{rating.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;