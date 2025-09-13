/*
  # Travel Packages Database Schema

  This migration creates the complete database schema for the NatureTrails travel packages website.

  ## New Tables

  1. **users**
     - `id` (uuid, primary key) 
     - `email` (text, unique)
     - `name` (text)
     - `phone` (text)
     - `created_at` (timestamp)

  2. **packages** 
     - `id` (uuid, primary key)
     - `title` (text)
     - `description` (text)
     - `destination` (text)
     - `price` (numeric)
     - `itinerary` (text)
     - `images` (text array)
     - `inclusions` (text)
     - `exclusions` (text)
     - `available_dates` (text array)
     - `created_at` (timestamp)

  3. **bookings**
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key)
     - `package_id` (uuid, foreign key)
     - `full_name` (text)
     - `email` (text)
     - `phone` (text)
     - `persons` (integer)
     - `travel_date` (date)
     - `special_requests` (text)
     - `booking_reference` (text, unique)
     - `status` (text)
     - `created_at` (timestamp)

  4. **admin_settings**
     - `id` (uuid, primary key)
     - `logo_url` (text)
     - `primary_color` (text)
     - `secondary_color` (text)
     - `font_family` (text)
     - `site_title` (text)
     - `updated_at` (timestamp)

  ## Security
     - Enable RLS on all tables
     - Add policies for authenticated users
     - Admin access policies
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  destination text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  itinerary text NOT NULL DEFAULT '',
  images text[] DEFAULT '{}',
  inclusions text NOT NULL DEFAULT '',
  exclusions text NOT NULL DEFAULT '',
  available_dates text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  package_id uuid REFERENCES packages(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  persons integer NOT NULL DEFAULT 1,
  travel_date date NOT NULL,
  special_requests text DEFAULT '',
  booking_reference text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url text DEFAULT '',
  primary_color text DEFAULT '#16a34a',
  secondary_color text DEFAULT '#059669',
  font_family text DEFAULT 'Inter',
  site_title text DEFAULT 'NatureTrails',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Packages policies (public read, admin write)
CREATE POLICY "Anyone can read packages" ON packages
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can manage packages" ON packages
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@123');

-- Bookings policies
CREATE POLICY "Users can read own bookings" ON bookings
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can read all bookings" ON bookings
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@123');

CREATE POLICY "Admin can manage bookings" ON bookings
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@123');

-- Admin settings policies
CREATE POLICY "Anyone can read settings" ON admin_settings
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can manage settings" ON admin_settings
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@123');

-- Insert default admin settings
INSERT INTO admin_settings (logo_url, primary_color, secondary_color, font_family, site_title)
VALUES ('', '#16a34a', '#059669', 'Inter', 'NatureTrails')
ON CONFLICT DO NOTHING;

-- Insert sample packages
INSERT INTO packages (title, description, destination, price, itinerary, images, inclusions, exclusions, available_dates) VALUES
(
  'Himalayan Base Camp Trek',
  'Experience the ultimate adventure with our Himalayan Base Camp Trek. This 14-day journey takes you through breathtaking landscapes, traditional villages, and up to the base of the world''s highest peaks.',
  'Nepal Himalayas',
  2499,
  'Day 1: Arrival in Kathmandu
Day 2-3: Fly to Lukla, Trek to Namche Bazaar
Day 4-7: Acclimatization and Trek to Tengboche
Day 8-11: Trek to Base Camp
Day 12-14: Return journey to Lukla',
  ARRAY[
    'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg',
    'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg',
    'https://images.pexels.com/photos/1144176/pexels-photo-1144176.jpeg'
  ],
  'Professional guide, permits, accommodation, meals during trek, domestic flights',
  'International flights, personal equipment, insurance, tips',
  ARRAY['2024-03-15', '2024-04-10', '2024-05-05', '2024-09-20', '2024-10-15']
),
(
  'Amazon Rainforest Expedition',
  'Immerse yourself in the heart of the Amazon rainforest on this incredible 10-day expedition. Discover exotic wildlife, learn from indigenous communities, and experience the world''s most biodiverse ecosystem.',
  'Amazon Basin, Peru',
  1899,
  'Day 1-2: Arrival in Iquitos, River journey
Day 3-5: Deep jungle exploration
Day 6-7: Wildlife spotting and photography
Day 8-9: Indigenous community visit
Day 10: Return to Iquitos',
  ARRAY[
    'https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
  ],
  'Expert naturalist guide, boat transport, eco-lodge accommodation, all meals, equipment',
  'International flights, personal items, optional activities, gratuities',
  ARRAY['2024-06-01', '2024-07-15', '2024-08-10', '2024-11-05']
),
(
  'Iceland Northern Lights Adventure',
  'Chase the magical Northern Lights across Iceland''s stunning landscapes. This 8-day winter adventure combines natural wonders, hot springs, and the chance to witness one of nature''s most spectacular displays.',
  'Iceland',
  1599,
  'Day 1-2: Arrival in Reykjavik, Golden Circle
Day 3-4: South Coast waterfalls and glaciers
Day 5-6: Northern lights hunting
Day 7-8: Blue Lagoon and departure',
  ARRAY[
    'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg',
    'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg'
  ],
  'Professional guide, transportation, accommodation, Northern Lights tours, Blue Lagoon entry',
  'International flights, meals not specified, personal expenses',
  ARRAY['2024-12-01', '2024-12-15', '2025-01-10', '2025-02-05']
);