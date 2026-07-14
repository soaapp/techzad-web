// Renders a social card PNG for every post in _posts/ that doesn't have one.
// Cards land in assets/og/<slug>.png (1200x630 at 2x for crispness).
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";
import puppeteer from "puppeteer-core";

const TEMPLATE = readFileSync("assets/og/template.html", "utf8");
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  for (const candidate of ["google-chrome", "chromium-browser", "chromium"]) {
    try {
      return execSync(`which ${candidate}`).toString().trim();
    } catch { /* keep looking */ }
  }
  throw new Error("No Chrome/Chromium found; set CHROME_PATH");
}

const posts = readdirSync("_posts").filter((f) => f.endsWith(".md"));
const work = [];

for (const file of posts) {
  const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");
  const out = `assets/og/${slug}.png`;
  if (existsSync(out)) continue;

  const src = readFileSync(`_posts/${file}`, "utf8");
  const titleMatch = src.match(/^title:\s*"?(.+?)"?\s*$/m);
  if (!titleMatch) {
    console.warn(`skip ${file}: no title in front matter`);
    continue;
  }
  const [, y, m, d] = file.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const date = `${MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`;
  work.push({ out, title: titleMatch[1], date });
}

if (work.length === 0) {
  console.log("All posts already have cards.");
  process.exit(0);
}

mkdirSync("assets/og", { recursive: true });
const browser = await puppeteer.launch({
  executablePath: chromePath(),
  args: ["--no-sandbox", "--font-render-hinting=none"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });

  for (const { out, title, date } of work) {
    const html = TEMPLATE
      .replace("{{TITLE}}", escapeHtml(title))
      .replace("{{DATE}}", escapeHtml(date));
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    const png = await page.screenshot({ type: "png" });
    writeFileSync(out, png);
    console.log(`rendered ${out} (${title})`);
  }
} finally {
  await browser.close();
}
