import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8');
}

test('marketing source exposes separate claimant and law-firm journeys', async () => {
  const page = await source('src/pages/index.astro');

  assert.match(page, /INDIVIDUAL \/ CLAIMANT/);
  assert.match(page, /ORGANIZATION \/ LAW FIRM/);
  assert.match(page, /https:\/\/user\.claimgraph\.us\/onboarding\//);
  assert.match(page, /https:\/\/org\.claimgraph\.us\/onboarding\//);
  assert.match(page, /Claimants never enter through an admin or law-firm session/);
});

test('all account links use the owned claimgraph.us boundaries', async () => {
  const page = await source('src/pages/index.astro');

  assert.match(page, /https:\/\/auth\.claimgraph\.us\//);
  assert.match(page, /https:\/\/user\.claimgraph\.us\/login\//);
  assert.match(page, /https:\/\/org\.claimgraph\.us\/login\//);
  assert.doesNotMatch(page, /(?:user|org|auth)\.claimgraph\.github\.io/);
});

test('public support stays on the anonymous ORES Chat edge', async () => {
  const page = await source('src/pages/index.astro');
  const chatConfig = await source('.ores-chat.toml');

  assert.match(page, /https:\/\/chatbot\.claimgraph\.us\//);
  assert.match(page, /cannot view private reports, provide legal advice, or make decisions about a claim/);
  assert.match(chatConfig, /PUBLIC_ORES_CHAT_API_BASE_URL/);
  assert.doesNotMatch(page, /Authorization|bearer|auth_token/i);
});

test('built page retains accessible onboarding landmarks', async () => {
  const html = await source('dist/index.html');

  assert.match(html, /id="access"/);
  assert.match(html, /aria-labelledby="access-title"/);
  assert.match(html, /aria-labelledby="support-title"/);
  assert.match(html, /Claimant log in/);
  assert.match(html, /Law-firm log in/);
});
