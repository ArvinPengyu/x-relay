const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const target = process.env.TARGET;
  const out = process.env.OUTNAME || 'render.json';
  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-blink-features=AutomationControlled']
  });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 }
  });
  const page = await ctx.newPage();
  let status = 0, err = '';
  try {
    const resp = await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60000 });
    status = resp ? resp.status() : 0;
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(3000);
      const n = await page.evaluate(() => document.querySelectorAll('.timeline-item, article, [data-testid="tweet"]').length).catch(() => 0);
      if (n > 3) break;
    }
    // 多滚几次，便于翻页
    const scrolls = Number(process.env.SCROLLS || 3);
    for (let i = 0; i < scrolls; i++) {
      await page.mouse.wheel(0, 5000);
      await page.waitForTimeout(1800);
    }
  } catch (e) {
    err = String(e.message || e).slice(0, 200);
  }
  let html = '';
  try { html = await page.content(); } catch (e) {}
  await browser.close();
  fs.mkdirSync('out', { recursive: true });
  fs.writeFileSync('out/' + out, JSON.stringify({
    status, err, ts: Math.floor(Date.now() / 1000),
    b64: Buffer.from(html, 'utf8').toString('base64')
  }));
  console.log('rendered', status, html.length, err);
})();
