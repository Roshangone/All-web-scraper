import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { Router } from "express";
import cors from "cors";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

const router = Router();

// Test endpoint to verify frontend-backend connection
router.get("/test", (req, res) => {
  res.json({ data: { links: ["https://test.com", "https://example.com"] } });
});

// Extract embedded links from static HTML
router.post("/scrape/extract-embedded-links", async (req, res) => {
  try {
    const { url } = req.body;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    let links = [];
    $("a[href]").each((_, el) => {
      links.push(new URL($(el).attr("href"), url).href);
    });

    res.json({ data: { links: [...new Set(links)] } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Extract embedded links using Puppeteer (for JS-heavy sites)
router.post("/scrape/extract-embedded-links-js", async (req, res) => {
  try {
    const { url } = req.body;
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await page.waitForTimeout(3000);

    const links = await page.$$eval("a[href]", as =>
      Array.from(new Set(as.map(a => a.href)))
    );

    await browser.close();
    res.json({ data: { links } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get main page text
router.post("/scrape/get-main-text", async (req, res) => {
  try {
    const { url } = req.body;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    $("script, style").remove();
    const text = $("body").text().replace(/\s+/g, " ").trim();
    res.json({ data: { text: text } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/api", router);

// 404 handler
app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));