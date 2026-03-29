# 🎓 AI Pathshala 

AI Pathshala is a full-stack educational platform designed to augment student revision by dynamically extracting knowledge from textbook PDFs, modeling it into a Graph Neural structure, and retrieving it iteratively via RAG (Retrieval-Augmented Generation). 

This repository contains two main modules:
1. **Frontend**: React Native / Expo app.
2. **Backend**: Node.js / Express server bridging Gemini, Neo4j, and Pinecone.

---

## 🛠 Prerequisites

Before starting, ensure you have the following installed on your local machine:
- **Node.js** (v18.x or newer) and `npm`.
- **Neo4j Local Environment**: Either [Neo4j Desktop](https://neo4j.com/download/) or Docker.
- **Expo CLI**: Installed globally (`npm install -g expo-cli`).
- **External Accounts**:
  - **Google MakerSuite / Gemini**: Free API key for `gemini-2.5-flash` inference.
  - **Pinecone**: Free tier vector database.

---

## ☁️ 1. Infrastructure Setup

### Neo4j Graph Database 🕸️
AI Pathshala uses Neo4j to map learning Mastery Nodes (e.g., *Topics* & *Prerequisites*).
**Note for new developers:** There is no shared cloud Neo4j instance. Every developer must spin up their own local, isolated Neo4j database to build and test their own syllabus graphs!
1. Spin up a local Neo4j instance using Docker:
   ```bash
   docker run -d --name neo4j -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/demo1234 neo4j:latest
   ```
2. Or use Neo4j Desktop. Ensure the database is accessible at `bolt://127.0.0.1:7687` (or `neo4j://127.0.0.1:7687`) with credentials `neo4j` / `demo1234`.

### Pinecone Vector Database 🌲
Pinecone is used to store high-dimensional embeddings of the NCERT textbooks and their board marking schemes.
**Note for new developers:** We are using a shared Pinecone index for this project. You do not need to create your own index. Use the provided API key in the `.env` section below. 

If you *do* decide to setup your own isolated Pinecone index for testing:
1. **Dimensions:** `1024` *(CRITICAL: The backend mathematically aligns Gemini's native 768d vectors to a strict 1024d Pinecone index using zero-padding. This dimension must be exactly 1024)*.
2. **Metric:** `cosine`
3. If your host URL changes, update the configuration across the `metadata-engine.ts` files globally.

---

## ⚙️ 2. Backend Setup (`/backend`)

The Express backend orchestrates the Gemini RAG ETL pipeline.

1. Open a terminal and navigate to the backend:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file inside the `backend/` directory:
   ```env
   # API Keys
   GEMINI_API_KEY=your_google_gemini_key
   PINECONE_API_KEY=shared over dm

   # Neo4j Local Config
   NEO4J_URI=neo4j://127.0.0.1:7687
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=demo1234
   
   # Optional: Local Server Port
   PORT=3000
   ```

3. Start the developmental API server:
   ```bash
   npx ts-node src/index.ts
   ```
   *The server should now be listening on `http://localhost:3000`.*

---

## 📱 3. Frontend Setup (`/frontend`)

The mobile UI allows students to ingest new material and interact with the AI Kunji models.

1. Open a new terminal tab and navigate to the frontend:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Expo bundler:
   ```bash
   npx expo start
   ```
3. Press `w` to open the app in a web browser, or `i` to launch the iOS Simulator. 
*(If running on a physical Android/iOS phone via Expo Go, you MUST update `API_BASE_URL` inside `frontend/src/services/api.ts` from `localhost:3000` to your computer's local Wi-Fi IP address, e.g., `192.168.1.5:3000`).*

---

## 🚀 4. How to Run & Verify the Project

Once both the frontend and backend are running, follow these steps to verify full functionality:

### Option A: The Automated Text Ingestion (Recommended)
1. Open the App and click **"Upload NCERT PDF for RAG Ingestion"** on the Dashboard.
2. Select any local PDF.
3. The file will upload to the Express server natively. Watch the backend terminal log! It will natively parse chunks using `pdf-parse` and stream them to Gemini 2.5 Flash.
4. Gemini will dissect the syllabus, author mastery prerequisites, formulate 3-Marker solutions, and upload them natively to your Pinecone and Neo4j stacks.

### Option B: The Manual Database Seeder
If you don't have a PDF lying around, you can force the mock data pipeline to instantiate valid graphs:
1. In your backend terminal, run: `npx ts-node src/scripts/seed.ts`
2. It will inject the `Spherical Mirrors` concept loop directly into Neo4j and Pinecone.

### Testing the Interface
1. Once data is seeded (via PDF or Script), tap **Smart Kunji** in the app.
2. It will dynamically query the Graph and retrieve the actual marking schemes securely from Pinecone!
