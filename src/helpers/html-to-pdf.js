const puppeteer = require("puppeteer");

// Default options for PDF generation
const defaultOptions = {
  format: "Letter",
  printBackground: true,
};

// Function to generate PDF from HTML
async function htmlToPdf(html, options = defaultOptions) {
  let browser;
  console.log("HTML to PDF generated");

  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
      headless: true,
    });

    const version = await browser.version();
    console.log(`Chromium version: ${version}`);

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf(options);

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  } finally {
    if (browser) {
      try {
        // await browser.close();
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }
  }
}

// Corrected export statement
module.exports = htmlToPdf;
