const axios = require('axios');
const pdfParse = require('pdf-parse');
const cheerio = require('cheerio');
const { URL } = require('url');

const DEFAULT_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT_MS || '20000', 10);

async function fetchBinary(url) {
  const resp = await axios.get(url, { responseType: 'arraybuffer', timeout: DEFAULT_TIMEOUT, headers: { 'User-Agent': 'web-scrapper/1.0' } });
  return Buffer.from(resp.data);
}

async function extractPdfText(pdfUrl) {
  const buf = await fetchBinary(pdfUrl);
  const data = await pdfParse(buf);
  return data.text;
}

function normalizeLink(href, base) {
  try { return new URL(href, base).toString(); } catch (e) { return null; }
}

async function getPdfsFromPage(pageUrl) {
  const resp = await axios.get(pageUrl, { timeout: DEFAULT_TIMEOUT, headers: { 'User-Agent': 'web-scrapper/1.0' } });
  const $ = cheerio.load(resp.data);
  const pdfs = [];
  $('a[href]').each((i, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    const full = normalizeLink(href, pageUrl);
    if (full && full.toLowerCase().endsWith('.pdf')) pdfs.push(full);
  });
  return Array.from(new Set(pdfs));
}

module.exports = { extractPdfText, getPdfsFromPage, fetchBinary };
