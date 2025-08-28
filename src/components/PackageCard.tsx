import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, MapPin, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Package } from '../lib/supabase';

interface PackageCardProps {
  package: Package;
}

const PackageCard: React.FC<PackageCardProps> = ({ package: pkg }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'challenging':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden group"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={pkg.image_url}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(pkg.difficulty)}`}>
            {pkg.difficulty}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            ₹{pkg.price.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{pkg.short_description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{pkg.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={`/packages/${pkg.id}`}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            View Details
          </Link>
          <Link
            to={`/packages/${pkg.id}/book`}
            className="border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;