# Clarion OmniAI — Frontend Web Application

> Explainable Intelligent Document Processing (IDP) & Business Intelligence (BI) Platform

---

## 🌟 Overview
Clarion OmniAI transforms unstructured business documents (tax invoices, purchase orders, delivery notes, receipts) into trusted, explainable, connected, and actionable intelligence.

### Key Frontend Features
* **Three-Layer Trust Architecture**: Visible separation of Layer 1 (AI extraction & spatial bounding box evidence), Layer 2 (deterministic validation & PO matching), and Layer 3 (human-in-the-loop review).
* **Interactive Document Preview**: Live bounding box overlays for every extracted field with zoom and pan controls.
* **Review Workspace**: Field-level confidence badges, provenance inspector, inline corrections, and non-destructive versioning (V1 AI $\rightarrow$ V2 Human).
* **Source-Grounded AI Assistant**: Zero-hallucination interactive chat with clickable citation links to source documents.
* **Trust & Health Engine**: Empirical analytics comparing model confidence against measured human correction rates and auto-approval pass rates.
* **Supabase Auth & Storage**: Direct integration with Supabase authentication and private document storage.

---

## 🛠️ Tech Stack
* **Framework**: React 19 + TypeScript + Vite
* **Styling**: Tailwind CSS
* **Data Fetching & State**: TanStack Query (React Query)
* **Icons & UI**: Lucide React
* **Charts & Analytics**: Recharts
* **Authentication**: Supabase Auth

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `VITE_API_URL`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY` are configured.

### 3. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
