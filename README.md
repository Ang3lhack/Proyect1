# 🧑‍🍳 FridgeWhisperer - Your AI Leftover Rescuer

FridgeWhisperer is an AI-powered web application that helps you reduce food waste by turning your random leftover ingredients into delicious recipes. Just tell the chatbot what you have in your fridge or pantry (e.g., "half an onion, two eggs, a tomato, and some stale bread"), and it will generate a step-by-step recipe to use them up.

## 🚀 The Problem it Solves
Every year, tons of food are wasted simply because people don't know how to combine the random ingredients left at the end of the week. FridgeWhisperer acts as your personal sous-chef, eliminating the "what's for dinner?" fatigue, saving you money on groceries, and helping the environment by reducing household food waste.

## 🛠️ Architecture & Technologies
This project is built to be 100% free to host and easy to deploy using a Serverless architecture.

* **Front-end:** HTML5, CSS3, and Vanilla JavaScript. A clean, responsive chat interface.
* **Back-end:** [Netlify Functions](https://docs.netlify.com/functions/overview/) (Node.js). Acts as a secure proxy to communicate with the AI.
* **Artificial Intelligence:** [Google Gemini API](https://aistudio.google.com/) (Free Tier). Powers the recipe generation and conversational logic.

> **Security Note:** The AI logic and the API Key live securely inside the Back-end (Netlify Functions). This ensures your credentials are never exposed to the client's browser.

## 📋 Prerequisites
* Node.js installed on your local machine.
* A free [GitHub](https://github.com/) account.
* A free [Netlify](https://www.netlify.com/) account.
* A free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## 💻 Local Setup & Development

1. **Clone this repository:**
   ```bash
   git clone [https://github.com/YOUR-USERNAME/fridgewhisperer.git](https://github.com/YOUR-USERNAME/fridgewhisperer.git)
   cd fridgewhisperer
