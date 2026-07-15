# Capabilities and Products Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create six balanced capabilities and a compact, responsive two-product logo presentation.

**Architecture:** Keep the static single-page structure and existing design tokens. Replace only the capability content and product layout, with a lightweight source-contract test covering content, assets, and responsive CSS.

**Tech Stack:** Semantic HTML5, CSS Grid, Python standard library tests

## Global Constraints

- Use Sidekick's genuine app icon and a generated high-resolution Orden icon derived from its existing mark; do not crop screenshots.
- Show two product cards in one row at 800px and above, and stack them below 800px.
- Keep product descriptions and links.
- Keep the capability grid symmetrical with six entries.

---

### Task 1: Content and layout contract

**Files:**
- Create: `tests/test_homepage.py`
- Modify: `index.html`
- Modify: `style.css`
- Create: `assets/products/sidekick-logo.png`
- Create: `assets/products/orden-logo.png`

**Interfaces:**
- Consumes: the static homepage source and existing product assets
- Produces: six `.capability` articles and a two-card `.product-grid`

- [ ] **Step 1: Write the failing test**

Create a standard-library `unittest` that asserts the six headings, two product cards, logo filenames, absence of screenshot references, desktop two-column CSS, and mobile one-column CSS.

- [ ] **Step 2: Run the test to verify it fails**

Run: `python -m unittest tests/test_homepage.py -v`
Expected: failures for the missing capability headings, product grid, and logo references.

- [ ] **Step 3: Implement the minimal markup, styles, and assets**

Update the capability articles, replace screenshot media with compact logo cards, copy the Sidekick source mark into `assets/products/`, and add the generated Orden app icon at matching dimensions.

- [ ] **Step 4: Run the test to verify it passes**

Run: `python -m unittest tests/test_homepage.py -v`
Expected: one passing test and zero failures.

- [ ] **Step 5: Verify in a browser**

Serve the repository locally, inspect 1280px and 390px layouts, confirm both logos load, check meaningful content and error overlays, and capture a full-page screenshot.
