import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { Task } from '../types';
import { syncService } from '../services/syncService';
import useNetworkStatus from '../hooks/useNetworkStatus';
import storageService from '../providers';

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearTasks: () => Promise<void>;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const isOnline = useNetworkStatus();
  const [syncInterval, setSyncInterval] = useState(30 * 1000);

  const loadTasks = async () => {
    const storedTasks = await storageService.getTasks();
    setTasks(storedTasks.filter((t) => !t.deletedAt));
  };

  const syncTasks = async () => {
    if (isOnline) {
      await syncService.sync();
      await loadTasks();
    }
  };

  useEffect(() => {
    loadTasks();
    // Dynamic sync interval based on network status
    const intervalId = setInterval(syncTasks, syncInterval);

    return () => clearInterval(intervalId);
  }, [isOnline, syncInterval]);

  useEffect(() => {
    // Adjust sync interval dynamically when network status changes
    setSyncInterval(isOnline ? 5 * 1000 : 30 * 1000); // 5 seconds when online, 30 seconds when offline
  }, [isOnline]);

  const addTask = async (title: string) => {
    const newTask: Task = {
      id: `local_${Date.now().toString()}`, // Local task ID
      todo: title,
      completed: false,
      updatedAt: Date.now(),
    };
    await storageService.addTask(newTask);
    setTasks((prev) => [newTask, ...prev]);
    if (isOnline) await syncTasks();
  };

  const updateTask = async (task: Task) => {
    task.syncedAt = undefined;
    await storageService.updateTask(task.id, task);
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, ...task } : t))
    );
    if (isOnline) await syncTasks();
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updatedTask = { ...task, completed: !task.completed };
    await updateTask(updatedTask);
  };

  const deleteTask = async (id: string) => {
    await storageService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (isOnline) await syncTasks();
  };
  
  const clearTasks = async () => {
    await storageService.clearStorage();
    setTasks([]);
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        clearTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook for consuming the context
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
