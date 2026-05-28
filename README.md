# techzad.ca

Static one-page site for Techzad Inc. — the studio behind [Sidekick](https://yoursidekick.ca).

Hosted via GitHub Pages from this repo's `main` branch, with `CNAME` mapped to `techzad.ca` (Cloudflare DNS in front).

Same pattern as [`soaapp/sidekick-web`](https://github.com/soaapp/sidekick-web).

## Files

- `index.html` — landing page (hero + work + about + contact)
- `style.css` — Inter typography + warm-neutral palette; mirrors the Sidekick site's surface-tier system
- `CNAME` — `techzad.ca` for GitHub Pages

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploying changes

Push to `main`. GitHub Pages rebuilds automatically (~30s).
