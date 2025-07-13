# Post Analysis App

A full-stack web application that fetches, displays, analyzes, and creates blog posts using **Next.js**, **WebAssembly (C++)**, **MySQL**, and **ML (FastAPI)** integration. This project demonstrates deep integration between frontend, C++, SQL backend, and optional ML pipelines for advanced analysis.

<br>

## Table of Contents

- [About the App](#about-the-app)
- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Demo](#demo)

---

## About the App

This project was built as part of a full-stack challenge to demonstrate:

- Frontend & Backend development
- WebAssembly + C++ integration
- SQL database with API key-protected endpoints
- ML-enhanced post analysis
- Full deployment on **Vercel** and **Render**

---

## Architecture Overview

```bash
📦 post-analysis/
├── 📁 main-app/         # Frontend (Next.js + Tailwind + TypeScript)
│   ├── 📁 src/
│   │   ├── 📁 app/       # Routes and pages
│   │   ├── 📁 components # UI components
│   │   ├── 📁 db/        # DB connection + init script
│   │   ├── 📁 wasm/      # WebAssembly modules (C++)
│   └── .env             # Env variables for DB/API
│
├── 📁 ml-api/           # FastAPI backend for ML analysis
│   ├── main.py          # /analyze endpoint
│   └── requirements.txt
│
├── 📁 cpp/              # C++ logic compiled via Emscripten
│   ├── wordcount.cpp
│   └── keywords.cpp
```

---

## Features

### Landing Page

- Paginated table of posts
- Each post shows title, user ID, and "View" link
- Button to create a new post using a modal

### Post Detail Page

- View post title, user ID, and full content
- Inline title editing with save
- Display 3 analysis tools:
  - Word count (C++ WebAssembly)
  - Keyword extraction (C++ WebAssembly)
  - Sentiment analysis (ML API)

### Admin / Backend

- MySQL-backed post data
- API key protection for modifying routes
- Initial DB setup script with JSONPlaceholder seed data

---

## Tech Stack

| Layer        | Tech                            |
|--------------|----------------------------------|
| Frontend     | Next.js 15, Tailwind CSS         |
| Backend API  | Next.js API Routes               |
| Native Logic | C++ compiled to WebAssembly      |
| Database     | MySQL                            |
| ML Pipeline  | FastAPI + HuggingFace Transformers |
| Deployment   | Vercel (Next.js), Render (ML)   |

---

## Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/post-analysis.git
cd post-analysis
```

### 2. Setup MySQL
Use Railway, PlanetScale, or local MySQL. Add the following to main-app/.env:

```bash
MYSQL_HOST=your-db-host
MYSQL_USER=your-user
MYSQL_PASS=your-password
MYSQL_DB=posts

NEXT_PUBLIC_API_BASE=https://your-ml-api.onrender.com
```

### 3. Initialize Database

```bash
cd main-app
npx tsx src/db/init.ts
```

This fetches and inserts 100 posts from JSONPlaceholder to the database.

### 4. Compile WebAssembly (C++)

```bash
cd cpp

# Word Count
emcc wordcount.cpp -O3 -s WASM=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s "EXPORT_NAME='wordcount'" -s ENVIRONMENT=web -s SINGLE_FILE=1 -s EXPORTED_FUNCTIONS="['_countWords']" -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap']" -o ../main-app/src/wasm/wordcount.js

# Keywords
emcc keywords.cpp -O3 -s WASM=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s "EXPORT_NAME='keywords'" -s ENVIRONMENT=web -s SINGLE_FILE=1 -s EXPORTED_FUNCTIONS="['_extractKeywords']" -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap']" -o ../main-app/src/wasm/keywords.js
```

This is already compiled and the result files are in main-app/src/wasm/.

### 5. Run FastAPI ML Server

```bash
cd ml-api
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Demo
The site is live on [link](https://post-analysis-beta.vercel.app).