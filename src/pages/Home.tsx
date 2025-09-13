import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Users, Calendar, Star } from 'lucide-react';
import { supabase, Package } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import PackageCard from '../components/PackageCard';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerImages = [
    {
      url: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg',
      title: 'Discover Mountain Adventures',
      subtitle: 'Breathtaking peaks and unforgettable journeys await'
    },
    {
      url: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg',
      title: 'Forest Trekking Expeditions',
      subtitle: 'Immerse yourself in pristine wilderness'
    },
    {
      url: 'https://images.pexels.com/photos/1144176/pexels-photo-1144176.jpeg',
      title: 'Coastal Trail Adventures',
      subtitle: 'Where mountains meet the endless ocean'
    }
  ];

  useEffect(() => {
    fetchPackages();
    
    // Auto-rotate banner
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/packages/${id}`);
  };

  const handleBookNow = (id: string) => {
    navigate(`/booking/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative h-screen overflow-hidden">
        <div className="relative w-full h-full">
          {bannerImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="max-w-4xl mx-auto px-4">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
                    {image.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white mb-8 animate-fade-in-delay">
                    {image.subtitle}
                  </p>
                  <button
                    onClick={() => navigate('/packages')}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all transform hover:scale-105 animate-fade-in-delay-2"
                  >
                    Explore Packages
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Banner Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Welcome Section */}
      {user && (
        <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome back, {user.name}! 👋
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Ready for your next adventure? Check out our latest packages or explore your bookings.
              </p>
              <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Profile</h3>
                <div className="space-y-2 text-left">
                  <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {user.email}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Phone:</span> {user.phone}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Member since:</span> {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Packages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Travel Packages</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular destinations and create memories that will last a lifetime
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-gray-200 animate-pulse rounded-xl h-96" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  package={pkg}
                  onViewDetails={handleViewDetails}
                  onBookNow={handleBookNow}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/packages')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              View All Packages
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose NatureTrails?</h2>
            <p className="text-xl opacity-90">Experience the difference with our professional travel services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-white bg-opacity-20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Expert Guides</h3>
              <p className="opacity-90">Professional and knowledgeable local guides to ensure your safety and enjoyment</p>
            </div>

            <div className="text-center group">
              <div className="bg-white bg-opacity-20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Star className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Top Rated</h3>
              <p className="opacity-90">Consistently rated 5 stars by our customers for exceptional service and experiences</p>
            </div>

            <div className="text-center group">
              <div className="bg-white bg-opacity-20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Premium Locations</h3>
              <p className="opacity-90">Carefully curated destinations that showcase the world's most beautiful natural wonders</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;