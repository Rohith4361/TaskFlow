/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { Task, ChatMessage } from '../src/types';

// Lazy loader for GoogleGenAI to prevent startup crashes if GEMINI_API_KEY is missing
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

export const aiService = {
  // 1. Analyze Task and generate intelligent subtasks & insights
  async analyzeTask(title: string, description: string): Promise<{
    complexity: 'Low' | 'Medium' | 'High';
    predictedHours: number;
    suggestions: string[];
    subtasks: string[];
  }> {
    const client = getAIClient();
    
    if (!client) {
      console.warn('GEMINI_API_KEY is missing/placeholder. Falling back to dynamic rule-based insights.');
      return this.generateMockupInsights(title, description);
    }

    try {
      const prompt = `You are an expert project manager and task assistant. Analyze this task:
Title: "${title}"
Description: "${description}"

Generate structural task breakdown, difficulty prediction and productivity suggestions in JSON format.
The response must be valid JSON matching this schema:
{
  "complexity": "Low" | "Medium" | "High",
  "predictedHours": number (estimate real-world hours needed),
  "suggestions": string[] (3 brief actionable speed-up tips),
  "subtasks": string[] (3 to 6 logical checklist subtask titles to get this task done)
}
Return only the raw JSON. No markdown enclosures, no comments.`;

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText.trim());
      
      return {
        complexity: parsed.complexity || 'Medium',
        predictedHours: Math.max(1, Number(parsed.predictedHours) || 4),
        suggestions: parsed.suggestions || [],
        subtasks: parsed.subtasks || []
      };
    } catch (error) {
      console.error('Gemini API analysis failed. Falling back to mockup:', error);
      return this.generateMockupInsights(title, description);
    }
  },

  // 2. Chat with AI Project Assistant with task list awareness
  async assistantChat(history: ChatMessage[], currentTasks: Task[], userMessage: string): Promise<string> {
    const client = getAIClient();

    if (!client) {
      return `Hello! I am your AI Project Assistant. I would love to help you manage your tasks, suggest progress tracks, or reorganize your schedule!

To unlock the full power of Gemini AI for real-time task reasoning, please add your **GEMINI_API_KEY** in the AI Studio UI Secrets menu.

Based on your current workspace, here is a breakdown of your files:
- You currently have **${currentTasks.length}** task(s) active on your board.
- Pending tasks: *${currentTasks.filter(t => t.status === 'Pending').map(t => t.title).join(', ') || 'None'}*
- In Progress tasks: *${currentTasks.filter(t => t.status === 'In Progress').map(t => t.title).join(', ') || 'None'}*

How else can I help you today?`;
    }

    try {
      const tasksSummary = currentTasks.map(t => (
        `- [${t.status}] ${t.title} (${t.priority} priority, Due: ${t.dueDate}). Description: ${t.description || 'No description'}`
      )).join('\n');

      const chatMessages = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // Add the final user message with prompt context
      const systemContext = `You are TaskNexus AI, a premium, intelligent project management assistant. 
You write with professional composure, clear bullet points, and actionable steps.
The user's current task board state is below:
${tasksSummary || 'No tasks created yet.'}

Respond to the user's question. If they ask you to write, outline, schedule, or suggest ways to organize, give precise and practical recommendations. Refer explicitly to their real tasks by title. Keep formatting clean with beautiful headings and clear item lists.`;

      const chat = client.chats.create({
        model: 'gemini-2.5-flash',
        history: chatMessages
      });

      const response = await chat.sendMessage({
        message: `${systemContext}\n\nUser Question: ${userMessage}`
      });

      return response.text || "I'm sorry, I encountered a brief issue processing your request.";
    } catch (error) {
      console.error('Gemini chat failed. Generating fallback message:', error);
      return `Hello! I'm having a brief issue connecting with my cognitive core. 

However, looking at your current task list of **${currentTasks.length}** tasks, my recommendation is to focus first on resolving high-priority deadlined items. Please retry in a second or check your network!`;
    }
  },

  // Elegant rule-based backup analyzer if API key is not ready
  generateMockupInsights(title: string, description: string) {
    const text = (title + ' ' + description).toLowerCase();
    
    let complexity: 'Low' | 'Medium' | 'High' = 'Medium';
    let predictedHours = 4;
    let suggestions: string[] = [];
    let subtasks: string[] = [];

    if (text.includes('build') || text.includes('setup') || text.includes('architecture') || text.includes('develop')) {
      complexity = 'High';
      predictedHours = 12;
      suggestions = [
        'Enforce strict modular coding structures.',
        'Write test cases prior to finalizing key routes.',
        'Run iterative builds using typescript validation rules.'
      ];
      subtasks = [
        'Design database schema and state endpoints',
        'Implement validation controller middleware',
        'Create test suite cases',
        'Iterate on visual styling controls'
      ];
    } else if (text.includes('design') || text.includes('css') || text.includes('ui') || text.includes('animate')) {
      complexity = 'Medium';
      predictedHours = 6;
      suggestions = [
        'Choose a cohesive color harmony line directly.',
        'Apply responsive prefixes (sm:, md:) strictly.',
        'Refine typography hierarchy to improve visual pacing.'
      ];
      subtasks = [
        'Sketch style layouts & pick brand tones',
        'Implement adaptive grids and margins',
        'Refine shadow variations and motion speed'
      ];
    } else if (text.includes('test') || text.includes('debug') || text.includes('fix')) {
      complexity = 'Medium';
      predictedHours = 3;
      suggestions = [
        'Locate console tracebacks using network panels.',
        'Draft isolated regression suites to lock features.',
        'Verify database records manually to spot null keys.'
      ];
      subtasks = [
        'Isolate anomalous code lines',
        'Review current state mutations',
        'Deploy fix patches'
      ];
    } else {
      complexity = 'Low';
      predictedHours = 2;
      suggestions = [
        'Define a single clear path of action.',
        'Establish direct milestones without distraction.',
        'Keep communications simple and clean.'
      ];
      subtasks = [
        'Perform preliminary scoping',
        'Complete central task action',
        'Verify outcomes and mark done'
      ];
    }

    return { complexity, predictedHours, suggestions, subtasks };
  }
};
