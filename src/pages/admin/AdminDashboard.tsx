import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, Package, Calendar, Settings, 
  TrendingUp, MapPin, Clock, CheckCircle,
  Mountain, LogOut, Menu, X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardStats {
  totalUsers: number;
  totalPackages: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  monthlyRevenue: number;
}

const AdminDashboard: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPackages: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch users count
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch packages count
      const { count: packagesCount } = await supabase
        .from('packages')
        .select('*', { count: 'exact', head: true });

      // Fetch bookings
      const { data: bookings, count: bookingsCount } = await supabase
        .from('bookings')
        .select(`
          *,
          package:packages(price)
        `, { count: 'exact' });

      const pendingCount = bookings?.filter(b => b.status === 'pending').length || 0;
      const confirmedCount = bookings?.filter(b => b.status === 'confirmed').length || 0;
      
      // Calculate monthly revenue (mock calculation)
      const revenue = bookings?.reduce((sum, booking) => {
        if (booking.status === 'confirmed') {
          return sum + ((booking.package?.price || 0) * booking.persons);
        }
        return sum;
      }, 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalPackages: packagesCount || 0,
        totalBookings: bookingsCount || 0,
        pendingBookings: pendingCount,
        confirmedBookings: confirmedCount,
        monthlyRevenue: revenue
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const sidebarLinks = [
    { to: '/admin', icon: TrendingUp, label: 'Dashboard' },
    { to: '/admin/packages', icon: Package, label: 'Manage Packages' },
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/admin/bookings', icon: Calendar, label: 'Manage Bookings' },
    { to: '/admin/settings', icon: Settings, label: 'Site Settings' }
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
          <div className="px-6 mb-6">
            <p className="text-green-200 text-sm">NAVIGATION</p>
          </div>
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center px-6 py-3 text-green-100 hover:bg-green-800 hover:text-white transition-colors"
            >
              <link.icon className="h-5 w-5 mr-3" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={handleSignOut}
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
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                View Website
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse h-32 rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-10 w-10 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Packages</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalPackages}</p>
                    </div>
                    <Package className="h-10 w-10 text-green-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                    </div>
                    <Calendar className="h-10 w-10 text-purple-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Booking Status */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <span className="text-gray-700">Pending Bookings</span>
                      </div>
                      <span className="font-semibold text-yellow-600">{stats.pendingBookings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">Confirmed Bookings</span>
                      </div>
                      <span className="font-semibold text-green-600">{stats.confirmedBookings}</span>
                    </div>
                  </div>
                  <Link
                    to="/admin/bookings"
                    className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Manage Bookings
                  </Link>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link
                      to="/admin/packages"
                      className="block w-full bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5" />
                        <span>Add New Package</span>
                      </div>
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block w-full bg-purple-50 hover:bg-purple-100 text-purple-700 p-3 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5" />
                        <span>View All Users</span>
                      </div>
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-700 p-3 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Settings className="h-5 w-5" />
                        <span>Site Settings</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;