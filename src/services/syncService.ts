import { apiService } from './apiService';
import storageManager from '../providers';

export const syncService = {
  sync: async () => {
    // Fetch local and server tasks
    const localTasks = await storageManager.getTasks();
    const result  = await apiService.get('todos');
    const serverTasks = result.todos
    .slice(0, 15)
    .map((task: any) => ({
      ...task,
      // mock updatedAt to simulate changes on the server and client
      updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // Two days ago
    }));

    // Resolve conflicts: Merge tasks
    const mergedTasks = resolveConflicts(localTasks, serverTasks);

    // Save merged tasks to local storage
    await storageManager.saveTasks(mergedTasks);

    // Push new/updated tasks to server
    for (const task of mergedTasks) {
      // if the id start with local_ then it is a new task
      if (`${task.id}`.startsWith('local_')) {
        await apiService.post('todos/add', {
          ...task,
          userId : '123'
        });
        
        await storageManager.updateTask(
          task.id,
          {
          ...task,
          // the dummyjson return id aloways 255  make it unique 
          id: Date.now(), 
          syncedAt: Date.now(),
        });
      }
      
      if (!task.syncedAt) {
        await apiService.put(`todos/1`, {
          completed: task.completed,
        })
        await storageManager.updateTask(task.id, {
            ...task,
            syncedAt: Date.now(),
          });
      }
    }
    // Delete tasks marked for deletion
    const deletedTasks = await storageManager.getDeletedTasks();
    for (const taskId of deletedTasks) {
      try {
        if (`${taskId}`.startsWith('local_')) {
          storageManager.deleteDeletedTask(taskId);
          continue;
        }
        await apiService.delete(`todos/1`);
        storageManager.deleteDeletedTask(taskId);
      } catch (error) {
        console.error('Failed to delete task', taskId);
      }
    }
  },
};

/**
 * Resolves conflicts between local and server tasks by merging them.
 * 
 * This function takes two arrays of tasks, `localTasks` and `serverTasks`, and merges them into a single array.
 * If a task exists in both arrays, the task with the more recent `updatedAt` timestamp is kept.
 * If a task exists only in the local array, it is added to the merged array.
 * 
 * @param {any[]} localTasks - An array of tasks from the local storage.
 * @param {any[]} serverTasks - An array of tasks from the server.
 * @returns {any[]} - A merged array of tasks with conflicts resolved.
*/
const resolveConflicts = (localTasks: any[], serverTasks: any[]) => {
  const merged = [...serverTasks];
  localTasks.forEach((localTask) => {
    const serverTask = serverTasks.find((task) => task.id === localTask.id);
    if (!serverTask) {
      merged.push(localTask);
    } else if (localTask.updatedAt > serverTask.updatedAt) {
      // Local task is more recent
      const index = merged.findIndex((task) => task.id === serverTask.id);
      merged[index] = localTask;
    }
  });

  return merged;
};
