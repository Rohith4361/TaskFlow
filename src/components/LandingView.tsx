/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sparkles, ArrowRight, CheckCircle2, Clock, Shield, BrainCircuit, BarChart3, Users } from 'lucide-react';

interface LandingViewProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingView({ onGetStarted, onLogin }: LandingViewProps) {
  const features = [
    {
      icon: <BrainCircuit className="w-6 h-6 text-indigo-600" />,
      title: "Predictive AI Scheduling",
      description: "Gemini AI analyzes task descriptions to estimate completion hours, assign complexity levels, and suggest actionable checklists dynamically."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
      title: "Intuitive Analytics",
      description: "Track completion velocities, pending bottle-necks, and active schedules with beautiful, responsive dashboard visualizations."
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-indigo-600" />,
      title: "Granular Subtasks",
      description: "Break complex multi-stage projects into discrete checklists to track exact progress percentages across user cycles."
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      title: "AI Project Assistant",
      description: "Chat with an assistant that knows your active board. Query priority bottlenecks, summarize tasks, or orchestrate schedules instantly."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">TaskNexus</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#analytics" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Insights</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              id="nav-login-btn"
              onClick={onLogin}
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg transition-colors"
            >
              Log In
            </button>
            <button 
              id="nav-get-started-btn"
              onClick={onGetStarted}
              className="text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-md hover:shadow-lg hover:shadow-indigo-100 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 sm:py-32 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium text-xs px-3.5 py-1.5 rounded-full mb-8">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>v2.0 release loaded with Gemini Flash intelligence</span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
          Manage Tasks with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">Intelligence</span>
        </h1>

        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed mb-10">
          The enterprise-grade task architect powered by AI. Organize your workflow, predict deadlines, and synchronize your team in real-time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            id="hero-get-started-btn"
            onClick={onGetStarted}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-indigo-200 transition-all group"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#features"
            className="w-full sm:w-auto flex items-center justify-center bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-8 py-4 rounded-xl shadow-sm transition-all"
          >
            Live Demo
          </a>
        </div>

        {/* Dashboard Mockup Panel */}
        <div className="w-full max-w-4xl mt-16 sm:mt-24 p-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-50/20 to-transparent pointer-events-none" />
          <div className="bg-slate-900 rounded-xl overflow-hidden aspect-[16/10] border border-slate-850 flex flex-col text-left">
            {/* Mock Header */}
            <div className="h-12 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="text-[11px] font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
                app.tasknexus.com/dashboard
              </div>
              <div className="w-3 h-3" />
            </div>
            
            {/* Mock Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar */}
              <div className="w-44 border-r border-slate-800 bg-slate-950 p-3 flex flex-col gap-2">
                <div className="h-8 bg-indigo-500/10 border border-indigo-500/20 rounded-md flex items-center px-2.5 gap-2 text-xs text-indigo-400 font-medium">
                  <BarChart3 className="w-3.5 h-3.5" /> Dashboard
                </div>
                <div className="h-8 rounded-md flex items-center px-2.5 gap-2 text-xs text-slate-400 font-medium hover:bg-slate-900 transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5" /> My Tasks
                </div>
                <div className="h-8 rounded-md flex items-center px-2.5 gap-2 text-xs text-slate-400 font-medium hover:bg-slate-900 transition-colors">
                  <BrainCircuit className="w-3.5 h-3.5" /> AI Assistant
                </div>
              </div>
              
              {/* Content Panel */}
              <div className="flex-1 p-6 flex flex-col gap-6 bg-slate-900 overflow-y-auto">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="h-5 w-32 bg-slate-800 rounded animate-pulse" />
                    <div className="h-3.5 w-48 bg-slate-800/60 rounded animate-pulse" />
                  </div>
                  <div className="h-9 w-24 bg-indigo-600/30 border border-indigo-500/20 rounded-lg animate-pulse" />
                </div>
                
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-1.5 shadow-sm">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Total Tasks</span>
                    <span className="text-xl font-bold text-slate-200">12</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-1.5 shadow-sm">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">In Progress</span>
                    <span className="text-xl font-bold text-indigo-400">4</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-1.5 shadow-sm">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Completed</span>
                    <span className="text-xl font-bold text-emerald-400">8</span>
                  </div>
                </div>

                {/* Task Item */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border border-indigo-500/40 flex items-center justify-center bg-indigo-500/5">
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-sm" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">Refactor database query interfaces</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Optimize relational latency via cache stores.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-medium">Medium</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-850 text-slate-400 font-mono">3h est</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Matrix List */}
      <section id="features" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Designed for Teams & Peak Performers
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Streamline productivity workflows with a cohesive pipeline of metrics, scheduling guides, and generative assist agents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item, index) => (
              <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/60 hover:bg-slate-50/50 hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col gap-4">
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shadow-sm">
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-slate-950 tracking-tight">{item.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section (Requested visually) */}
      <section id="pricing" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Simple, Dynamic Scaling Tiers
            </h2>
            <p className="text-slate-600 text-sm">
              Start scoping tasks with our complete visual platform. Upgrade anytime as workload bounds expand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
            {/* Free Tier */}
            <div className="p-8 sm:p-10 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Starter</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-display font-extrabold text-slate-900">$0</span>
                  <span className="text-slate-500 text-xs font-medium">/ forever</span>
                </div>
                <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                  Perfect for individual project tracking and day-to-day agenda organization.
                </p>
                <ul className="space-y-3 mt-8">
                  {["Unlimited tasks", "Category tracking", "Priority tags", "Local backups"].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={onGetStarted}
                className="w-full mt-8 bg-slate-100 hover:bg-slate-250 text-slate-800 font-semibold text-xs py-3 rounded-xl transition-all"
              >
                Launch Tracker
              </button>
            </div>

            {/* Pro Tier */}
            <div className="p-8 sm:p-10 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex flex-col justify-between relative">
              <div className="absolute top-6 right-6 bg-indigo-500/30 border border-indigo-400/20 text-[10px] font-bold px-2.5 py-1 rounded-full text-indigo-100">
                POPULAR
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-200">Intelligence Pro</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-display font-extrabold text-white">$12</span>
                  <span className="text-indigo-200 text-xs font-medium">/ month</span>
                </div>
                <p className="text-xs text-indigo-100 mt-4 leading-relaxed">
                  Supercharge projects with robust predictive analysis and full AI assistant capabilities.
                </p>
                <ul className="space-y-3 mt-8">
                  {["Everything in Starter", "Gemini AI Task Breakdown", "Live AI Chat Companion", "Predictive hours estimates"].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-indigo-50">
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={onGetStarted}
                className="w-full mt-8 bg-white hover:bg-slate-100 text-indigo-600 font-bold text-xs py-3 rounded-xl shadow-lg transition-all"
              >
                Claim Pro Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="font-display font-bold text-slate-950">TaskNexus</span>
          </div>
          <p>© 2026 TaskNexus Technologies Inc. All privileges reserved.</p>
          <div className="flex gap-6">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Integrity Terms</a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">Privacy Charter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
