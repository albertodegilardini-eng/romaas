import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const url = process.argv[2] || 'https://weekly-grocery-ai.vercel.app';
const outDir = '/Users/ricardoguzmanm/weekly-grocery-ai/screenshots';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

console.log(`Opening ${url}`);
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(2000);

await page.screenshot({ path: `${outDir}/01-top.png`, fullPage: false });
console.log('Captured top view');

await page.evaluate(() => window.scrollBy(0, 900));
await page.waitForTimeout(800);
await page.screenshot({ path: `${outDir}/02-scrolled.png`, fullPage: false });
console.log('Captured scrolled view');

const title = await page.title();
const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
const imgCount = await page.locator('img').count();
const broken = await page.evaluate(() =>
  [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length,
);

console.log('TITLE:', title);
console.log('HEADINGS:', headings.slice(0, 8).join(' | '));
console.log('IMAGES:', imgCount, 'broken:', broken);

await browser.close();