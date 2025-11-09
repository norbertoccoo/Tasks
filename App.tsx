import React, { useState, useMemo } from 'react';
import { Task, TaskList } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskListComponent from './components/TaskList';

const initialLists: TaskList[] = [
  {
    id: '1',
    name: 'My Tasks',
    tasks: [
      { id: '1-1', text: 'Welcome to your new task manager!', completed: false },
      { id: '1-2', text: 'Click the checkbox to complete a task', completed: false },
      { id: '1-3', text: 'Use the "+" button to add a new task', completed: false },
      { id: '1-4', text: 'Create new lists from the sidebar', completed: true },
    ],
  },
  {
    id: '2',
    name: 'Shopping List',
    tasks: [],
  },
];

function App() {
  const [taskLists, setTaskLists] = useLocalStorage<TaskList[]>('taskLists', initialLists);
  const [currentListId, setCurrentListId] = useLocalStorage<string>('currentListId', '1');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useLocalStorage<boolean>('sidebarCollapsed', false);

  const currentList = useMemo(() => 
    taskLists.find((list) => list.id === currentListId) || taskLists[0], 
    [taskLists, currentListId]
  );
  
  if (!currentList && taskLists.length > 0) {
      setCurrentListId(taskLists[0].id);
  } else if (!currentList && taskLists.length === 0) {
      const newListId = Date.now().toString();
      const defaultList: TaskList = { id: newListId, name: 'My Tasks', tasks: [] };
      setTaskLists([defaultList]);
      setCurrentListId(newListId);
  }

  const handleUpdateLists = (newLists: TaskList[]) => {
    setTaskLists(newLists);
  };
  
  const handleSelectList = (listId: string) => {
    setCurrentListId(listId);
    setSidebarOpen(false);
  };

  const handleAddList = (name: string) => {
    if (name.trim() === '') return;
    const newList: TaskList = {
      id: Date.now().toString(),
      name,
      tasks: [],
    };
    const updatedLists = [...taskLists, newList];
    handleUpdateLists(updatedLists);
    setCurrentListId(newList.id);
  };

  const handleDeleteList = (listId: string) => {
    if (taskLists.length <= 1) {
        alert("You must have at least one task list.");
        return;
    }
    const newLists = taskLists.filter(list => list.id !== listId);
    handleUpdateLists(newLists);
    if (currentListId === listId) {
        setCurrentListId(newLists[0].id);
    }
  };

  const updateTasksForCurrentList = (tasks: Task[]) => {
    const newLists = taskLists.map((list) =>
      list.id === currentListId ? { ...list, tasks } : list
    );
    handleUpdateLists(newLists);
  };
  
  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar 
        lists={taskLists}
        currentListId={currentListId}
        onSelectList={handleSelectList}
        onAddList={handleAddList}
        onDeleteList={handleDeleteList}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <Header 
          onMenuClick={() => setSidebarOpen(!isSidebarOpen)} 
          listName={currentList?.name || 'Tasks'} 
          onToggleSidebarCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">
          {currentList ? (
            <TaskListComponent key={currentList.id} list={currentList} onTasksChange={updateTasksForCurrentList} />
          ) : (
             <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select or create a list to get started.</p>
             </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;