# TaskNexus — Intelligent Task Architect 🚀

TaskNexus is an enterprise-grade full-stack task management system designed with peak performance, adaptive layout configurations, and instant server-side AI-powered scheduling models.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Modern Motion animations.
- **Backend Core**: Node.js, Express.js server running in dynamic middleware configurations.
- **Database Engine**: Self-healing local JSON persistence storage wrapper (`/server/db-storage.json`) by default. Provides zero-config, persistent preview capabilities instantly out of the box in the sandbox, with options for secure MongoDB/Firestore mappings.
- **Intelligence Core**: Gemini AI (`@google/genai` on `gemini-2.5-flash`) for predictive hours estimation, complexity indicators, and interactive task board chat counseling.
- **Security & Authorization**: Custom cryptographically secure HMAC SHA256 signature hashes for lightweight token verification.

---

## 🔥 Highlighted Features

1. **Intelligent Predictive Slicing**: Press **Scan with Gemini AI** on any task to instantly estimate required execution hours, label complexity levels, and generate customized checkbox checklists.
2. **AI Project Counsel Pane**: Click the **AI Project Assistant** panel to converse directly with Gemini. It has comprehensive, live workspace memory of your pending, completed, or active task boards.
3. **Satisfying Workspace Board**: Filter workloads dynamically by search queries, priority values, and status categories. Review completions with our gradient progress velocity counters.

---

## 📖 API Endpoints Definition

### Authentication
- `POST /api/auth/register` — Capture `name`, `email`, and `password`. Returns JWT-like bearer authorization token and user info.
- `POST /api/auth/login` — Sign in with secure email & password combinations. Returning Bearer token credentials.

### Task Management (CRUD)
- `GET /api/tasks` — Fetch full listing of task entries registered for the authorized ID.
- `POST /api/tasks` — Create a new task with given parameters (`title`, `description`, `dueDate`, `priority`, `status`, `subtasks`).
- `PUT /api/tasks/:id` — Perform atomic property updates.
- `DELETE /api/tasks/:id` — Delete task from persistence.
- `POST /api/tasks/:id/analyze` — Trigger server-side Gemini AI models to analyze detailed task description. Adds hours estimates and appends checklists.

### AI Collaborations
- `POST /api/ai/chat` — Contextual helper chat with AI Project Assistant.

---

## 🚀 Local Installation & Running Guide

Ensure Node.js v18+ is installed on your local operating machine:

```bash
# 1. Clone or unpack repository contents
cd tasknexus-app

# 2. Install required full-stack dependencies
npm install

# 3. Provision environment variables setup
cp .env.example .env
# Open and edit .env to insert your GEMINI_API_KEY for dynamic intelligence

# 4. Spin up the Node Express development server
npm run dev
# The instance is now listening at http://localhost:3000
```

---

## ☁️ Production Deployment Blueprints

### Backend Server on Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your repository branch.
3. Specify Build Command: `npm install && npm run build`
4. Specify Start Command: `npm start`
5. Map **Environment Variables** under your Render variables console:
   - `NODE_ENV` = `production`
   - `GEMINI_API_KEY` = `your-live-gemini-secret-api-key`

### Frontend SPA on Netlify
*Because TaskNexus uses a merged Express + Vite full-stack framework proxying API requests, you are recommended to deploy the merged service directly to Render/Cloud Run to avoid CORS or proxy issues. However, if deploying independently:*
1. Build client-only assets locally via `npm run build` (outputs to `/dist`).
2. Deploy the `/dist` directory directly to [Netlify](https://netlify.com).
3. Set up a `_redirects` file mapping backend API calls directly:
   `/*  https://your-render-backend-url.onrender.com/:splat  200`

### Databases (MongoDB Atlas Upgrade)
To bind a traditional MongoDB cluster securely:
1. Provision a free M0 cluster on [MongoDB Atlas](https://mongodb.com/atlas).
2. Install mongoose locally: `npm install mongoose`
3. Swap `/server/db.ts` file operations to call Mongoose schemas:
```ts
import mongoose from 'mongoose';
const taskSchema = new mongoose.Schema({
  userId: String,
  title: String,
  dueDate: String,
  priority: String,
  status: String,
  subtasks: Array,
  aiInsights: Object
});
```
