export interface Task {
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
  isCompleted: boolean;
}