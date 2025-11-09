import React from 'react';
import { MenuIcon, CheckCircleIcon } from './icons';

interface HeaderProps {
  onMenuClick: () => void;
  listName: string;
  onToggleSidebarCollapse: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, listName, onToggleSidebarCollapse }) => {
  return (
    <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center shadow-sm">
      <button onClick={onMenuClick} className="md:hidden mr-4 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400" aria-label="Open sidebar">
        <MenuIcon className="h-6 w-6" />
      </button>
       <button onClick={onToggleSidebarCollapse} className="hidden md:block mr-4 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400" aria-label="Toggle sidebar">
        <MenuIcon className="h-6 w-6" />
      </button>
      <div className="flex items-center gap-2">
        <CheckCircleIcon className="h-6 w-6 text-blue-500" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{listName}</h1>
      </div>
    </header>
  );
};

export default Header;