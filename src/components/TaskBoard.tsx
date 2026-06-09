/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, Plus, Calendar, AlertCircle, Edit3, Trash2, CheckSquare, Clock, 
  Search, SlidersHorizontal, ArrowUpDown, BrainCircuit, Bot, LogOut, CheckCircle2, User, RefreshCw
} from 'lucide-react';
import { Task, SubTask } from '../types';

interface TaskBoardProps {
  tasks: Task[];
  userName: string;
  onLogout: () => void;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => Promise<void>;
  onUpdateStatus: (id: string, status: 'Pending' | 'In Progress' | 'Completed') => Promise<void>;
  onToggleSubtask: (task: Task, subtaskId: string) => Promise<void>;
  onTriggerAIAnalysis: (id: string) => Promise<void>;
  activeTab: 'dashboard' | 'assistant';
  setActiveTab: (tab: 'dashboard' | 'assistant') => void;
  chatElement: React.ReactNode;
}

export default function TaskBoard({
  tasks,
  userName,
  onLogout,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onUpdateStatus,
  onToggleSubtask,
  onTriggerAIAnalysis,
  activeTab,
  setActiveTab,
  chatElement
}: TaskBoardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [sortBy, setSortBy] = useState<'dueDate' | 'createdAt' | 'priority'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  // Stats calculation
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter and Sort Logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'dueDate') {
      comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === 'createdAt') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === 'priority') {
      const pLevel = { High: 3, Medium: 2, Low: 1 };
      comparison = pLevel[b.priority] - pLevel[a.priority];
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleRunAI = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnalyzingId(id);
    try {
      await onTriggerAIAnalysis(id);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-350 flex flex-col justify-between border-r border-slate-800 p-6 shrink-0 z-30">
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-550/20">
                T
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">TaskFlow</span>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-1">
              <button
                id="sidebar-tab-dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-md text-sm font-semibold tracking-wide transition-all text-left ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-600/10 border-l-4 border-indigo-500 text-indigo-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-4 border-transparent'
                }`}
              >
                <CheckSquare className="w-5 h-5 shrink-0" />
                <span>Dashboard</span>
              </button>
              <button
                id="sidebar-tab-assistant"
                onClick={() => setActiveTab('assistant')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-md text-sm font-semibold tracking-wide transition-all text-left ${
                  activeTab === 'assistant'
                    ? 'bg-indigo-600/10 border-l-4 border-indigo-500 text-indigo-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-4 border-transparent'
                }`}
              >
                <Bot className="w-5 h-5 shrink-0" />
                <span>AI Assistant</span>
              </button>
            </nav>
          </div>

          {/* Interactive Pro Account Promotion Box from Design Template */}
          <div className="mt-8 mb-4">
            <div className="bg-indigo-600 rounded-xl p-4 text-white text-center shadow-md">
              <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold mb-1">Pro Account</p>
              <p className="text-xs mb-3 text-indigo-100">Upgrade for unlimited AI insights</p>
              <button 
                onClick={() => alert("TaskNexus Intelligence Pro Plan activated for " + userName + "!")}
                className="w-full py-2 bg-white text-indigo-600 hover:bg-slate-50 active:scale-95 transition-all rounded-lg text-xs font-bold shadow-md cursor-pointer"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>

        {/* User profile & logout bottom panel */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-indigo-400 font-semibold text-xs shrink-0 border border-slate-700">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-slate-300 truncate">{userName}</span>
          </div>
          <button
            id="sidebar-logout-btn"
            onClick={onLogout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-800 rounded-lg transition-all border border-transparent hover:border-slate-750"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col p-4 sm:p-8 overflow-y-auto max-h-screen">
        {activeTab === 'assistant' ? (
          <div className="max-w-4xl w-full mx-auto flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">AI Collaboration Assistant</h1>
                <p className="text-slate-500 text-xs mt-1 font-medium">Discuss re-prioritizing, ask about status, or outline scheduling suggestions.</p>
              </div>
            </div>
            {chatElement}
          </div>
        ) : (
          <div className="w-full space-y-6">
            {/* Header / Brand Ribbon */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Project Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">Manage and track your active work agenda.</p>
              </div>
              <button
                id="create-task-head-btn"
                onClick={onAddTask}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-100 transition-all text-xs shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>

            {/* Metrics Grid Cards from Sleek Design Template */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Tasks</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-3xl font-bold font-display text-slate-900">{totalTasks}</h3>
                  <span className="text-indigo-500 text-[10px] font-bold uppercase font-mono tracking-wider">Registered</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Pending Item</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-3xl font-bold font-display text-slate-900">{pendingTasks}</h3>
                  <span className="text-amber-500 text-[10px] font-bold uppercase font-mono tracking-wider">Urgent</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">In Progress</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-3xl font-bold font-display text-slate-900">{inProgressTasks}</h3>
                  <span className="text-indigo-500 text-[10px] font-bold uppercase font-mono tracking-wider">Active</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Completed</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-3xl font-bold font-display text-slate-900">{completedTasks}</h3>
                  <span className="text-emerald-500 text-[10px] font-bold uppercase font-mono tracking-wider">Done</span>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col justify-between">
                <p className="opacity-80 text-xs font-medium uppercase tracking-wider">Completion Rate</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-3xl font-bold font-display">{completionRate}%</h3>
                  <div className="w-14 h-1.5 bg-white/20 rounded-full mb-1.5 overflow-hidden">
                    <div className="bg-white h-full transition-all duration-300" style={{ width: `${completionRate}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Control Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    id="task-search-input"
                    type="text"
                    placeholder="Search tasks or descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-550/15 focus:border-indigo-500 font-medium transition-all"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Status Dropdown */}
                  <div className="flex items-center bg-slate-50 border border-slate-200/60 rounded-xl px-2.5 py-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mr-1.5">Status:</span>
                    <select
                      id="filter-status-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Priority Dropdown */}
                  <div className="flex items-center bg-slate-50 border border-slate-200/60 rounded-xl px-2.5 py-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mr-1.5">Priority:</span>
                    <select
                      id="filter-priority-select"
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value as any)}
                      className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Priorities</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  {/* Sorting dropdown */}
                  <div className="flex items-center border border-slate-200/60 rounded-xl overflow-hidden bg-slate-50">
                    <div className="flex items-center px-2.5 py-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase mr-1.5">Sort:</span>
                      <select
                        id="sort-by-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                      >
                        <option value="dueDate">Due Date</option>
                        <option value="createdAt">Created Date</option>
                        <option value="priority">Priority</option>
                      </select>
                    </div>
                    <button
                      id="sort-order-toggle"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      type="button"
                      title="Toggle Sort Directions"
                      className="px-2.5 py-2.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors border-l border-slate-200/60 cursor-pointer"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Cards Matrix Grid */}
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500 shadow-2xs max-w-md mx-auto my-12">
                <AlertCircle className="w-10 h-10 text-indigo-500 mx-auto mb-4" />
                <h4 className="font-display font-bold text-sm text-slate-900 tracking-tight">No match tasks found</h4>
                <p className="text-xs text-slate-500 mt-2">
                  Create a new task, broaden search parameters, or adjust dashboard filters to display workloads.
                </p>
                <button
                  id="empty-state-add-btn"
                  onClick={onAddTask}
                  className="mt-5 inline-flex items-center justify-center gap-1.5 bg-indigo-55/15 border border-indigo-200 text-indigo-700 font-bold text-xs py-2 px-4 rounded-xl hover:bg-indigo-50/50 transition-all shadow-3xs"
                >
                  <Plus className="w-4 h-4" />
                  Add First Task Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task) => {
                  const itemsChecked = task.subtasks.filter(sub => sub.done).length;
                  const totalSubtaskCount = task.subtasks.length;
                  const percentComplete = totalSubtaskCount > 0 ? Math.round((itemsChecked / totalSubtaskCount) * 100) : 0;

                  return (
                    <div 
                      key={task.id}
                      className="bg-white rounded-2xl border border-slate-105 shadow-sm hover:shadow-lg hover:shadow-indigo-50/40 transition-all duration-200 flex flex-col justify-between overflow-hidden relative group"
                    >
                      {/* Priority Ribbon bar on card top from Sleek design specifications */}
                      <div className={`h-1.5 w-full ${
                        task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-indigo-400'
                      }`} />

                      <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                        {/* Title & Actions Row */}
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              task.status === 'Completed' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                : task.status === 'In Progress' 
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {task.status}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                id={`edit-task-btn-${task.id}`}
                                onClick={() => onEditTask(task)}
                                title="Edit Task Attributes"
                                className="text-slate-400 hover:text-indigo-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                id={`delete-task-btn-${task.id}`}
                                onClick={() => onDeleteTask(task.id)}
                                title="Delete Task"
                                className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <h3 className="font-display font-medium text-slate-900 tracking-tight text-base mt-3 leading-snug group-hover:text-indigo-600 transition-colors">
                            {task.title}
                          </h3>
                          <p className="text-slate-600 text-xs leading-relaxed mt-1.5 line-clamp-2">
                            {task.description || 'No detailed instructions configured.'}
                          </p>
                        </div>

                        {/* Middle status section: checklist subtasks or AI insights */}
                        <div className="space-y-4">
                          {/* Checklist item tracker bar */}
                          {totalSubtaskCount > 0 && (
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                                <span>Checklist progress</span>
                                <span>{itemsChecked}/{totalSubtaskCount} ({percentComplete}%)</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-505 bg-indigo-600 rounded-full transition-all duration-300" 
                                  style={{ width: `${percentComplete}%` }}
                                />
                              </div>

                              {/* Tiny checkboxes box preview */}
                              <div className="pt-2 space-y-1.5 max-h-24 overflow-y-auto">
                                {task.subtasks.map((sub) => (
                                  <label key={sub.id} className="flex items-center gap-2 text-[10px] text-slate-600 cursor-pointer hover:text-slate-800">
                                    <input
                                      type="checkbox"
                                      checked={sub.done}
                                      onChange={() => onToggleSubtask(task, sub.id)}
                                      className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 accent-indigo-600"
                                    />
                                    <span className={sub.done ? 'line-through text-slate-400' : ''}>
                                      {sub.title}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* AI scheduler insights indicator */}
                          {task.aiInsights ? (
                            <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2 mt-2">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600">
                                <Bot className="w-3.5 h-3.5" />
                                <span>Gemini AI Scheduler Insights</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-[9px] font-semibold text-slate-600">
                                <div className="bg-white p-1.5 rounded-lg border border-indigo-100/30">
                                  Complexity: <span className="text-indigo-600">{task.aiInsights.complexity}</span>
                                </div>
                                <div className="bg-white p-1.5 rounded-lg border border-indigo-100/30">
                                  Estimate: <span className="text-indigo-600">{task.aiInsights.predictedHours} Hrs</span>
                                </div>
                              </div>
                              {task.aiInsights.suggestions && task.aiInsights.suggestions.length > 0 && (
                                <ul className="text-[10px] text-slate-600 leading-relaxed list-disc list-inside space-y-0.5">
                                  {task.aiInsights.suggestions.slice(0, 2).map((sug, i) => (
                                    <li key={i} className="truncate">💡 {sug}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ) : (
                            <button
                              id={`ai-analyze-btn-${task.id}`}
                              onClick={(e) => handleRunAI(task.id, e)}
                              disabled={analyzingId === task.id}
                              className="w-full flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-indigo-50/20 border border-slate-205 border-indigo-200 text-indigo-600 hover:text-indigo-700 font-semibold text-[10px] py-2 px-3 rounded-xl transition-all shadow-3xs"
                            >
                              {analyzingId === task.id ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  Analyzing Task...
                                </>
                              ) : (
                                <>
                                  <BrainCircuit className="w-3.5 h-3.5 animate-pulse" />
                                  Scan with Gemini AI
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Card Footer: Due date indicator and change level status */}
                      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Due: {task.dueDate}</span>
                        </div>
                        <select
                          id={`card-status-[${task.id}]`}
                          value={task.status}
                          onChange={(e) => onUpdateStatus(task.id, e.target.value as any)}
                          className="bg-transparent hover:text-slate-800 font-semibold focus:outline-none cursor-pointer text-slate-600"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
