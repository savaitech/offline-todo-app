// SQLLite is better , but for this project we will use AsyncStorage as POC 
import { Task } from "../types";

export interface StorageInterface {
    init: () => Promise<void>;
    getTasks: () => Promise<Task[]>;
    addTask: (task: Task) => Promise<void>;
    saveTasks: (tasks: Task[]) => Promise<void>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    getDeletedTasks: () => Promise<string[]>;
    deleteDeletedTask: (id: string) => Promise<void>;
    clearDeletedTasks: () => Promise<void>;
    clearStorage: () => Promise<void>;
  }
  