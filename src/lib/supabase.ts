import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Package {
  id: string;
  name: string;
  description: string;
  short_description: string;
  price: number;
  duration: string;
  difficulty: string;
  image_url: string;
  gallery: string[];
  trekking_spots: string[];
  includes: string[];
  created_at: string;
  updated_at: string;
}

export interface PackageDate {
  id: string;
  package_id: string;
  date: string;
  available_slots: number;
  created_at: string;
}

export interface Booking {
  id: string;
  package_id: string;
  package_date_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_people: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  booking_date: string;
  created_at: string;
  packages?: Package;
  package_dates?: PackageDate;
}

export interface Admin {
  id: string;
  email: string;
  whatsapp?: string;
  created_at: string;
}