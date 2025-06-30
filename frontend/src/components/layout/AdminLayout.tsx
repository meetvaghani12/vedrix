import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  BarChart2, 
  Settings, 
  FileText, 
  Shield, 
  Menu, 
  X, 
  LogOut,
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <Home className="w-5 h-5" /> },
    { name: 'User Management', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart2 className="w-5 h-5" /> },
    { name: 'Logs', path: '/admin/logs', icon: <FileText className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSwitchToUser = () => {
    // Store a flag in localStorage or sessionStorage to remember the user's choice
    localStorage.setItem('userMode', 'user');
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-black text-gray-300 font-outfit">
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col bg-zinc-900 border-r border-zinc-800 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800">
          {isSidebarOpen ? (
            <Link to="/admin" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-primary-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Admin</span>
            </Link>
          ) : (
            <Link to="/admin" className="mx-auto">
              <Shield className="w-8 h-8 text-primary-500" />
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-zinc-800 text-primary-400'
                    : 'text-gray-300 hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center">
                  {item.icon}
                  {isSidebarOpen && <span className="ml-3">{item.name}</span>}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-zinc-800 p-4">
          <button
            onClick={handleSwitchToUser}
            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-300 hover:bg-zinc-800 transition-colors mb-2`}
          >
            <Home className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3">Switch to User Mode</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg text-red-400 hover:bg-red-900/20 transition-colors`}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden bg-black bg-opacity-75 transition-opacity duration-300 ${
          isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileSidebar}
      ></div>

      <div
        className={`fixed inset-y-0 left-0 flex flex-col z-40 w-64 bg-zinc-900 transition-transform duration-300 ease-in-out transform md:hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800">
          <Link to="/admin" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Admin</span>
          </Link>
          <button
            onClick={toggleMobileSidebar}
            className="p-1 rounded-md text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-zinc-800 text-primary-400'
                    : 'text-gray-300 hover:bg-zinc-800'
                }`}
                onClick={toggleMobileSidebar}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-zinc-800 p-4">
          <button
            onClick={() => {
              handleSwitchToUser();
              toggleMobileSidebar();
            }}
            className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-300 hover:bg-zinc-800 transition-colors mb-2"
          >
            <Home className="w-5 h-5" />
            <span className="ml-3">Switch to User Mode</span>
          </button>
          <button
            onClick={() => {
              handleLogout();
              toggleMobileSidebar();
            }}
            className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-zinc-900 shadow-sm border-b border-zinc-800">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center md:hidden">
                <button
                  onClick={toggleMobileSidebar}
                  className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-white">
                  {navItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
                </h1>
              </div>
              <div className="flex items-center">
                <div className="md:hidden">
                  <h1 className="text-lg font-semibold text-white">
                    {navItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-black">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 