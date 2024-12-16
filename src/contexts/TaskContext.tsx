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
  refreshTasks: () => Promise<void>;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);


export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const isOnline = useNetworkStatus();

  const loadTasks = async () => {
    const storedTasks = await storageService.getTasks();
    setTasks(storedTasks);
  };
  
  useEffect(() => {
    loadTasks(); 
    const intervalId = setInterval(() => {
      if (isOnline) {
        syncService.sync().then(() => {
          loadTasks();
        });
      }
    }, 30 * 1000); // Sync every 1 minute

    return () => clearInterval(intervalId);
  }, [isOnline]);


  const addTask = async (title: string) => {
    const newTask: Task = { 
      id: `local_${Date.now().toString()}`,
      todo: title, 
      completed: false, 
      updatedAt: Date.now() 
    };
    await storageService.addTask(newTask);
    await loadTasks();
  };

  const updateTask = async (task: Task) => {
    task.syncedAt = undefined;
    await storageService.updateTask(task.id, task);
    await loadTasks();
  }

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTask({ ...task, completed: !task.completed });
    await loadTasks();
  };

  const deleteTask = async (id: string) => {
    await storageService.deleteTask(id);
    await loadTasks();
  };

  const refreshTasks = async () => {
    await loadTasks();
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        refreshTasks,
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
