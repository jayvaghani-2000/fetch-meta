const express = require("express");
const puppeteer = require("puppeteer");

const playwright = require("playwright");

const app = express();
const port = 3000;

app.get("/fetch-data", async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const url = req.query.url; // Get the URL from the query parameter
    if (!url) {
      res.status(400).json({ error: "URL parameter is required." });
      return;
    }

    await page.goto(url);
    const titleSelector = "title";
    const descriptionSelector = 'meta[name="description"]';
    const keywordsSelector = 'meta[name="keywords"]';

    await page.waitForSelector(titleSelector); // Wait for the title tag to appear
    // await page.waitForSelector(descriptionSelector); // Wait for the meta description tag to appear
    // await page.waitForSelector(keywordsSelector); // Wait for the meta keywords tag to appear

    // const metaDescription = await page.$eval(
    //   'meta[name="description"]',
    //   (element) => element.getAttribute("content")
    // );
    // const keywords = await page.$eval(keywordsSelector, (element) =>
    //   element.getAttribute("content")
    // );
    const pageTitle = await page.title(); // Get the title of the page
    // const pageContent = await page.content(); // Get the HTML content of the page

    await browser.close();

    res.json({
      title: pageTitle,
      // metaDescription,
      // keywords,
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
