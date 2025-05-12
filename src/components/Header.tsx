import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, HelpCircle, User } from 'lucide-react';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-20 flex h-16 bg-white shadow-sm">
      <div className="flex flex-1 justify-between items-center px-4 md:px-6">
        <div className="flex items-center">
          <button
            type="button"
            className="md:hidden -ml-1 p-2 rounded-md text-neutral-800 hover:text-primary-600 hover:bg-neutral-200 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="ml-2 md:ml-0">
            <h1 className="text-xl font-heading font-bold text-neutral-800">Pocketax</h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            className="p-1 rounded-full text-neutral-800 hover:text-primary-600 hover:bg-neutral-200"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button 
            className="p-1 rounded-full text-neutral-800 hover:text-primary-600 hover:bg-neutral-200"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          <Link 
            to="/account-settings" 
            className="p-1 rounded-full text-neutral-800 hover:text-primary-600 hover:bg-neutral-200"
            aria-label="Profile"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;