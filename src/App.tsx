/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import LandingView from './components/LandingView';
import AuthForm from './components/AuthForm';
import TaskBoard from './components/TaskBoard';
import CreateEditTaskModal from './components/CreateEditTaskModal';
import ChatAssistant from './components/ChatAssistant';
import { Task, User, ChatMessage } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authFormMode, setAuthFormMode] = useState<'login' | 'register'>('login');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assistant'>('dashboard');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // 1. Auto-login on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('tasknexus-token');
    const savedUser = localStorage.getItem('tasknexus-user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('tasknexus-token');
        localStorage.removeItem('tasknexus-user');
      }
    }
  }, []);

  // 2. Fetch tasks when token changes
  useEffect(() => {
    if (!token) {
      setTasks([]);
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        } else if (res.status === 401) {
          handleLogout();
        }
      } catch (err) {
        console.error('Failed to retrieve task board:', err);
      }
    };

    fetchTasks();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('tasknexus-token');
    localStorage.removeItem('tasknexus-user');
    setToken(null);
    setUser(null);
    setTasks([]);
    setActiveTab('dashboard');
    setChatMessages([]);
  };

  const handleAuthSuccess = (newToken: string, loggedUser: User) => {
    localStorage.setItem('tasknexus-token', newToken);
    localStorage.setItem('tasknexus-user', JSON.stringify(loggedUser));
    setToken(newToken);
    setUser(loggedUser);
    setShowAuthForm(false);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!token) return;

    const method = editingTask ? 'PUT' : 'POST';
    const endpoint = editingTask ? `/api/tasks/${editingTask.id}` : '/api/tasks';

    const res = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to dispatch task action.');
    }

    const updatedTask = await res.json();

    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    } else {
      setTasks(prev => [updatedTask, ...prev]);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!token) return;
    if (!confirm('Are you absolutely sure you want to permanently delete this task?')) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete task.');
      }

      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to execute deletion pipeline.');
    }
  };

  const handleUpdateStatus = async (id: string, status: 'Pending' | 'In Progress' | 'Completed') => {
    if (!token) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => t.id === id ? updated : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSubtask = async (task: Task, subtaskId: string) => {
    if (!token) return;

    const updatedSubtasks = task.subtasks.map(s => 
      s.id === subtaskId ? { ...s, done: !s.done } : s
    );

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subtasks: updatedSubtasks })
      });

      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerAIAnalysis = async (id: string) => {
    if (!token) return;

    const res = await fetch(`/api/tasks/${id}/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Gemini core failed task analysis.');
    }

    const updated = await res.json();
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {user ? (
        <TaskBoard
          tasks={tasks}
          userName={user.name}
          onLogout={handleLogout}
          onAddTask={() => {
            setEditingTask(null);
            setShowTaskModal(true);
          }}
          onEditTask={(task) => {
            setEditingTask(task);
            setShowTaskModal(true);
          }}
          onDeleteTask={handleDeleteTask}
          onUpdateStatus={handleUpdateStatus}
          onToggleSubtask={handleToggleSubtask}
          onTriggerAIAnalysis={handleTriggerAIAnalysis}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          chatElement={
            <ChatAssistant
              token={token}
              tasks={tasks}
              messages={chatMessages}
              setMessages={setChatMessages}
            />
          }
        />
      ) : (
        <LandingView
          onGetStarted={() => {
            setAuthFormMode('register');
            setShowAuthForm(true);
          }}
          onLogin={() => {
            setAuthFormMode('login');
            setShowAuthForm(true);
          }}
        />
      )}

      {showAuthForm && (
        <AuthForm
          initialMode={authFormMode}
          onSuccess={handleAuthSuccess}
          onCancel={() => setShowAuthForm(false)}
        />
      )}

      {showTaskModal && (
        <CreateEditTaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}
