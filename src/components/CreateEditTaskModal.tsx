/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Task, SubTask } from '../types';

interface CreateEditTaskModalProps {
  task: Task | null; // null if creating a new task, otherwise editing
  onSave: (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onClose: () => void;
}

export default function CreateEditTaskModal({ task, onSave, onClose }: CreateEditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed'>('Pending');
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize fields if editing
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate);
      setPriority(task.priority);
      setStatus(task.status);
      setSubtasks(task.subtasks || []);
    } else {
      // Default due date: tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      setDueDate(`${yyyy}-${mm}-${dd}`);
      
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setStatus('Pending');
      setSubtasks([]);
    }
  }, [task]);

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSub: SubTask = {
      id: crypto.randomUUID(),
      title: newSubtaskTitle.trim(),
      done: false
    };
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(sub => sub.id !== id));
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(sub => sub.id === id ? { ...sub, done: !sub.done } : sub));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task Title is mandatory.');
      return;
    }

    setSaving(true);
    setError(null);

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      status,
      subtasks
    };

    try {
      await onSave(taskData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit task data.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight text-slate-900">
            {task ? 'Edit Task Settings' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1.5 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Task Title *</label>
            <input
              id="task-form-title"
              type="text"
              required
              placeholder="e.g. Optimize SQL index caches"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Task Description</label>
            <textarea
              id="task-form-description"
              placeholder="Provide a granular briefing of what needs to happen..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Due Date *</label>
              <input
                id="task-form-due-date"
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
              />
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Priority Level</label>
              <select
                id="task-form-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-900"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Task Lifecycle Status</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Pending', 'In Progress', 'Completed'] as const).map((s) => (
                <button
                  key={s}
                  id={`status-select-${s.replace(' ', '-')}`}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    status === s
                      ? 'bg-indigo-55/10 border-indigo-500 text-indigo-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Checklist Subtasks */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-slate-700 flex justify-between items-center">
              <span>Task Checklist / Subtasks ({subtasks.length})</span>
            </label>

            {/* Subtasks checklist */}
            {subtasks.length > 0 && (
              <div className="space-y-2 max-h-36 overflow-y-auto border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                {subtasks.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between gap-3 text-xs bg-white border border-slate-200/80 p-2 rounded-lg shadow-2xs">
                    <label className="flex items-center gap-2 cursor-pointer flex-1 select-none">
                      <input
                        type="checkbox"
                        checked={sub.done}
                        onChange={() => handleToggleSubtask(sub.id)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 accent-indigo-600"
                      />
                      <span className={`font-semibold ${sub.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {sub.title}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add subtask control */}
            <div className="flex gap-2">
              <input
                id="task-form-new-subtask"
                type="text"
                placeholder="Add checklist subtask..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <button
                id="task-form-add-subtask-btn"
                type="button"
                onClick={handleAddSubtask}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl transition-all border border-slate-200"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {!task && (
              <p className="text-[10px] text-indigo-600 font-medium">
                💡 Tip: You can leave checklist generation to Gemini AI! Click the AI Analyzer once the task is created.
              </p>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:border-slate-300 py-2.5 px-4 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            id="task-form-save-btn"
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 px-5 rounded-xl shadow-md hover:shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Save Task'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
