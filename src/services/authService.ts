import { User } from '../types';

class AuthService {
  private readonly STORAGE_KEY = 'taskflow_auth';
  private readonly USERS_KEY = 'taskflow_users';

  async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // For demo purposes, we'll store and check a simple password
    // In a real app, you'd hash and compare passwords properly
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    
    this.setCurrentUser(user);
    return user;
  }

  async register(email: string, password: string, name: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = this.getUsers();
    
    if (users.some(u => u.email === email)) {
      throw new Error('User already exists');
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      password, // Store password for demo (in real app, this would be hashed)
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    this.setUsers(users);
    this.setCurrentUser(newUser);
    
    return newUser;
  }

  async logout(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  async getCurrentUser(): Promise<User | null> {
    const userStr = localStorage.getItem(this.STORAGE_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  private getUsers(): User[] {
    const usersStr = localStorage.getItem(this.USERS_KEY);
    if (!usersStr) return [];
    
    try {
      return JSON.parse(usersStr);
    } catch {
      return [];
    }
  }

  private setUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }
}

export const authService = new AuthService();