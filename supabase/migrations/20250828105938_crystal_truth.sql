/*
  # Kerala Trekking Booking System Database Schema

  1. New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `whatsapp` (text)
      - `created_at` (timestamp)
    
    - `packages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `short_description` (text)
      - `price` (integer)
      - `duration` (text)
      - `difficulty` (text)
      - `image_url` (text)
      - `gallery` (text array)
      - `trekking_spots` (text array)
      - `includes` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `package_dates`
      - `id` (uuid, primary key)
      - `package_id` (uuid, foreign key)
      - `date` (date)
      - `available_slots` (integer)
      - `created_at` (timestamp)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `package_id` (uuid, foreign key)
      - `package_date_id` (uuid, foreign key)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `number_of_people` (integer)
      - `total_amount` (integer)
      - `status` (text, enum: pending, confirmed, cancelled)
      - `booking_date` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for admin and public access
*/

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  whatsapp text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  short_description text NOT NULL,
  price integer NOT NULL,
  duration text NOT NULL,
  difficulty text NOT NULL DEFAULT 'Moderate',
  image_url text NOT NULL,
  gallery text[] DEFAULT '{}',
  trekking_spots text[] DEFAULT '{}',
  includes text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS package_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid REFERENCES packages(id) ON DELETE CASCADE,
  date date NOT NULL,
  available_slots integer DEFAULT 20,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid REFERENCES packages(id) ON DELETE CASCADE,
  package_date_id uuid REFERENCES package_dates(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  number_of_people integer DEFAULT 1,
  total_amount integer NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  booking_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can read their own data"
  ON admins FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Packages policies (public read, admin write)
CREATE POLICY "Anyone can read packages"
  ON packages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage packages"
  ON packages FOR ALL
  TO authenticated
  USING (true);

-- Package dates policies
CREATE POLICY "Anyone can read package dates"
  ON package_dates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage package dates"
  ON package_dates FOR ALL
  TO authenticated
  USING (true);

-- Bookings policies
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read bookings"
  ON bookings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (true);

-- Insert sample packages
INSERT INTO packages (name, short_description, description, price, duration, difficulty, image_url, gallery, trekking_spots, includes) VALUES
(
  'Meesapulimala Trek',
  'Highest peak in Idukki with breathtaking views',
  'Embark on an unforgettable journey to Meesapulimala, the second highest peak in Western Ghats. This trek offers panoramic views of rolling hills, tea plantations, and pristine valleys. Experience the raw beauty of Kerala''s hill stations with professional guides.',
  2500,
  '2 Days 1 Night',
  'Moderate',
  'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg',
  ARRAY[
    'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg',
    'https://images.pexels.com/photos/1266831/pexels-photo-1266831.jpeg',
    'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg'
  ],
  ARRAY[
    'Meesapulimala Peak (2640m)',
    'Rhodo Valley',
    'Silent Valley Viewpoint',
    'Tea Plantation Walks'
  ],
  ARRAY[
    'Professional Trek Guide',
    'Accommodation in Base Camp',
    'All Meals (Breakfast, Lunch, Dinner)',
    'First Aid Kit',
    'Transportation from Munnar'
  ]
),
(
  'Munnar Hills Trek',
  'Explore the pristine tea gardens and rolling hills',
  'Discover the enchanting beauty of Munnar through guided treks across tea plantations, spice gardens, and mountain trails. This moderate trek is perfect for families and beginners, offering stunning photography opportunities.',
  1800,
  '1 Day',
  'Easy',
  'https://images.pexels.com/photos/1266831/pexels-photo-1266831.jpeg',
  ARRAY[
    'https://images.pexels.com/photos/1266831/pexels-photo-1266831.jpeg',
    'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg',
    'https://images.pexels.com/photos/1266831/pexels-photo-1266831.jpeg'
  ],
  ARRAY[
    'Tea Museum Visit',
    'Echo Point',
    'Mattupetty Dam',
    'Top Station Viewpoint'
  ],
  ARRAY[
    'Experienced Guide',
    'Lunch at Local Restaurant',
    'Entry Tickets',
    'Transportation'
  ]
),
(
  'Chembra Peak Trek',
  'Heart-shaped lake and highest peak in Wayanad',
  'Challenge yourself with the highest peak in Wayanad district. Famous for its heart-shaped lake, Chembra Peak offers one of the most romantic and scenic treks in Kerala. Perfect for adventure enthusiasts.',
  2200,
  '1 Day',
  'Challenging',
  'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg',
  ARRAY[
    'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg',
    'https://images.pexels.com/photos/1266831/pexels-photo-1266831.jpeg',
    'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg'
  ],
  ARRAY[
    'Chembra Peak (2100m)',
    'Heart-shaped Lake',
    'Bamboo Grove',
    'Panoramic Valley Views'
  ],
  ARRAY[
    'Certified Trek Guide',
    'Packed Lunch',
    'Safety Equipment',
    'Forest Entry Permits',
    'Transportation from Kalpetta'
  ]
);

-- Insert sample dates for packages
INSERT INTO package_dates (package_id, date, available_slots)
SELECT 
  p.id,
  CURRENT_DATE + INTERVAL '1 day' * generate_series(1, 30),
  20
FROM packages p;