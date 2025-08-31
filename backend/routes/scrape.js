// scrape.js
const express = require('express')
const router = express.Router()
const Scraper = require('./scraper')
const PdfService = require('./pdf')

// Health check
router.get('/health', (_req, res) => res.json({ status: 'ok' }))

// Extract embedded links
router.post('/scrape/embedded-links', async (req, res) => {
  try {
    const { url } = req.body || {}
    if (!url) return res.status(400).json({ error: 'Missing "url" in body' })
    const links = await Scraper.getEmbeddedLinks(url)
    res.json({ links })
  } catch (err) {
    console.error('[embedded-links]', err)
    res.status(500).json({ error: err.message || 'Failed to extract links' })
  }
})

// (Optional) simple PDF helpers you already wired up on the frontend list
router.post('/scrape/pdf/extract', async (req, res) => {
  try {
    const { pdfUrl } = req.body || {}
    if (!pdfUrl) return res.status(400).json({ error: 'Missing "pdfUrl" in body' })
    const text = await PdfService.extractPdfText(pdfUrl)
    res.json({ text })
  } catch (err) {
    console.error('[pdf/extract]', err)
    res.status(500).json({ error: err.message || 'Failed to parse PDF' })
  }
})

router.post('/scrape/pdf/main-with-embedded', async (req, res) => {
  try {
    const { url } = req.body || {}
    if (!url) return res.status(400).json({ error: 'Missing "url" in body' })
    const links = await PdfService.getPdfsFromPage(url)
    res.json({ pdfs: links })
  } catch (err) {
    console.error('[pdf/main-with-embedded]', err)
    res.status(500).json({ error: err.message || 'Failed to extract PDFs from page' })
  }
})

module.exports = router