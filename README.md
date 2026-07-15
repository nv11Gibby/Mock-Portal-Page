# Imperial Partner Portal — Mock

A self-contained, front-end-only mock of a partner portal for presentation. No
backend, no build step, no network calls — it runs straight from the filesystem.

## Run locally

Open `index.html` in any modern browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Sign in with **any** email and password, or click **Fill Demo Credentials**.
The session is remembered via `localStorage`; use **Sign Out** to reset.

## Structure

```
index.html          Markup for the login screen and all portal pages
assets/styles.css    Consolidated stylesheet (design tokens + components)
assets/app.js        View switching, service catalogue, mock charts
assets/ipc-logo.svg  Brand emblem (inline SVG — no binary asset required)
```

## Notes

- The only external dependency is Google Fonts (Cormorant / Montserrat). If
  opened fully offline the layout still works with system serif/sans fallbacks.
- All data is illustrative and lives in `assets/app.js`.
