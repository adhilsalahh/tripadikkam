import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  created_at: string;
}

export interface Package {
  id: string;
  title: string;
  description: string;
  destination: string;
  price: number;
  itinerary: string;
  images: string[];
  inclusions: string;
  exclusions: string;
  available_dates: string[];
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  package_id: string;
  full_name: string;
  email: string;
  phone: string;
  persons: number;
  travel_date: string;
  special_requests: string;
  booking_reference: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  package?: Package;
  user?: User;
}

export interface AdminSettings {
  id: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  site_title: string;
}