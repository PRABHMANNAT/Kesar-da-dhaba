# Performance work checkpoint — 22 October 2026

This commit records work in progress, not a completed optimization release.

## Completed

- Production build succeeded before baseline measurements.
- Inventoried 16 content routes and the 404 document.
- Saved 34 Lighthouse navigation reports, one mobile and one desktop run per route, and a results table under `baseline/`.
- Saved HTML media and video inventories. The 31 inventoried videos have fast-start metadata.
- Captured 49 responsive baseline screenshots before interrupting the browser run for this checkpoint. The full browser run and its final interaction summary/trace are incomplete.
- Added development-only Lighthouse and Playwright dependencies and reusable audit/server/browser scripts.

The configured live reference URL returned HTTP 401. Local reports are lab measurements, not production field Core Web Vitals or INP measurements.

## Prepared but not applied

`scripts/perf-media.py` prepares additive image/font derivatives. It has not been run. `performance-delivery.mjs` is an unintegrated build-time delivery prototype: it requires the media manifest that the Python script generates. Neither is called by the production build, and neither has been visually validated. Website delivery and appearance are unchanged by these prototypes.

## Reproduce the baseline

From the website directory, install the locked development dependencies with `npm ci`, then run:

```sh
npm run build
node scripts/perf-server.mjs
# In another terminal:
node scripts/perf-audit.mjs --phase=baseline
node scripts/perf-browser.mjs baseline
```

The audit skips existing reports unless `--force` is supplied. Use `--mobile`, `--desktop` or `--route=/our-menu/` to narrow it. The scripts currently default to the installed Windows Chrome path; Lighthouse also accepts `CHROME_PATH`. The dedicated local server uses gzip and byte ranges consistently for baseline and final comparisons; it does not replace the existing development server or change deployed hosting.

## Remaining

Finish responsive and interaction baseline evidence and repeat representative audits; generate and compare media derivatives; integrate and validate delivery changes; investigate safe accessibility and animation improvements; remeasure every route; add measured budgets and the final performance report. No before/after improvement or zero-regression claim is made at this checkpoint.

Existing uncommitted server, honours-data and original-menu work is excluded from this commit.
