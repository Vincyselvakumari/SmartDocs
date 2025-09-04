# SmartDocs

# 📘 Team Knowledge Base

A full-stack web app to manage team documents with *AI-powered summarization, tagging, and semantic search* using Google Gemini.

---

## 🚀 Features
- Add, edit, and delete documents  
- Auto-generated *summaries* & *tags*  
- AI-based *semantic search*  
- User authentication  

---

##📂 Project Structure
- client/ → React frontend  
- server/ → Node.js + Express backend  

---

#⚙ Setup

### 1. Clone the repo
```bash
git clone https://github.com/your-username/team-knowledge-base.git
cd team-knowledge-base

2. Backend (Server)

cd server
npm install

Create a .env file inside server/:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key

Run backend:

npm run dev

3. Frontend (Client)

cd client
npm install
npm start


---

🛠 Tech Stack

Frontend: React, CSS

Backend: Node.js, Express

Database: MongoDB

AI: Google Gemini API
