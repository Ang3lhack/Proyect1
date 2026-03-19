# 🧑‍🍳 FridgeWhisperer - AI Leftover Savior

FridgeWhisperer is an AI-powered, serverless web application designed to help you reduce food waste by transforming your leftover ingredients into delicious, easy-to-follow recipes. Just tell the AI what you have in your fridge, and it will handle the rest!

---

## 📊 Project Report

### The Problem
Every year, millions of tons of food are wasted in households simply because people don't know how to combine the random ingredients left in their fridges at the end of the week. This not only harms the environment but also represents a significant financial loss for families. Deciding "what's for dinner?" becomes a stressful daily chore.

### The Solution
FridgeWhisperer acts as your personal AI sous-chef. By inputting a simple list of available ingredients (e.g., "half an onion, two eggs, a tomato, and stale bread"), the application generates a complete, step-by-step recipe. This eliminates mealtime stress, saves money on groceries, and actively contributes to reducing household food waste.

### Architecture & Technologies
This project is built using a modern, 100% free serverless architecture to ensure security and scalability without hosting costs:

* **Frontend:** Vanilla HTML5, CSS3, and JavaScript. It features a clean, responsive, and user-friendly interface.
* **Backend / Proxy:** **Netlify Functions** (Node.js). It acts as a secure middleware layer. 
* **Artificial Intelligence:** **Google Gemini API** (specifically the `gemini-2.5-flash` model via the `@google/generative-ai` SDK).
* **Security Architecture:** The Gemini API key is *never* exposed to the client-side browser. The frontend sends the ingredients to the Netlify Function, which securely communicates with Google's servers using hidden environment variables, returning only the final Markdown text to the user.

---

## 🚀 Deployment Guide & Tutorial

Follow these steps to deploy your own instance of FridgeWhisperer for free.

### Prerequisites
* [Node.js](https://nodejs.org/) installed on your local machine.
* A free [GitHub](https://github.com/) account.
* A free [Netlify](https://netlify.com/) account.
* A Google account to access the [Google Cloud Console](https://console.cloud.google.com/).

### Step 1: Obtain a Google Gemini API Key
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a **New Project**.
3. In the top search bar, look for **Generative Language API** and click **Enable**.
4. Go to **APIs & Services > Credentials**.
5. Click **+ CREATE CREDENTIALS** and select **API key**.
6. Copy your new API key and keep it safe.

### Step 2: Local Setup
1. Clone this repository to your local machine:
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   cd YOUR_REPOSITORY_NAME
   \`\`\`
2. Install the required backend dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a `.env` file in the root directory and add your Google API key:
   \`\`\`env
   GEMINI_API_KEY=your_actual_api_key_here
   \`\`\`
   *(Note: Ensure `.env` is listed in your `.gitignore` file so it is not uploaded to GitHub).*
4. Install the Netlify CLI globally (if you haven't already):
   \`\`\`bash
   npm install -g netlify-cli
   \`\`\`
5. Run the local development server:
   \`\`\`bash
   netlify dev
   \`\`\`
   The application will open in your browser (usually at `http://localhost:8888`).

### Step 3: Production Deployment to Netlify
1. Push your local code to your GitHub repository.
2. Log in to your [Netlify](https://app.netlify.com/) dashboard.
3. Click on **Add new site** > **Import an existing project**.
4. Connect to your GitHub account and select this repository.
5. Leave the basic build settings as they are, but **do not click deploy yet**.
6. Click on **Add environment variables**.
   * **Key:** `GEMINI_API_KEY`
   * **Value:** Paste your Google API Key here.
7. Click **Deploy site**.
8. Wait a few seconds, and Netlify will provide you with a live, public URL where your app is hosted!

---

## 📝 Usage
1. Open the application in your browser.
2. In the text area, type the ingredients you currently have (e.g., "chicken breast, rice, broccoli, soy sauce").
3. Click the **Generate Recipe** button.
4. Wait a few seconds while the AI works its magic.
5. Enjoy your custom, zero-waste meal!

---
*Created with ❤️ to reduce food waste.
Link to the published page and screenshot of it in operation*
(https://storied-bonbon-01342d.netlify.app/)
<p aling= "center">
<img width="1203" height="684" alt="comida1" src="https://github.com/user-attachments/assets/2472368a-75ad-4280-9238-537f2dfb5a81" />
</p>
