// backend/services/scraper.js
const axios = require('axios')
const cheerio = require('cheerio')
const { URL } = require('url')

const DEFAULT_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT_MS || '20000', 10)
const UA = 'web-scrapper/1.0'

function normalize(href, base) {
  try { return new URL(href, base).toString() } catch { return null }
}

async function getHtml(url) {
  const resp = await axios.get(url, {
    timeout: DEFAULT_TIMEOUT,
    maxRedirects: 5,
    headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' }
  })
  return resp.data
}

/**
 * Embedded links = same-origin <a href="..."> links, absolute and unique.
 */
async function getEmbeddedLinks(pageUrl) {
  const html = await getHtml(pageUrl)
  const $ = cheerio.load(html)
  const origin = new URL(pageUrl).origin
  const out = new Set()

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')
    if (!href) return
    const full = normalize(href, pageUrl)
    if (!full) return
    const u = new URL(full)
    if (!/^https?:$/.test(u.protocol)) return
    // keep same-origin only (embedded)
    if (u.origin === origin) {
      u.hash = ''
      out.add(u.toString())
    }
  })

  return Array.from(out)
}

module.exports = { getEmbeddedLinks }
