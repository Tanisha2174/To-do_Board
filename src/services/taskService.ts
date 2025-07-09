import { Task } from '../types';

class TaskService {
  private readonly STORAGE_KEY = 'taskflow_tasks';

  async getTasks(userId: string): Promise<Task[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tasks = this.getAllTasks();
    return tasks.filter(task => task.userId === userId);
  }

  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>, userId: string): Promise<Task> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tasks = this.getAllTasks();
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    tasks.push(newTask);
    this.setAllTasks(tasks);
    
    return newTask;
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tasks = this.getAllTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    tasks[taskIndex] = updatedTask;
    this.setAllTasks(tasks);
    
    return updatedTask;
  }

  async deleteTask(taskId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tasks = this.getAllTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    this.setAllTasks(filteredTasks);
  }

  private getAllTasks(): Task[] {
    const tasksStr = localStorage.getItem(this.STORAGE_KEY);
    if (!tasksStr) return [];
    
    try {
      return JSON.parse(tasksStr);
    } catch {
      return [];
    }
  }

  private setAllTasks(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }
}

export const taskService = new TaskService();