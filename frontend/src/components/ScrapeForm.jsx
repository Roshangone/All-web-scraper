import React, { useMemo, useState } from 'react'
import api from '../api'

export const OPERATIONS = [
  { key: 'embedded-links', label: 'Extract Embedded Links', endpoint: '/scrape/extract-embedded-links', needs: [] },
  { key: 'embedded-links-js', label: 'Extract Embedded Links (JS/Puppeteer)', endpoint: '/scrape/extract-embedded-links-js', needs: [] },
  { key: 'main-text', label: 'Get Main Page Text', endpoint: '/scrape/get-main-text', needs: [] },
  { key: 'main-with-embedded', label: 'Main + Embedded Text', endpoint: '/scrape/text/main-with-embedded', needs: ['maxPages'] },
  { key: 'complete-text', label: 'Complete Site Crawl Text', endpoint: '/scrape/text/complete', needs: ['maxPages', 'maxDepth'] },
  { key: 'pdf-extract', label: 'Extract Text from PDF URL', endpoint: '/scrape/pdf/extract', needs: [] },
  { key: 'pdfs-on-page', label: 'List PDFs on Page', endpoint: '/scrape/pdf/main-with-embedded', needs: [] }
]

function getDomainName(u) {
  try {
    const h = new URL(u).hostname
    return h.replace(/^www\./i, '')
  } catch {
    return ''
  }
}

export default function ScrapeForm({ setResult, setLoading, setError }) {
  const [url, setUrl] = useState('')
  const [op, setOp] = useState(OPERATIONS[0].key)
  const [maxPages, setMaxPages] = useState(10)
  const [maxDepth, setMaxDepth] = useState(2)

  const selectedOp = useMemo(() => OPERATIONS.find(o => o.key === op), [op])
  const domain = useMemo(() => getDomainName(url), [url])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      let payload = { url }
      if (op === 'main-with-embedded') payload.maxPages = Number(maxPages)
      if (op === 'complete-text') payload = { url, maxDepth: Number(maxDepth), maxPages: Number(maxPages) }
      if (op === 'pdf-extract') payload = { pdfUrl: url }

      const response = await api.post(selectedOp.endpoint, payload)
      setResult({
        op,
        opLabel: selectedOp.label,
        data: response.data,
        domain
      })
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <div className="label">Utility</div>
        <select value={op} onChange={e => setOp(e.target.value)}>
          {OPERATIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
      </div>

      <div className="field">
        <div className="label">Enter Website Link</div>
        <input
          placeholder="https://example.com"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <div className="domain-line">
          <span className="domain-label">Domain Name:</span>
          <span className="domain-value">{domain || '—'}</span>
        </div>
      </div>

      {(selectedOp.needs.includes('maxPages') || selectedOp.needs.includes('maxDepth')) && (
        <div className="row options">
          {selectedOp.needs.includes('maxPages') && (
            <label>Max pages <input type="number" value={maxPages} onChange={e => setMaxPages(e.target.value)} min={1} /></label>
          )}
          {selectedOp.needs.includes('maxDepth') && (
            <label>Max depth <input type="number" value={maxDepth} onChange={e => setMaxDepth(e.target.value)} min={0} /></label>
          )}
        </div>
      )}

      <div className="actions">
        <button type="submit">Run</button>
      </div>
    </form>
  )
}