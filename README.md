# 🧑‍🍳 FridgeWhisperer: AI-Driven Multimodal Recipe Architect

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://storied-bonbon-01342d.netlify.app/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-id/deploy-status)](https://app.netlify.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**FridgeWhisperer** is a sophisticated full-stack web application designed to combat global food waste through advanced Artificial Intelligence. By leveraging multimodal Large Language Models (LLMs), the platform identifies ingredients via text or image analysis and generates professional culinary recipes in real-time.

---

## 📖 Comprehensive Project Report

### 1. Executive Summary
Food waste is a critical environmental and economic issue. FridgeWhisperer addresses this by providing users with a "Zero-Waste" tool that suggests creative uses for leftovers. The system integrates secure authentication, real-time AI generation, and cloud persistence.

### 2. Technical Problem Statement
Users often possess miscellaneous ingredients but lack the culinary knowledge to combine them efficiently. Traditional recipe sites require specific searches; this project reverses that flow by starting with available resources (inputs) to provide dynamic solutions (outputs).

### 3. System Architecture & Tech Stack
The project follows a **Serverless Decoupled Architecture**:

* **Frontend Layer:** * **Vanilla JS (ES6+):** Core logic and DOM manipulation.
    * **CSS3:** Custom responsive design with a mobile-first approach.
    * **Marked.js:** High-performance Markdown-to-HTML rendering for AI responses.
* **Serverless Logic (Backend):**
    * **Netlify Functions (Node.js):** Acts as a secure middleware/proxy to hide API keys and handle logic.
* **Artificial Intelligence Engine:**
    * **Google Gemini 2.5 Flash:** Multimodal LLM capable of processing `image/base64` data and text prompts simultaneously.
* **Database & Security Layer:**
    * **Supabase (PostgreSQL):** Cloud database for persistent recipe storage.
    * **Supabase Auth:** Secure JWT-based authentication system.
    * **Row Level Security (RLS):** Policies to ensure data isolation between users.

### 4. System Design Features
* **Multimodal Input:** Users can either type their ingredients or upload a real-time photo. The AI identifies ingredients from images using computer vision principles.
* **Personalized Profile:** Users can create accounts to build a personal library of "Saved Recipes".
* **Secure API Proxying:** Frontend never communicates directly with Google Gemini, preventing API key leakage.
* **Data Integrity:** RLS policies ensure that `user_id` validation is performed at the database level for every transaction.

---

## 🚀 Deployment Tutorial

This guide will walk you through deploying your own instance of **FridgeWhisperer**.

### I. Backend Setup (Supabase)
1.  **Project Initialization:** Create a new project at [Supabase](https://supabase.com/).
2.  **Database Schema:** Run the following script in the SQL Editor:
    ```sql
    CREATE TABLE recetas_guardadas (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users NOT NULL,
      titulo TEXT NOT NULL,
      contenido TEXT NOT NULL,
      fecha_creacion TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE recetas_guardadas ENABLE ROW LEVEL SECURITY;
    -- RLS Policies
    CREATE POLICY "Users view own" ON recetas_guardadas FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users insert own" ON recetas_guardadas FOR INSERT WITH CHECK (auth.uid() = user_id);
    ```
3.  **Authentication Settings:** Go to `Authentication > Sign In / Providers > Email`. 
    * Disable "Confirm email" for faster development testing.
    * Enable "Allow new users to sign up".

### II. AI Configuration (Google Gemini)
1.  Access [Google AI Studio](https://aistudio.google.com/).
2.  Generate an **API Key** for the Gemini 2.5 Flash model.
3.  Copy the key for the Netlify environment configuration.

### III. Deployment on Netlify
1.  **Connect GitHub:** Link your repository to a new site on Netlify.
2.  **Environment Variables:** Add the following variables in `Site Settings > Environment Variables`:
    * `GEMINI_API_KEY`: Your secret Google key.
3.  **Build Settings:** * **Build command:** `npm install`
    * **Publish directory:** `/` (Root)
4.  **Supabase Connection:** Update the `supabaseUrl` and `supabaseKey` constants in `js/script.js` with your project’s public credentials.

---

## 🛠️ Installation & Local Development
1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/Ang3lhack/Proyect1.git](https://github.com/Ang3lhack/Proyect1.git)
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run with Netlify CLI:**
    ```bash
    netlify dev
    ```

---
<p aling= "center">

<img width="1358" height="682" alt="refri1" src="https://github.com/user-attachments/assets/8dd6285f-48e1-414f-81a7-6fd91491fea8" />

</p> 

<p aling= "center">

<img width="1361" height="671" alt="refri2" src="https://github.com/user-attachments/assets/93c55d6a-8952-47ad-8c9e-db98304d8a76" />

</p>

---
## 👤 Author
**Angel Gael Garcia Ramos** *Computer Engineering Studen*
---
## 🔗 Project Link
[https://storied-bonbon-01342d.netlify.app/](https://storied-bonbon-01342d.netlify.app/)
