# Launch notes

Items that must be settled before the site is switched to indexable (`LAUNCH=1`, build/README.md). Each line says
where the item shows on the site today and what closes it. Started with the v6 interaction refinement
(docs/UX-AUDIT.md, docs/ux-changes.json); later rounds add to it.

## Launch blockers

### 1. Placeholder links for the four division websites not yet built (UX audit item 34)

Four of the six Imperial websites have no address yet. Their links point nowhere (`href="#"`), open the "Link to
confirm" toast when pressed, carry `aria-disabled="true"` and show a visible "To confirm" mark beside their name
(`extLink()` and `siteLink()` in assets/js/app.js, data from `sites` and each division's `cta` in assets/js/data.js).
The audit counted 402 such links across the built pages, about 8 on a typical page.

| Website | Where the placeholder shows | Data to fill |
|---|---|---|
| Imperial Partners Club | mega menu ("The houses online"), footer "Websites", Divisions page "Visit a house directly", Partners Club page hero, at-a-glance panel and closing band, comparison table "Online" row | `sites[partners-club].href`, `url`, `label`, `real: true`; `divisions[partners-club].cta.href`, `domain`, `real: true` |
| Imperial Private Office | the same places, on the Private Office page | `sites[private-office]` and `divisions[private-office].cta` as above |
| Imperial Academy | the same places, on the Academy page | `sites[academy]` and `divisions[academy].cta` as above |
| Imperial Real Estate (launches later) | mega menu and footer only (the Real Estate page registers interest instead) | `sites[real-estate]`; it can stay a placeholder until that division launches, or be hidden from both lists |

To close: fill each address (with `real: true`, and the domain as the label) or hide the link; then rebuild and check
that `grep -c 'data-tbc' dist/**/*.html` reports only the placeholders that remain on purpose. The production domain
of this site itself (`sites[ihg].url`) is marked to confirm as well.

## To confirm on the host after the first deploy (UX audit item 33)

The audit ran on a local test server, so three behaviours that belong to the host could not be confirmed. They are
listed with the checks in docs/PERFORMANCE.md section 10.

1. An unknown path such as `/no-such-page` answers with status 404 and the body of `404.html`.
2. HTML is served with a cacheable header (the `_headers` rule: `max-age=0, must-revalidate`), not `no-store`, so the
   back/forward cache can keep pages.
3. Text assets (HTML, CSS, JavaScript, JSON, SVG) are served compressed (Brotli or gzip).

## To confirm before launch

* **Form drafts and the privacy notice (UX audit item 31).** Drafts of what someone typed into a form stay on their
  device for 7 days and are then discarded (`readDraft()` and `saveDraft()` in app.js). The privacy notice already
  says that form drafts are stored on the device ("Analytics and cookies", third paragraph); to confirm whether it
  should also state the seven-day limit.
