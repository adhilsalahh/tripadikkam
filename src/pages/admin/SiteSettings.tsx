import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, Save, Upload, Palette, Type, Globe,
  Mountain, LogOut, Menu, X, Eye
} from 'lucide-react';
import { supabase, AdminSettings } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const SiteSettings: React.FC = () => {
  const { signOut } = useAuth();
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    logo_url: '',
    primary_color: '#16a34a',
    secondary_color: '#059669',
    font_family: 'Inter',
    site_title: 'NatureTrails'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings(data);
        setFormData({
          logo_url: data.logo_url || '',
          primary_color: data.primary_color || '#16a34a',
          secondary_color: data.secondary_color || '#059669',
          font_family: data.font_family || 'Inter',
          site_title: data.site_title || 'NatureTrails'
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (settings) {
        // Update existing settings
        const { error } = await supabase
          .from('admin_settings')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Create new settings
        const { error } = await supabase
          .from('admin_settings')
          .insert({
            ...formData,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      alert('Settings saved successfully!');
      fetchSettings();
    } catch (error: any) {
      alert('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const presetColors = [
    { name: 'Green', primary: '#16a34a', secondary: '#059669' },
    { name: 'Blue', primary: '#2563eb', secondary: '#1d4ed8' },
    { name: 'Purple', primary: '#9333ea', secondary: '#7c3aed' },
    { name: 'Red', primary: '#dc2626', secondary: '#b91c1c' },
    { name: 'Orange', primary: '#ea580c', secondary: '#c2410c' },
    { name: 'Teal', primary: '#0d9488', secondary: '#0f766e' }
  ];

  const fontOptions = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Source Sans Pro',
    'Nunito'
  ];

  const sidebarLinks = [
    { to: '/admin', icon: Mountain, label: 'Dashboard' },
    { to: '/admin/packages', icon: Settings, label: 'Manage Packages' },
    { to: '/admin/users', icon: Settings, label: 'Manage Users' },
    { to: '/admin/bookings', icon: Settings, label: 'Manage Bookings' },
    { to: '/admin/settings', icon: Settings, label: 'Site Settings', active: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-green-900 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-green-800">
          <div className="flex items-center space-x-2">
            <Mountain className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-green-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center px-6 py-3 transition-colors ${
                link.active 
                  ? 'bg-green-800 text-white' 
                  : 'text-green-100 hover:bg-green-800 hover:text-white'
              }`}
            >
              <link.icon className="h-5 w-5 mr-3" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={signOut}
            className="flex items-center w-full px-4 py-3 text-green-100 hover:bg-green-800 hover:text-white transition-colors rounded-lg"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
            </div>
            <Link
              to="/"
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>Preview Site</span>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse h-12 rounded-lg" />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Settings Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Website Configuration</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Site Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Globe className="inline h-4 w-4 mr-2" />
                        Site Title
                      </label>
                      <input
                        type="text"
                        name="site_title"
                        value={formData.site_title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter site title"
                      />
                    </div>

                    {/* Logo URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Upload className="inline h-4 w-4 mr-2" />
                        Logo URL
                      </label>
                      <input
                        type="url"
                        name="logo_url"
                        value={formData.logo_url}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="https://example.com/logo.png"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Enter a URL for your site logo. Leave empty to use the default mountain icon.
                      </p>
                    </div>

                    {/* Color Scheme */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        <Palette className="inline h-4 w-4 mr-2" />
                        Color Scheme
                      </label>
                      
                      {/* Preset Colors */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {presetColors.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              primary_color: color.primary,
                              secondary_color: color.secondary
                            }))}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              formData.primary_color === color.primary
                                ? 'border-gray-400 ring-2 ring-gray-300'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: color.primary }}
                              />
                              <div
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: color.secondary }}
                              />
                              <span className="text-sm font-medium">{color.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Custom Colors */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Primary Color</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              name="primary_color"
                              value={formData.primary_color}
                              onChange={handleInputChange}
                              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              name="primary_color"
                              value={formData.primary_color}
                              onChange={handleInputChange}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Secondary Color</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              name="secondary_color"
                              value={formData.secondary_color}
                              onChange={handleInputChange}
                              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              name="secondary_color"
                              value={formData.secondary_color}
                              onChange={handleInputChange}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Font Family */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Type className="inline h-4 w-4 mr-2" />
                        Font Family
                      </label>
                      <select
                        name="font_family"
                        value={formData.font_family}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {fontOptions.map((font) => (
                          <option key={font} value={font}>
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Save Button */}
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Preview */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                  
                  {/* Header Preview */}
                  <div 
                    className="rounded-lg p-4 mb-4"
                    style={{ 
                      background: `linear-gradient(to right, ${formData.primary_color}, ${formData.secondary_color})` 
                    }}
                  >
                    <div className="flex items-center space-x-2 text-white">
                      {formData.logo_url ? (
                        <img src={formData.logo_url} alt="Logo" className="h-6 w-6" />
                      ) : (
                        <Mountain className="h-6 w-6" />
                      )}
                      <span 
                        className="font-bold"
                        style={{ fontFamily: formData.font_family }}
                      >
                        {formData.site_title}
                      </span>
                    </div>
                  </div>

                  {/* Button Preview */}
                  <div className="space-y-3">
                    <button
                      className="w-full py-2 px-4 rounded-lg text-white font-medium"
                      style={{ 
                        backgroundColor: formData.primary_color,
                        fontFamily: formData.font_family 
                      }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="w-full py-2 px-4 rounded-lg text-white font-medium"
                      style={{ 
                        backgroundColor: formData.secondary_color,
                        fontFamily: formData.font_family 
                      }}
                    >
                      Secondary Button
                    </button>
                  </div>

                  {/* Text Preview */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 
                      className="font-bold text-gray-900 mb-2"
                      style={{ fontFamily: formData.font_family }}
                    >
                      Sample Heading
                    </h4>
                    <p 
                      className="text-gray-600 text-sm"
                      style={{ fontFamily: formData.font_family }}
                    >
                      This is how your text will appear with the selected font family.
                    </p>
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                    <p>Changes will be applied after saving and may require a page refresh to see full effects.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;