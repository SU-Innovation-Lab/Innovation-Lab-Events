const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    timezoneId: "America/Los_Angeles",
    locale: "en-US",
  });
  const page = await ctx.newPage();
  await page.goto("https://su-innovation-lab.github.io/Innovation-Lab-Events/?display=1", { waitUntil: "networkidle" });
  await page.waitForSelector(".hero");
  await page.waitForFunction(() => [...document.images].every(i => i.complete));
  await page.screenshot({ path: "Lab-Desktop.jpg", type: "jpeg", quality: 90 });
  await browser.close();
})();
