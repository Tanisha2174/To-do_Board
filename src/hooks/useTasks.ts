import { useState, useEffect } from 'react';
import { Task, TaskState } from '../types';
import { taskService } from '../services/taskService';

export const useTasks = (userId: string) => {
  const [taskState, setTaskState] = useState<TaskState>({
    tasks: [],
    isLoading: true,
    error: null,
    filter: {
      status: 'all',
      priority: 'all',
      category: 'all',
    },
  });

  useEffect(() => {
    if (userId) {
      loadTasks();
    }
  }, [userId]);

  const loadTasks = async () => {
    setTaskState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const tasks = await taskService.getTasks(userId);
      setTaskState(prev => ({
        ...prev,
        tasks,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setTaskState(prev => ({
        ...prev,
        tasks: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load tasks',
      }));
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      const newTask = await taskService.createTask(taskData, userId);
      setTaskState(prev => ({
        ...prev,
        tasks: [...prev.tasks, newTask],
      }));
      return newTask;
    } catch (error) {
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, updates);
      setTaskState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => 
          task.id === taskId ? updatedTask : task
        ),
      }));
      return updatedTask;
    } catch (error) {
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTaskState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== taskId),
      }));
    } catch (error) {
      throw error;
    }
  };

  const setFilter = (filter: Partial<TaskState['filter']>) => {
    setTaskState(prev => ({
      ...prev,
      filter: { ...prev.filter, ...filter },
    }));
  };

  const filteredTasks = taskState.tasks.filter(task => {
    const { status, priority, category } = taskState.filter;
    
    if (status !== 'all' && task.status !== status) return false;
    if (priority !== 'all' && task.priority !== priority) return false;
    if (category !== 'all' && task.category !== category) return false;
    
    return true;
  });

  return {
    ...taskState,
    filteredTasks,
    createTask,
    updateTask,
    deleteTask,
    setFilter,
    refreshTasks: loadTasks,
  };
};