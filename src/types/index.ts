export type RootStackParamList = {
  TaskListScreen: undefined;
  TaskDetails: {
    task?: Task;
  };
};

export interface Task {
  id: string;
  todo: string;
  completed: boolean;
  updatedAt: number;
  syncedAt?: number;
}