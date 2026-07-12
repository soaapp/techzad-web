# Techzad Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved Techzad TZ monogram as project-native SVG assets and use the standalone mark in the site header.

**Architecture:** Keep the identity assets dependency-free under `assets/`. The header references the adaptive SVG with an accessible link label; the document head references the dedicated favicon. CSS owns rendered sizing and focus behavior.

**Tech Stack:** Static HTML, CSS, SVG, Node.js built-in test runner.

## Global Constraints

- Header displays the symbol only; no Techzad wordmark text.
- Preserve exact approved TZ geometry and muted brass accent.
- No raster logo, gradient, shadow, or decorative container.
- Maintain a clear accessible name and visible keyboard focus.

---

### Task 1: Add logo assets and header integration

**Files:**
- Create: `assets/techzad-mark.svg`
- Create: `assets/techzad-favicon.svg`
- Create: `tests/logo.test.mjs`
- Modify: `index.html`
- Modify: `style.css`

**Interfaces:**
- Consumes: the existing `.brand` header link and light/dark site colors.
- Produces: an adaptive `.brand-mark` image and SVG favicon.

- [ ] **Step 1: Write the failing test**

```js
assert.match(html, /aria-label="Techzad home"/);
assert.match(html, /assets\/techzad-mark\.svg/);
assert.match(css, /\.brand-mark/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/logo.test.mjs`
Expected: FAIL because the SVG assets and header image do not exist.

- [ ] **Step 3: Add the SVG assets and minimal header integration**

Create the adaptive mark and favicon SVGs, replace the header wordmark with the mark image, add the favicon link, and size `.brand-mark` to 34px with a 30px mobile size.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/logo.test.mjs`
Expected: PASS.

- [ ] **Step 5: Verify the site**

Open the local site at `http://127.0.0.1:8080/`, confirm the mark is visible in the top-left, and check for console errors.
