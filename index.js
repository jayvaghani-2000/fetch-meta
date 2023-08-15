const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const Chromium = require("chrome-aws-lambda");

const app = express();
const port = 3000;

app.get("/fetch-title", async (req, res) => {
  try {
    const browser = await Chromium.puppeteer.launch({
      executablePath: await Chromium.executablePath,
    });
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
app.get("/fetch-keywords", async (req, res) => {
  try {
    const browser = await Chromium.puppeteer.launch({
      executablePath: await Chromium.executablePath,
    });
    const page = await browser.newPage();

    const url = req.query.url; // Get the URL from the query parameter
    if (!url) {
      res.status(400).json({ error: "URL parameter is required." });
      return;
    }

    await page.goto(url);
    const keywordsSelector = 'meta[name="keywords"]';

    await page.waitForSelector(keywordsSelector); // Wait for the meta keywords tag to appear

    const keywords = await page.$eval(keywordsSelector, (element) =>
      element.getAttribute("content")
    );

    await browser.close();

    res.json({
      keywords,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred." });
  }
});
app.get("/fetch-image", async (req, res) => {
  try {
    const browser = await Chromium.puppeteer.launch({
      executablePath: await Chromium.executablePath,
    });
    const page = await browser.newPage();

    const url = req.query.url; // Get the URL from the query parameter
    if (!url) {
      res.status(400).json({ error: "URL parameter is required." });
      return;
    }

    await page.goto(url);
    const imageSelector = 'meta[property="og:image"]';

    await page.waitForSelector(imageSelector); // Wait for the meta keywords tag to appear

    const image = await page.$eval(imageSelector, (element) =>
      element.getAttribute("content")
    );

    await browser.close();

    res.json({
      image,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred." });
  }
});

app.get("/fetch-description", async (req, res) => {
  try {
    const browser = await Chromium.puppeteer.launch({
      executablePath: await Chromium.executablePath,
    });
    const page = await browser.newPage();

    const url = req.query.url; // Get the URL from the query parameter
    if (!url) {
      res.status(400).json({ error: "URL parameter is required." });
      return;
    }

    await page.goto(url);
    const descriptionSelector = 'meta[name="description"]';

    await page.waitForSelector(descriptionSelector); // Wait for the meta description tag to appear

    const metaDescription = await page.$eval(descriptionSelector, (element) =>
      element.getAttribute("content")
    );

    await browser.close();

    res.json({
      metaDescription,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred." });
  }
});

// app.get("/fetch-media", async (req, res) => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   const url = req.query.url;
//   try {
//     let counter = 0;
//     page.on("response", async (response) => {
//       const matches = /.*\.(jpg|png|svg|gif)$/.exec(response.url());
//       if (matches && matches.length === 2) {
//         const extension = matches[1];
//         const buffer = await response.buffer();
//         fs.writeFileSync(
//           `images/image-${counter}.${extension}`,
//           buffer,
//           "base64"
//         );
//         counter += 1;
//       }
//     });

//     await page.goto(url);
//     res.status(200).json({ success: "Images saved successfully" });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error });
//   } finally {
//     await browser.close();
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
