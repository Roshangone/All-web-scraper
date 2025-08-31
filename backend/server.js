import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { Router } from "express";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json());

const router = Router();

// Test endpoint to verify frontend button rendering
router.get("/test", (req, res) => {
  res.json({ data: { links: ["https://test.com", "https://example.com"] } });
});

// Endpoint for extracting links (static HTML)
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

    console.log("Extracted links:", links); // Debug log

    res.json({ data: { links: [...new Set(links)] } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint for extracting links using Puppeteer (JS-rendered)
router.post("/scrape/extract-embedded-links-js", async (req, res) => {
  try {
    const { url } = req.body;
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const links = await page.$$eval("a[href]", as =>
      Array.from(new Set(as.map(a => a.href)))
    );

    await browser.close();
    console.log("Puppeteer extracted links:", links);

    res.json({ data: { links } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example: get main page text
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

app.listen(5000, () => console.log("Server running on port 5000"));