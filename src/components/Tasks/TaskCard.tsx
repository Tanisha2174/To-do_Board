import React from 'react';
import { MoreVertical, Calendar, AlertCircle, CheckCircle, Clock, Trash2, Edit } from 'lucide-react';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onStatusChange: (status: Task['status']) => void;
  onDelete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  onStatusChange,
  onDelete,
}) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
          <span className="text-xs text-gray-500 uppercase tracking-wider">{task.category}</span>
        </div>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div onClick={onClick}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{task.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${getStatusColor(task.status)}`}>
              {getStatusIcon(task.status)}
              <span>{task.status.replace('-', ' ')}</span>
            </span>
          </div>

          {task.dueDate && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange('pending');
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              task.status === 'pending' ? 'bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange('in-progress');
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-200 hover:bg-yellow-300'
            }`}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange('completed');
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              task.status === 'completed' ? 'bg-green-500' : 'bg-gray-200 hover:bg-green-300'
            }`}
          />
        </div>

        <span className="text-xs text-gray-400">
          {new Date(task.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};