import React from 'react';
import { Mountain, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Mountain className="h-8 w-8" />
              <span className="text-2xl font-bold">NatureTrails</span>
            </div>
            <p className="text-green-200 mb-4">
              Discover the world's most beautiful destinations with our carefully curated travel packages. 
              Experience nature like never before with professional guides and unforgettable adventures.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-green-200">
                <Mail className="h-4 w-4" />
                <span>info@naturetrails.com</span>
              </div>
              <div className="flex items-center space-x-2 text-green-200">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-green-200">
                <MapPin className="h-4 w-4" />
                <span>123 Adventure St, Mountain View, CA 94041</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-green-200 hover:text-white transition-colors">Home</a></li>
              <li><a href="/packages" className="text-green-200 hover:text-white transition-colors">Packages</a></li>
              <li><a href="/about" className="text-green-200 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-green-200 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><span className="text-green-200">Trekking Tours</span></li>
              <li><span className="text-green-200">Adventure Packages</span></li>
              <li><span className="text-green-200">Cultural Experiences</span></li>
              <li><span className="text-green-200">Photography Tours</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-200">
          <p>&copy; 2024 NatureTrails. All rights reserved. Crafted with love for adventurers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;