import test from 'node:test';
import assert from 'node:assert/strict';
import { auditStrings, extractItems, loadFacts, MAX_CALLOUT_CHARS } from './audit-copy.mjs';

const facts = {
  title: 'IT Support Desk Technician',
  projectTitles: ['SandeepCloud', 'ShiftSentry', 'Private RAG Search Engine'],
  projectCount: 7,
};
const rules = (items) => auditStrings(items, facts).map((f) => f.rule);

test('clean copy passes', () => {
  assert.deepEqual(rules([
    { text: '7 shipped projects', kind: 'callout' },
    { text: 'IT Support Desk Technician', kind: 'title' },
    { text: 'ShiftSentry', kind: 'project' },
  ]), []);
});

test('banned stems are caught in any casing and inflection', () => {
  assert.deepEqual(rules([{ text: 'Seamlessly deployed to AWS', kind: 'text' }]), ['banned-word']);
  assert.deepEqual(rules([{ text: 'Leveraged Docker', kind: 'callout' }]), ['banned-word']);
  assert.deepEqual(rules([{ text: 'unlocking insights', kind: 'text' }]), ['banned-word']);
});

test('"delivered" is not mistaken for the "delv" stem', () => {
  assert.deepEqual(rules([{ text: 'Delivered on time', kind: 'text' }]), []);
});

test('project count must equal projects.length', () => {
  assert.deepEqual(rules([{ text: '8 shipped projects', kind: 'callout' }]), ['project-count']);
});

test('inflated titles are rejected anywhere', () => {
  assert.deepEqual(rules([{ text: 'Full Stack Developer', kind: 'text' }]), ['inflated-title']);
  assert.deepEqual(rules([{ text: 'Cloud Engineer · DSU', kind: 'text' }]), ['inflated-title']);
});

test('a title-tagged span must match about.title exactly', () => {
  assert.deepEqual(rules([{ text: 'IT Support Technician', kind: 'title' }]), ['title-mismatch']);
});

test('a project-tagged name must be a real project title', () => {
  assert.deepEqual(rules([{ text: 'Sandeep Cloud', kind: 'project' }]), ['unknown-project']);
});

test('callouts longer than the limit are rejected', () => {
  const long = 'x'.repeat(MAX_CALLOUT_CHARS + 1);
  assert.deepEqual(rules([{ text: long, kind: 'callout' }]), ['callout-too-long']);
  assert.deepEqual(rules([{ text: 'x'.repeat(MAX_CALLOUT_CHARS), kind: 'callout' }]), []);
});

test('extractItems reads template-wrapped sub-compositions, data-text, and skips scripts', () => {
  const html = `<!doctype html><html><head><style>.a{}</style></head><body><template>
    <style>#root{color:#fff}</style>
    <div id="root" data-composition-id="f1">
      <span class="pill" data-callout>7 shipped   projects</span>
      <h1 data-text="Sandeep Pokharel">S#nd@@p</h1>
      <span data-fact="title">IT Support Desk Technician</span>
      <b data-fact="project">ShiftSentry</b>
    </div>
    <script>const t = "seamlessly hidden in script";</script>
  </template></body></html>`;
  const items = extractItems(html);
  const has = (text, kind) => items.some((i) => i.text === text && i.kind === kind);
  assert.ok(has('7 shipped projects', 'callout'), 'callout text normalized');
  assert.ok(has('Sandeep Pokharel', 'text'), 'data-text captured');
  assert.ok(has('IT Support Desk Technician', 'title'));
  assert.ok(has('ShiftSentry', 'project'));
  assert.ok(!items.some((i) => /seamlessly/.test(i.text)), 'script text ignored');
});

test('loadFacts reads the live data modules', async () => {
  const f = await loadFacts();
  assert.equal(f.title, 'IT Support Desk Technician');
  assert.equal(f.projectCount, f.projectTitles.length);
  assert.ok(f.projectTitles.includes('ShiftSentry'));
});

import { findScriptCopyLiterals, compareCaptureLock } from './audit-copy.mjs';

test('copy hard-coded as a script literal is flagged (the audited attribute would not reach the screen)', () => {
  const html = `<template><span data-callout data-text="7 shipped projects">7 shipped projects</span>
    <script>var CALLOUT_TEXT = "7 shipped projects";</script></template>`;
  assert.deepEqual(findScriptCopyLiterals(html).map((f) => f.rule), ['script-literal-copy']);
});

test('copy read from the attribute at runtime is not flagged', () => {
  const html = `<template><span id="p" data-callout data-text="7 shipped projects">7 shipped projects</span>
    <script>var CALLOUT_TEXT = document.getElementById("p").getAttribute("data-text");</script></template>`;
  assert.deepEqual(findScriptCopyLiterals(html), []);
});

test('the capture lock flags changed, missing and new capture files', () => {
  const lock = { 'hero.png': 'aaa', 'chat-answer.json': 'bbb', 'resume-paper.png': 'ccc' };
  const now = { 'hero.png': 'aaa', 'chat-answer.json': 'CHANGED', 'projects-full.png': 'ddd' };
  const f = compareCaptureLock(lock, now);
  assert.deepEqual(f.map((x) => `${x.rule}:${x.text}`).sort(), [
    'capture-changed:chat-answer.json', 'capture-missing:resume-paper.png', 'capture-unlocked:projects-full.png',
  ]);
});

test('an unchanged capture passes the lock', () => {
  assert.deepEqual(compareCaptureLock({ 'hero.png': 'aaa' }, { 'hero.png': 'aaa' }), []);
});

test('a quoted mention inside a script comment is not flagged', () => {
  const html = `<template><span id="p" data-callout data-text="7 shipped projects">7 shipped projects</span>
    <script>
      // Scene 2: "7 shipped projects" scrambles in
      /* the "7 shipped projects" pill */
      var T = document.getElementById("p").getAttribute("data-text");
    </script></template>`;
  assert.deepEqual(findScriptCopyLiterals(html), []);
});
