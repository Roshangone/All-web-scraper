// App.jsx
import React, { useState } from 'react'
import ScrapeForm from './components/ScrapeForm'
import Results from './components/Results'

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  return (
    <div className="container">
      <header className="page-header">
        <h1 className="title">Web Scraper</h1>
        <h2 className="subtitle">Web Scraper for all Web Scraping Functionalities</h2>
      </header>

      <main>
        <ScrapeForm setResult={setResult} setLoading={setLoading} setError={setError} />
        {/* 🔥 FIX: rename result -> results */}
        <Results results={result} loading={loading} error={error} />
      </main>

      <footer>
        <small>Use responsibly. Respect robots.txt and site terms.</small>
      </footer>
    </div>
  )
  console.log("Result passed to Results:", result);
}
