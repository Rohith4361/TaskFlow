/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Task, User } from '../src/types';

const DB_FILE_PATH = path.join(process.cwd(), 'server', 'db-storage.json');

interface DatabaseSchema {
  users: Record<string, User & { passwordHash: string }>;
  tasks: Record<string, Task>;
}

// Ensure database file and directories exist
function initDb(): DatabaseSchema {
  const serverDir = path.join(process.cwd(), 'server');
  if (!fs.existsSync(serverDir)) {
    fs.mkdirSync(serverDir, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE_PATH)) {
    const initialData: DatabaseSchema = {
      users: {},
      tasks: {}
    };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local database file. Reinitializing.', err);
    const initialData: DatabaseSchema = {
      users: {},
      tasks: {}
    };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

// Save data to the DB file
function writeDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database:', err);
  }
}

export const dbService = {
  // Hash password using native crypto pbkdf2 or simple sha256 with salt
  hashPassword(password: string): string {
    const salt = 'tasknexus-salt-2026';
    return crypto.createHmac('sha256', salt).update(password).digest('hex');
  },

  // Users Auth
  registerUser(email: string, name: string, passwordHash: string): User | null {
    const db = initDb();
    
    // Check if email already registered
    const normalizedEmail = email.toLowerCase().trim();
    const existing = Object.values(db.users).find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return null;
    }

    const userId = crypto.randomUUID();
    const newUser: User & { passwordHash: string } = {
      id: userId,
      email: normalizedEmail,
      name,
      createdAt: new Date().toISOString(),
      passwordHash
    };

    db.users[userId] = newUser;
    writeDb(db);

    // Return without password hash
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt
    };
  },

  loginUser(email: string, passwordHash: string): User | null {
    const db = initDb();
    const normalizedEmail = email.toLowerCase().trim();
    const user = Object.values(db.users).find(
      u => u.email.toLowerCase() === normalizedEmail && u.passwordHash === passwordHash
    );

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    };
  },

  // Tasks CRUD
  getTasks(userId: string): Task[] {
    const db = initDb();
    return Object.values(db.tasks)
      .filter(task => task.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createTask(userId: string, taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Task {
    const db = initDb();
    const taskId = crypto.randomUUID();
    const now = new Date().toISOString();

    const newTask: Task = {
      ...taskData,
      id: taskId,
      userId,
      createdAt: now,
      updatedAt: now
    };

    db.tasks[taskId] = newTask;
    writeDb(db);
    return newTask;
  },

  updateTask(userId: string, taskId: string, taskData: Partial<Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Task | null {
    const db = initDb();
    const task = db.tasks[taskId];
    if (!task || task.userId !== userId) {
      return null;
    }

    const updatedTask: Task = {
      ...task,
      ...taskData,
      updatedAt: new Date().toISOString()
    };

    db.tasks[taskId] = updatedTask;
    writeDb(db);
    return updatedTask;
  },

  deleteTask(userId: string, taskId: string): boolean {
    const db = initDb();
    const task = db.tasks[taskId];
    if (!task || task.userId !== userId) {
      return false;
    }

    delete db.tasks[taskId];
    writeDb(db);
    return true;
  }
};
