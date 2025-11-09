
import React, { useState } from 'react';
import type { Task, TaskList } from '../types';
import TaskItem from './TaskItem';
import { PlusIcon, SparklesIcon, LoaderIcon } from './icons';
import { suggestTasks } from '../services/geminiService';


interface TaskListComponentProps {
  list: TaskList;
  onTasksChange: (tasks: Task[]) => void;
}

const TaskListComponent: React.FC<TaskListComponentProps> = ({ list, onTasksChange }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionGoal, setSuggestionGoal] = useState('');
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);


  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() === '') return;

    const newTask: Task = {
      id: `${list.id}-${Date.now()}`,
      text: newTaskText.trim(),
      completed: false,
    };

    onTasksChange([...list.tasks, newTask]);
    setNewTaskText('');
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = list.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    onTasksChange(updatedTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = list.tasks.filter(task => task.id !== taskId);
    onTasksChange(updatedTasks);
  };
  
  const handleEditTask = (taskId: string, newText: string) => {
    const updatedTasks = list.tasks.map(task =>
      task.id === taskId ? { ...task, text: newText } : task
    );
    onTasksChange(updatedTasks);
    setEditingTaskId(null);
  }

  const handleGetSuggestions = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!suggestionGoal.trim()) return;
      setIsSuggestionLoading(true);
      setSuggestionError(null);
      try {
          const suggestedTaskItems = await suggestTasks(suggestionGoal);
          const newTasks: Task[] = suggestedTaskItems.map(item => ({
              id: `${list.id}-${Date.now()}-${Math.random()}`,
              text: item.text,
              completed: false
          }));
          onTasksChange([...list.tasks, ...newTasks]);
          setSuggestionGoal('');
          setIsSuggesting(false);
      } catch (error) {
          setSuggestionError(error instanceof Error ? error.message : "An unknown error occurred.");
      } finally {
          setIsSuggestionLoading(false);
      }
  }

  const uncompletedTasks = list.tasks.filter(t => !t.completed);
  const completedTasks = list.tasks.filter(t => t.completed);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <form onSubmit={handleAddTask} className="flex gap-3">
                <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="flex-shrink-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors" disabled={!newTaskText.trim()}>
                    <PlusIcon className="w-6 h-6" />
                </button>
            </form>
        </div>

        {isSuggesting && (
             <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-gray-900/50">
                 <form onSubmit={handleGetSuggestions} className="flex flex-col sm:flex-row gap-3">
                     <input
                         type="text"
                         value={suggestionGoal}
                         onChange={(e) => setSuggestionGoal(e.target.value)}
                         placeholder="e.g., Plan a birthday party"
                         className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                         autoFocus
                     />
                     <button type="submit" className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50 transition-colors" disabled={isSuggestionLoading || !suggestionGoal.trim()}>
                         {isSuggestionLoading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <SparklesIcon className="w-5 h-5" />}
                         <span>Suggest Tasks</span>
                     </button>
                 </form>
                  {suggestionError && <p className="text-red-500 text-sm mt-2">{suggestionError}</p>}
             </div>
        )}

        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {uncompletedTasks.map(task => (
                <TaskItem 
                    key={task.id}
                    task={task}
                    isEditing={editingTaskId === task.id}
                    onToggle={() => handleToggleTask(task.id)}
                    onDelete={() => handleDeleteTask(task.id)}
                    onStartEdit={() => setEditingTaskId(task.id)}
                    onCancelEdit={() => setEditingTaskId(null)}
                    onSaveEdit={(newText) => handleEditTask(task.id, newText)}
                />
            ))}
        </ul>

        {completedTasks.length > 0 && (
          <div>
            <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">Completed ({completedTasks.length})</h3>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {completedTasks.map(task => (
                    <TaskItem 
                        key={task.id}
                        task={task}
                        isEditing={false} // Cannot edit completed tasks
                        onToggle={() => handleToggleTask(task.id)}
                        onDelete={() => handleDeleteTask(task.id)}
                        onStartEdit={() => {}}
                        onCancelEdit={() => {}}
                        onSaveEdit={() => {}}
                    />
                ))}
            </ul>
          </div>
        )}

        {list.tasks.length === 0 && !isSuggesting && (
             <div className="text-center p-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">All tasks complete!</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add a new task or get some suggestions.</p>
             </div>
        )}
      </div>

       <div className="mt-6 flex justify-center">
            <button onClick={() => setIsSuggesting(!isSuggesting)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors">
                <SparklesIcon className="w-5 h-5"/>
                <span>{isSuggesting ? 'Hide AI Suggestions' : 'Suggest Tasks with AI'}</span>
            </button>
        </div>

    </div>
  );
};

export default TaskListComponent;
