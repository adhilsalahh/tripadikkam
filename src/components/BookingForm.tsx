import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Users, Phone, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase, Package, PackageDate } from '../lib/supabase';

interface BookingFormProps {
  package: Package;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
}

interface BookingData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_people: number;
  package_date_id: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ package: pkg, onClose, onSuccess }) => {
  const [availableDates, setAvailableDates] = useState<PackageDate[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<PackageDate | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingData>();
  const watchedPeople = watch('number_of_people', 1);

  useEffect(() => {
    fetchAvailableDates();
  }, [pkg.id]);

  const fetchAvailableDates = async () => {
    try {
      const { data, error } = await supabase
        .from('package_dates')
        .select('*')
        .eq('package_id', pkg.id)
        .gte('date', new Date().toISOString().split('T')[0])
        .gt('available_slots', 0)
        .order('date');

      if (error) throw error;
      setAvailableDates(data);
    } catch (error) {
      console.error('Error fetching dates:', error);
    }
  };

  const onSubmit = async (data: BookingData) => {
    if (!selectedDate) return;

    setIsSubmitting(true);
    try {
      const totalAmount = pkg.price * data.number_of_people;

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert([{
          package_id: pkg.id,
          package_date_id: data.package_date_id,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone,
          number_of_people: data.number_of_people,
          total_amount: totalAmount,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Update available slots
      await supabase
        .from('package_dates')
        .update({ 
          available_slots: selectedDate.available_slots - data.number_of_people 
        })
        .eq('id', data.package_date_id);

      onSuccess(booking.id);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (dateId: string) => {
    const date = availableDates.find(d => d.id === dateId);
    setSelectedDate(date || null);
  };

  const totalAmount = pkg.price * (watchedPeople || 1);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Book {pkg.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Full Name
              </label>
              <input
                {...register('customer_name', { required: 'Name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter your full name"
              />
              {errors.customer_name && (
                <p className="text-red-500 text-sm mt-1">{errors.customer_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                {...register('customer_email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter your email"
              />
              {errors.customer_email && (
                <p className="text-red-500 text-sm mt-1">{errors.customer_email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number
              </label>
              <input
                {...register('customer_phone', { required: 'Phone number is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter your phone number"
              />
              {errors.customer_phone && (
                <p className="text-red-500 text-sm mt-1">{errors.customer_phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Number of People
              </label>
              <select
                {...register('number_of_people', { required: 'Number of people is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Select Date
            </label>
            <select
              {...register('package_date_id', { required: 'Please select a date' })}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Choose a date...</option>
              {availableDates.map(date => (
                <option key={date.id} value={date.id}>
                  {new Date(date.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} - {date.available_slots} slots available
                </option>
              ))}
            </select>
            {errors.package_date_id && (
              <p className="text-red-500 text-sm mt-1">{errors.package_date_id.message}</p>
            )}
          </div>

          {/* Booking Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Package:</span>
                <span>{pkg.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{pkg.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per person:</span>
                <span>₹{pkg.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Number of people:</span>
                <span>{watchedPeople || 1}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total Amount:</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default BookingForm;