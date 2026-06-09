/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SubTask {
  id: string;
  title: string;
  done: boolean;
}

export interface TaskAIInsights {
  complexity?: 'Low' | 'Medium' | 'High';
  predictedHours?: number;
  suggestions?: string[];
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  subtasks: SubTask[];
  aiInsights?: TaskAIInsights;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
