import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';
import { StorageInterface } from './storage.interface';

const STORAGE_KEY = 'TASKS';
const DELETED_TASKS_KEY = 'DELETED_TASKS';


export const storageLocalProvider: StorageInterface = {
  init: async () => {
    // No initialization required for AsyncStorage
  },
  getTasks: async (): Promise<Task[]> => {
    const tasks = await AsyncStorage.getItem(STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  },

  saveTasks: async (tasks: Task[]): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  },

  addTask: async (task: Task): Promise<void> => {
    const tasks = await storageLocalProvider.getTasks();
    tasks.push(task);
    await storageLocalProvider.saveTasks(tasks);
  },

  updateTask: async (taskId:string, updatedTask: Partial<Task>): Promise<void> => {
    const tasks = await storageLocalProvider.getTasks();
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            ...updatedTask,
            updatedAt: Date.now(),
        }
        : task
    );
    await storageLocalProvider.saveTasks(updatedTasks);
  },

  deleteTask: async (taskId: string): Promise<void> => {
    const tasks = await storageLocalProvider.getTasks();
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
      ? {
        ...task,
        updatedAt: Date.now(),
        deletedAt: Date.now(), //work around because the api dosen't support real deletion
      }
      : task
    );
    // Save the updated task list
    await storageLocalProvider.saveTasks(updatedTasks);

    // Mark the task as deleted in a separate list for offline sync
    const deletedTasks = await storageLocalProvider.getDeletedTasks();
    if (!deletedTasks.includes(taskId)) {
      deletedTasks.push(taskId);
      await AsyncStorage.setItem(DELETED_TASKS_KEY, JSON.stringify(deletedTasks));
    }
  },

  getDeletedTasks: async (): Promise<string[]> => {
    const deletedTasks = await AsyncStorage.getItem(DELETED_TASKS_KEY);
    return deletedTasks ? JSON.parse(deletedTasks) : [];
  },

  deleteDeletedTask: async (taskId: string): Promise<void> => {
    const deletedTasks = await storageLocalProvider.getDeletedTasks();
    const updatedDeletedTasks = deletedTasks.filter((id) => id !== taskId);
    await AsyncStorage.setItem(DELETED_TASKS_KEY, JSON.stringify(updatedDeletedTasks));
  },

  clearDeletedTasks: async (): Promise<void> => {
    await AsyncStorage.removeItem(DELETED_TASKS_KEY);
  },

  clearStorage: async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}