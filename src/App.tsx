import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { AuthForm } from './components/Auth/AuthForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TaskList } from './components/Tasks/TaskList';
import { Analytics } from './components/Analytics/Analytics';
import { Calendar } from './components/Calendar/Calendar';
import { Settings } from './components/Settings/Settings';

function App() {
  const { user, login, register, logout, isLoading, error } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState('dashboard');

  const {
    tasks,
    filteredTasks,
    createTask,
    updateTask,
    deleteTask,
    filter,
    setFilter,
    isLoading: tasksLoading,
  } = useTasks(user?.id || '');

  const handleAuthSubmit = async (data: { email: string; password: string; name?: string }) => {
    if (authMode === 'login') {
      await login(data.email, data.password);
    } else {
      await register(data.email, data.password, data.name!);
    }
  };

  const handleCreateTask = () => {
    setActiveTab('tasks');
  };

  const handleTaskClick = (task: any) => {
    // In a real app, this would open a task detail modal
    setActiveTab('tasks');
  };

  const handleUpdateUser = (updates: any) => {
    // In a real app, this would update the user in the backend
    console.log('Update user:', updates);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthForm
        mode={authMode}
        onSubmit={handleAuthSubmit}
        onToggleMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header user={user} onLogout={logout} />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard tasks={tasks} onCreateTask={handleCreateTask} />
          )}
          
          {activeTab === 'tasks' && (
            <TaskList
              tasks={filteredTasks}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onCreateTask={createTask}
              filter={filter}
              onFilterChange={setFilter}
            />
          )}
          
          {activeTab === 'analytics' && (
            <Analytics tasks={tasks} />
          )}
          
          {activeTab === 'calendar' && (
            <Calendar
              tasks={tasks}
              onCreateTask={handleCreateTask}
              onTaskClick={handleTaskClick}
            />
          )}
          
          {activeTab === 'settings' && (
            <Settings
              user={user}
              onUpdateUser={handleUpdateUser}
              onLogout={logout}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;