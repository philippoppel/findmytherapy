import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generatePDF() {
  console.log('Starting PDF generation...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Path to the HTML file
    const htmlPath = join(__dirname, '../apps/web/public/downloads/findmytherapy-infopaket.html');
    const pdfPath = join(__dirname, '../apps/web/public/downloads/findmytherapy-infopaket.pdf');

    console.log(`Loading HTML from: ${htmlPath}`);

    // Load the HTML file
    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle0'
    });

    console.log('Generating PDF...');

    // Generate PDF with A4 format
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    });

    console.log(`✅ PDF generated successfully: ${pdfPath}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

generatePDF();
