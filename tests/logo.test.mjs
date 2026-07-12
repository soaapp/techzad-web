import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

test('header uses the standalone Techzad logo asset accessibly', async () => {
  const [html, css, mark, favicon] = await Promise.all([
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('style.css', root), 'utf8'),
    readFile(new URL('assets/techzad-mark.svg', root), 'utf8'),
    readFile(new URL('assets/techzad-favicon.svg', root), 'utf8'),
  ]);

  assert.match(html, /<link rel="icon" href="assets\/techzad-favicon\.svg" type="image\/svg\+xml" \/>/);
  assert.match(html, /<a href="\/" class="brand" aria-label="Techzad home">/);
  assert.match(html, /<img src="assets\/techzad-mark\.svg" alt="" class="brand-mark" \/>/);
  assert.doesNotMatch(html, /<a href="\/" class="brand"[^>]*>\s*<span class="wordmark">Techzad<\/span>/);
  assert.match(css, /\.brand-mark\s*\{/);
  assert.match(mark, /viewBox="0 0 64 64"/);
  assert.match(favicon, /viewBox="0 0 64 64"/);
});
