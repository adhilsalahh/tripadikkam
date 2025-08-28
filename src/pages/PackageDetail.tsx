import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Users, MapPin, Star, Calendar, CheckCircle, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import BookingForm from '../components/BookingForm';
import { supabase, Package } from '../lib/supabase';

const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchPackage(id);
    }
  }, [id]);

  const fetchPackage = async (packageId: string) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', packageId)
        .single();

      if (error) throw error;
      setPackageData(data);
    } catch (error) {
      console.error('Error fetching package:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingSuccess = (bookingId: string) => {
    setShowBookingForm(false);
    alert(`Booking confirmed! Your booking ID is: ${bookingId}`);
  };

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

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Package Not Found</h1>
          <p className="text-gray-600">The package you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const allImages = [packageData.image_url, ...packageData.gallery];

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                {packageData.name}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>4.8 (124 reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-5 h-5" />
                  <span>Western Ghats, Kerala</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                ₹{packageData.price.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">per person</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(packageData.difficulty)}`}>
              {packageData.difficulty}
            </span>
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{packageData.duration}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Users className="w-4 h-4" />
              <span>Max 12 people</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-96">
                <img
                  src={allImages[selectedImageIndex]}
                  alt={packageData.name}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 flex space-x-4 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-emerald-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Trek</h2>
              <p className="text-gray-600 leading-relaxed">{packageData.description}</p>
            </motion.div>

            {/* Trekking Spots */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Trekking Spots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packageData.trekking_spots.map((spot, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{spot}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* What's Included */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packageData.includes.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md sticky top-24"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-emerald-600 mb-1">
                  ₹{packageData.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">per person</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{packageData.duration}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className={`px-2 py-1 rounded text-sm ${getDifficultyColor(packageData.difficulty)}`}>
                    {packageData.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Group Size:</span>
                  <span className="font-medium">Max 12 people</span>
                </div>
              </div>

              <button
                onClick={() => setShowBookingForm(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold text-lg transition-colors mb-4"
              >
                Book Now
              </button>

              <div className="text-center text-sm text-gray-600">
                Free cancellation up to 24 hours before the trek
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          package={packageData}
          onClose={() => setShowBookingForm(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default PackageDetail;