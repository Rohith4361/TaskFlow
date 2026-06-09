/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { dbService } from './server/db';
import { requireAuth, authUtils } from './server/auth-middleware';
import { aiService } from './server/ai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Auth Registration Route
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      res.status(400).json({ error: 'All fields (email, name, password) are required.' });
      return;
    }

    const passwordHash = dbService.hashPassword(password);
    const registeredUser = dbService.registerUser(email, name, passwordHash);

    if (!registeredUser) {
      res.status(400).json({ error: 'An account with this email address already exists.' });
      return;
    }

    const token = authUtils.generateToken(registeredUser.id);
    res.status(201).json({ token, user: registeredUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error during registration.' });
  }
});

// API Auth Login Route
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const passwordHash = dbService.hashPassword(password);
    const loggedUser = dbService.loginUser(email, passwordHash);

    if (!loggedUser) {
      res.status(401).json({ error: 'Invalid email or password combination.' });
      return;
    }

    const token = authUtils.generateToken(loggedUser.id);
    res.status(200).json({ token, user: loggedUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error during login.' });
  }
});

// GET list of tasks for the authenticated user
app.get('/api/tasks', requireAuth, (req, res) => {
  try {
    const tasks = dbService.getTasks(req.userId!);
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch tasks.' });
  }
});

// POST to create a task
app.post('/api/tasks', requireAuth, (req, res) => {
  try {
    const { title, description, dueDate, priority, status, subtasks } = req.body;
    if (!title || !dueDate || !priority || !status) {
      res.status(400).json({ error: 'Missing required parameters: title, dueDate, priority, status are required.' });
      return;
    }

    const task = dbService.createTask(req.userId!, {
      title,
      description: description || '',
      dueDate,
      priority,
      status,
      subtasks: subtasks || []
    });

    res.status(201).json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create task.' });
  }
});

// PUT to edit/update a task
app.put('/api/tasks/:id', requireAuth, (req, res) => {
  try {
    const taskId = req.params.id;
    const task = dbService.updateTask(req.userId!, taskId, req.body);
    
    if (!task) {
      res.status(404).json({ error: 'Task not found or access denied.' });
      return;
    }

    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update task.' });
  }
});

// DELETE to remove a task
app.delete('/api/tasks/:id', requireAuth, (req, res) => {
  try {
    const taskId = req.params.id;
    const success = dbService.deleteTask(req.userId!, taskId);

    if (!success) {
      res.status(404).json({ error: 'Task not found or access denied' });
      return;
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete task.' });
  }
});

// POST to run AI analysis on a task description
app.post('/api/tasks/:id/analyze', requireAuth, async (req, res) => {
  try {
    const taskId = req.params.id;
    const tasks = dbService.getTasks(req.userId!);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      res.status(404).json({ error: 'Task not found or access denied.' });
      return;
    }

    const insights = await aiService.analyzeTask(task.title, task.description);
    
    // Auto-update subtasks if AI recommended some, and save them
    const updatedSubtasks = [
      ...task.subtasks,
      ...insights.subtasks.map(title => ({
        id: crypto.randomUUID(),
        title,
        done: false
      }))
    ];

    const updatedTask = dbService.updateTask(req.userId!, taskId, {
      aiInsights: {
        complexity: insights.complexity,
        predictedHours: insights.predictedHours,
        suggestions: insights.suggestions
      },
      subtasks: updatedSubtasks
    });

    res.json(updatedTask);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI task analysis failed.' });
  }
});

// POST AI Chat assist
app.post('/api/ai/chat', requireAuth, async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message content is required.' });
      return;
    }

    const currentTasks = dbService.getTasks(req.userId!);
    const responseText = await aiService.assistantChat(history || [], currentTasks, message);
    
    res.json({ response: responseText });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Assistant chat failed.' });
  }
});

// Setup Vite Dev Server / Static Files Serving Middleware
async function initializeServer() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Running server in development (Vite Middleware mode)...');
    const viteInstance = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    
    app.use(viteInstance.middlewares);
  } else {
    console.log('Running server in production...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server loaded successfully and listening on http://0.0.0.0:${PORT}`);
  });
}

initializeServer().catch(err => {
  console.error('Critical server bootstrapping failure:', err);
});
