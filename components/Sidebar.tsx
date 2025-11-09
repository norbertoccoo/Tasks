import React, { useState } from 'react';
import type { TaskList } from '../types';
import { PlusIcon, TrashIcon, XIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

interface SidebarProps {
  lists: TaskList[];
  currentListId: string;
  onSelectList: (id: string) => void;
  onAddList: (name: string) => void;
  onDeleteList: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ lists, currentListId, onSelectList, onAddList, onDeleteList, isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const [newListName, setNewListName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddListSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddList(newListName);
    setNewListName('');
    setIsAdding(false);
  };
  
  const handleAddNewListClick = () => {
    if (isCollapsed) {
      onToggleCollapse();
    }
    setIsAdding(true);
  }

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewListName('');
  }


  return (
    <>
      <aside className={`absolute md:relative z-20 flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${isCollapsed ? 'md:w-20' : 'md:w-72'}`}>
        <div className="flex flex-col h-full">
            <div className={`p-4 flex items-center border-b border-gray-200 dark:border-gray-700 ${isCollapsed ? 'md:justify-center' : 'justify-between'}`}>
                <h2 className={`text-lg font-bold whitespace-nowrap ${isCollapsed ? 'md:hidden' : ''}`}>Task Lists</h2>
                <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <XIcon className="w-6 h-6"/>
                </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-2 space-y-1">
              {lists.map(list => (
                <li key={list.id}>
                  <button
                    onClick={() => onSelectList(list.id)}
                    title={isCollapsed ? list.name : undefined}
                    className={`group w-full text-left flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ${isCollapsed ? 'justify-center' : 'justify-between'} ${currentListId === list.id ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                       <span className={`hidden text-xs w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0 ${isCollapsed ? 'md:flex md:items-center md:justify-center' : 'md:hidden'}`}>
                         {list.name.charAt(0).toUpperCase()}
                       </span>
                       <span className={`truncate ${isCollapsed ? 'md:hidden' : ''}`}>{list.name}</span>
                    </div>
                     <button 
                       onClick={(e) => { e.stopPropagation(); onDeleteList(list.id); }}
                       className={`shrink-0 opacity-0 text-gray-400 hover:text-red-500 transition-opacity ${isCollapsed ? 'hidden' : 'group-hover:opacity-100'}`}
                       aria-label={`Delete list ${list.name}`}
                     >
                       <TrashIcon className="w-4 h-4"/>
                     </button>
                  </button>
                </li>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              {isAdding && !isCollapsed ? (
                <form onSubmit={handleAddListSubmit}>
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="New list name"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                    onBlur={() => { if(!newListName) handleCancelAdd() }}
                  />
                   <div className="flex justify-end gap-2 mt-2">
                     <button type="button" onClick={handleCancelAdd} className="px-3 py-1 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">Cancel</button>
                     <button type="submit" className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50" disabled={!newListName.trim()}>Add</button>
                   </div>
                </form>
              ) : (
                <button
                  onClick={handleAddNewListClick}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-150 ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <PlusIcon className="w-5 h-5" />
                  <span className={isCollapsed ? 'md:hidden' : ''}>New List</span>
                </button>
              )}
            </div>
            <div className="p-2 border-t border-gray-200 dark:border-gray-700 hidden md:block">
              <button onClick={onToggleCollapse} className="w-full flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
                {isCollapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
              </button>
            </div>
        </div>
      </aside>
       {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/30 z-10 md:hidden"></div>}
    </>
  );
};

export default Sidebar;