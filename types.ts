
export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskList {
  id: string;
  name: string;
  tasks: Task[];
}
