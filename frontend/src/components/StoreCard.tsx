import React from 'react';
import { Store } from '../services/storeService';
import { Star, MapPin, MessageCircle } from 'lucide-react';

interface StoreCardProps {
  store: Store;
  onClick: (store: Store) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onClick }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-50" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={() => onClick(store)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={store.imageUrl} 
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 shadow-md">
          <span className="text-sm font-semibold text-gray-800">{store.category}</span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {store.name}
        </h3>
        
        <div className="flex items-center space-x-1 mb-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{store.location}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {store.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(store.averageRating)}
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {store.averageRating.toFixed(1)}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-500">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{store.totalRatings}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;