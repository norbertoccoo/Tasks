
import React, { useState, useEffect, useRef } from 'react';
import type { Task } from '../types';
import { CircleIcon, CheckCircleIcon, TrashIcon } from './icons';

interface TaskItemProps {
  task: Task;
  isEditing: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: (newText: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, isEditing, onToggle, onDelete, onStartEdit, onCancelEdit, onSaveEdit }) => {
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editText.trim()) {
      onSaveEdit(editText.trim());
    } else {
        // if user clears text, just cancel edit
        onCancelEdit();
        setEditText(task.text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancelEdit();
      setEditText(task.text);
    }
  };
  
  return (
    <li className="group flex items-center px-4 py-3 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <button onClick={onToggle} className="flex-shrink-0 mr-4">
        {task.completed ? (
          <CheckCircleIcon className="w-6 h-6 text-blue-500" />
        ) : (
          <CircleIcon className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors" />
        )}
      </button>

      <div className="flex-1 w-0" onDoubleClick={() => !task.completed && onStartEdit()}>
        {isEditing ? (
           <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent p-0 border-0 focus:ring-0 text-gray-900 dark:text-white"
          />
        ) : (
          <span className={`truncate ${task.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
            {task.text}
          </span>
        )}
      </div>

      <button
        onClick={onDelete}
        className="ml-4 flex-shrink-0 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Delete task"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </li>
  );
};

export default TaskItem;
