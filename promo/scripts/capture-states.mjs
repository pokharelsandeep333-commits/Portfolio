// Captures the interactive states `hyperframes capture` cannot reach (chat
// drawer with a real answer, resume modal). Re-run after any site change.
import { chromium } from 'playwright-core';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runChatExchange, pngSize } from './lib/capture-helpers.mjs';

const SITE = process.env.PROMO_SITE_URL ?? 'https://portfolio.sandeeppokharel.com.np/';
const QUESTION = 'What have you built with AWS?';
const VIEWPORT = { width: 1440, height: 900 };
const SCALE = 2;
const out = (name) => fileURLToPath(new URL(`../assets/states/${name}`, import.meta.url));

mkdirSync(out(''), { recursive: true });
rmSync(out('BLOCKED-chat.md'), { force: true });

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: SCALE, reducedMotion: 'no-preference' });
const page = await context.newPage();

async function requireVisible(selector, what) {
  try {
    await page.locator(selector).first().waitFor({ state: 'visible', timeout: 15000 });
  } catch {
    throw new Error(`capture-states: ${what} not found (selector ${selector}). Did the site change?`);
  }
}

async function shoot(name, locator, minWidth = VIEWPORT.width * SCALE) {
  const path = out(name);
  if (locator) await locator.screenshot({ path });
  else await page.screenshot({ path });
  const { width, height } = pngSize(readFileSync(path));
  if (width < minWidth) throw new Error(`${name} is ${width}px wide, expected at least ${minWidth}`);
  console.log(`captured ${name} ${width}x${height}`);
}

try {
  // Hero, after the GSAP boot sequence (veil, gold line, copy) settles.
  await page.goto(SITE, { waitUntil: 'load' }); // not networkidle: the hero MP4 keeps streaming
  await requireVisible('#hero', 'hero section');
  await page.waitForTimeout(3500);
  await shoot('hero.png');

  // Projects. body is the scroll container (index.css), so scrollIntoView on the
  // section scrolls body. Cards reveal once (ScrollTrigger once: true).
  await requireVisible('#projects', 'Projects section');
  await page.evaluate(() => document.getElementById('projects').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(2000);
  await shoot('projects-view.png');
  const projectsHeight = await page.evaluate(() => Math.ceil(document.getElementById('projects').getBoundingClientRect().height));
  await page.setViewportSize({ width: VIEWPORT.width, height: projectsHeight });
  await page.evaluate(() => document.getElementById('projects').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(800);
  await shoot('projects-full.png', page.locator('#projects'));
  await page.setViewportSize(VIEWPORT);
  await page.evaluate(() => document.getElementById('projects').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(800);

  // Chat drawer: empty state, then one real exchange with the live bot.
  await requireVisible('button[aria-label="Toggle AI chat"]', 'chat toggle button');
  await page.locator('button[aria-label="Toggle AI chat"]').click();
  await requireVisible('.chat-drawer.is-open', 'open chat drawer');
  await page.waitForTimeout(900);
  await shoot('chat-empty.png');

  // A transport failure or timeout comes back as a blocked verdict too, so every
  // failed exchange leaves a BLOCKED note instead of a bare Playwright error.
  const verdict = await runChatExchange(page, { question: QUESTION });
  if (!verdict.ok) {
    writeFileSync(out('BLOCKED-chat.md'), `# Chat capture blocked\n\n- when: ${new Date().toISOString()}\n- url: ${verdict.url ?? '(no response)'}\n- reason: ${verdict.reason}\n\nDo not fabricate an answer. Ask Sandeep: wait and retry, fix the bot first, or cut frame 4.\n`);
    throw new Error(`capture-states: chat blocked (${verdict.reason}). See assets/states/BLOCKED-chat.md`);
  }
  await page.waitForTimeout(1500); // let the bubble render and scroll into view
  await shoot('chat-answer.png');
  writeFileSync(out('chat-answer.json'), JSON.stringify({
    question: QUESTION, answer: verdict.answer, status: verdict.status, capturedAt: new Date().toISOString(), url: SITE,
  }, null, 2));

  // Resume: close chat, open the modal, then the whole paper at a tall viewport.
  await requireVisible('button[aria-label="Close chat"]', 'close-chat button');
  await page.locator('button[aria-label="Close chat"]').click();
  await page.waitForTimeout(600);
  await requireVisible('#nav-resume-link', 'resume link in the navbar');
  await page.locator('#nav-resume-link').click();
  await requireVisible('#resume-overlay', 'resume overlay');
  await page.waitForTimeout(1200);
  await shoot('resume-view.png');
  await requireVisible('#resume-print-area', 'resume paper');
  const paperHeight = await page.evaluate(() => Math.ceil(document.getElementById('resume-print-area').getBoundingClientRect().height));
  await page.setViewportSize({ width: VIEWPORT.width, height: paperHeight + 200 });
  await page.waitForTimeout(800);
  // The paper is ~820 CSS px wide, so 2x gives ~1640 px: still sharp on a 1080-wide canvas.
  await shoot('resume-paper.png', page.locator('#resume-print-area'), 1600);
} finally {
  await browser.close();
}
