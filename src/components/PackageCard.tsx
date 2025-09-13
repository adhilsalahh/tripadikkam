import React from 'react';
import { MapPin, Calendar, Users, Star } from 'lucide-react';
import { Package } from '../lib/supabase';

interface PackageCardProps {
  package: Package;
  onViewDetails: (id: string) => void;
  onBookNow: (id: string) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ package: pkg, onViewDetails, onBookNow }) => {
  const primaryImage = pkg.images?.[0] || 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg';

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      {/* Image */}
      <div className="relative overflow-hidden h-64">
        <img
          src={primaryImage}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            ${pkg.price}
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center space-x-1 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-sm">
            <Star className="h-3 w-3 fill-current" />
            <span>4.8</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
          {pkg.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{pkg.destination}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {pkg.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{pkg.available_dates?.length || 0} dates</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>Group tours</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => onViewDetails(pkg.id)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => onBookNow(pkg.id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;