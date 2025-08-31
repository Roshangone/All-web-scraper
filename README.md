# All-web-scraper
This is a comprehensive, full-stack web scraping application built with React for the frontend and Node.js with Express for the backend. The project provides a user-friendly interface to perform various web scraping tasks, including extracting text from web pages, finding embedded links, and processing other content.
<img width="958" height="433" alt="image" src="https://github.com/user-attachments/assets/a177a01c-6e61-415b-9ada-0c750c087f79" />
<img width="954" height="471" alt="image" src="https://github.com/user-attachments/assets/4e877ffb-1042-4d00-899c-4471d0974213" />

---

## 🚀 Features

- Extract all embedded links from any public web page
- Extract main page text
- Supports both static and JavaScript-heavy (dynamic) sites (via Puppeteer)
- Download extracted links as a text file
- Clean, modern UI
- Easy to deploy and share

---

## 🛠️Tech Stack
### Frontend
  - React
  -A popular JavaScript library for building user interfaces.
  We use React to create a fast, interactive, and component-based web UI for the web scraper, allowing users to input URLs, select scraping options, and view/download results.

  - Vite
  -A modern frontend build tool and development server.
  Vite provides lightning-fast hot module replacement and optimized builds for the React app, making development and deployment efficient.

  - Axios (or Fetch API)
  -A promise-based HTTP client for making API requests from the frontend to the backend.
  We use Axios (or Fetch) to send user input (URLs, options) to the backend API and receive the scraping results.

### Backend
  - Node.js
  -A JavaScript runtime for building scalable server-side applications.
  Node.js powers the backend server, handling API requests, running scraping logic, and serving data to the frontend.

  - Express.js
  -A minimal and flexible Node.js web application framework.
  Express is used to define API endpoints for scraping, manage routing, and handle HTTP requests/responses between the frontend and backend.
  
  - node-fetch
  -A lightweight module that brings window.fetch to Node.js.
  We use node-fetch to fetch the raw HTML content of static web pages for scraping.
  
  - cheerio
  -A fast, flexible, and lean implementation of core jQuery for the server.
  Cheerio parses and traverses the fetched HTML, allowing us to extract links and text from static web pages efficiently.
  
  - Puppeteer
  -A Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol.
  Puppeteer is used to scrape JavaScript-heavy (dynamic) websites by rendering pages like a real browser, enabling extraction of links that are not present in the initial HTML.
  
  ## Deployment
  - Render / Vercel / Netlify / Railway
  -Cloud platforms for hosting Node.js backends and static frontend sites.
  These services are used to deploy the backend API and frontend React app, making the web scraper accessible to anyone via a public URL.


## 🖥️ Live Demo

[Your Live Site Link Here](https://your-frontend.onrender.com)

## 📂 Project Structure

``` bash
All-web-scraper/
├── backend/
│   ├── server.js          # Express backend server
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── ScrapeForm.jsx
│   │   │   └── Results.jsx
│   │   └── ...
│   ├── package.json
│   └── ...
├── README.md
└── .gitignore
```

---

## 🛠️ Getting Started (Local Development)

### 1️⃣ Clone the repository

``` sh
git clone https://github.com/yourusername/all-web-scraper.git
cd all-web-scraper
```

### 2️⃣ Setup Backend

``` sh
cd backend
npm install
node server.js
```

👉 Backend runs on: `http://localhost:5000`

### 3️⃣ Setup Frontend

``` sh
cd ../frontend
npm install
npm run dev
```

👉 Frontend runs on: `http://localhost:5173`


## Deployment
You can deploy this project using Render, Vercel, Netlify, Railway, or any platform that supports Node.js and static hosting.

## 🌐 Deployment Guide

1.  Push your code to **GitHub**\
2.  Deploy **backend/** as a Node.js service (Render, Railway, etc.)\
3.  Deploy **frontend/** as a static site (Vercel, Netlify, etc.)\
4.  Update frontend `.env` or config to point to your backend API



## ⚠️ Notes & Limitations
-    Some websites use anti-bot measures (Cloudflare, Captchas)\
-    For advanced scraping, add `puppeteer-extra-plugin-stealth` and
    use **rotating proxies**\
-    Respect robots.txt and website terms of service

## Example Usage

-   Enter a URL in the input box\
-   Select **Extract Links** or **Get Main Page Text** from the
    dropdown\
-   Click **Run**\
-   View results directly or download them as a `.txt` file

## 📄 License
This project is licensed under the **MIT License**.
