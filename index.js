const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const port = 3000;

app.get("/fetch-data", async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    const url = req.query.url; // Get the URL from the query parameter
    if (!url) {
      res.status(400).json({ error: "URL parameter is required." });
      return;
    }

    await page.goto(url);
    await page.waitForSelector("title"); // Wait for the title element to load
    await page.waitForSelector('meta[name="description"]');

    const metaDescription = await page.$eval(
      'meta[name="description"]',
      (element) => element.getAttribute("content")
    );

    const pageTitle = await page.title(); // Get the title of the page
    // const pageContent = await page.content(); // Get the HTML content of the page

    await browser.close();

    res.json({
      title: pageTitle,
      metaDescription,
      // content: pageContent
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
