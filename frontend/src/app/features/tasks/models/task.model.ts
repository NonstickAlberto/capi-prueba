export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  complexity: number;
  urgency: number;
  priority_score: number;
  created_at: string;
  updated_at: string;
}

export interface TaskPayload {
  title: string;
  description?: string | null;
  complexity: number;
  urgency: number;
}

export interface LaravelCollectionResponse<T> {
  data: T[];
}

export interface LaravelItemResponse<T> {
  data: T;
}
