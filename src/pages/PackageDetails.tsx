import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Star, Check, X, ArrowLeft } from 'lucide-react';
import { supabase, Package } from '../lib/supabase';
import ImageGallery from '../components/ImageGallery';

const PackageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [package_data, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPackage();
    }
  }, [id]);

  const fetchPackage = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPackageData(data);
    } catch (error) {
      console.error('Error fetching package:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!package_data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h2>
          <p className="text-gray-600 mb-6">The requested package could not be found.</p>
          <button
            onClick={() => navigate('/packages')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            View All Packages
          </button>
        </div>
      </div>
    );
  }

  const inclusions = package_data.inclusions?.split('\n').filter(Boolean) || [];
  const exclusions = package_data.exclusions?.split('\n').filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/packages')}
          className="flex items-center text-green-600 hover:text-green-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Packages
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div>
              <ImageGallery images={package_data.images || []} title={package_data.title} />
            </div>

            {/* Package Info */}
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{package_data.title}</h1>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                    <span className="text-gray-600 ml-2">(4.8)</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="text-lg">{package_data.destination}</span>
                </div>

                <div className="text-4xl font-bold text-green-600 mb-6">
                  ${package_data.price}
                  <span className="text-lg font-normal text-gray-500"> per person</span>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-gray-900">Group Size</span>
                  </div>
                  <span className="text-gray-600">8-15 people</span>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-gray-900">Available Dates</span>
                  </div>
                  <span className="text-gray-600">{package_data.available_dates?.length || 0} dates</span>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg text-lg font-medium transition-colors mb-6"
              >
                Book This Package
              </button>

              {/* Contact Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600">Call us at +1 (555) 123-4567 or email info@naturetrails.com</p>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="border-t border-gray-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Description & Itinerary */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Package</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">{package_data.description}</p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">Itinerary</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <pre className="text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                    {package_data.itinerary}
                  </pre>
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
                <div className="space-y-2 mb-6">
                  {inclusions.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">What's Not Included</h3>
                <div className="space-y-2 mb-6">
                  {exclusions.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <X className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Available Dates */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">Available Dates</h3>
                <div className="grid grid-cols-2 gap-2">
                  {package_data.available_dates?.map((date, index) => (
                    <div key={index} className="bg-green-50 text-green-700 p-3 rounded-lg text-center text-sm font-medium">
                      {new Date(date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                  )) || <p className="text-gray-500">No dates available</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;