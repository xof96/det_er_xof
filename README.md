# Personal Atlas

A personal portfolio built as a **spatial atlas** rather than a landing page.
The home screen *is* the navigator: a cinematic carousel of cards, each one a
different part of a life — software, AI, photography, skating, languages, music,
places, story, CV and contact. Selecting a card re-colours the entire page and
opens that section by expanding the card into it.

> Concept: **an atlas of the things I do, make, study and enjoy** — photography-first,
> immersive, spatial, and designed to grow for years without a redesign.

---

## Table of contents

- [Concept & visual language](#concept--visual-language)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Repository structure](#repository-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Editing content](#editing-content)
  - [Add a project / case study](#add-a-project--case-study)
  - [Add photographs](#add-photographs)
  - [Feature GitHub repositories](#feature-github-repositories)
  - [Add a whole new section](#add-a-whole-new-section)
- [API](#api)
- [Testing](#testing)
- [Building for production](#building-for-production)
- [Deployment](#deployment)
- [Accessibility & performance](#accessibility--performance)

---

## Concept & visual language

The design reinterprets three references into one identity:

| Reference | What was taken |
| --- | --- |
| **Istanbul Explorer** (home) | Spatial card carousel — one dominant central card, receding side cards, gentle 3D depth, clean UI, a `01 / 10` counter and a discreet control dock. |
| **Patagonia Express** (atmosphere) | The active selection **re-grades the whole scene**; a full-screen atmospheric background crossfades beneath the cards. |
| **Portal / "Teleport" videos** (transitions) | A framing element through which the world transforms — the basis for the card → page expand transition. |

Nothing is copied literally: no browser chrome, no travel stats, no borrowed
iconography. See [`docs`](#) inline comments in `frontend/src` for specifics.

The design system lives in **`frontend/src/styles/tokens.css`** — spacing,
fluid type scale, radii, shadows, blur, motion timings, the carousel depth
system and the reactive-atmosphere custom properties.

## Architecture

**Data-driven and single-sourced.** All content lives once in the repo-root
[`content/`](content/) directory as JSON. Both the React SPA (via a Vite alias)
and the FastAPI backend read the *same* files, so they can never drift.

```
content/*.json  ──►  frontend (imported at build)   the SPA renders from this
                └─►  backend  (served via the API)  /api/sections, /api/projects…
```

- One `SectionCarousel` + `SectionCard` + `BackgroundScene` render **all ten**
  sections. Adding, removing or reordering a section is a JSON edit.
- The reactive background is driven by an `AtmosphereContext` that pushes
  `--accent` / `--atmos-*` CSS variables onto `:root` and crossfades layers.
- The card → section transition captures the active card's rect and expands it
  to full screen before navigating (skipped under reduced motion).

## Tech stack

**Frontend:** React 18 · JavaScript · Vite · React Router · Framer Motion ·
modern CSS with CSS Modules. Tested with Vitest + Testing Library and Playwright.

**Backend:** Python 3.12 · FastAPI · Pydantic v2 · httpx · SQLAlchemy + SQLite ·
pytest. Documented automatically via OpenAPI.

No TypeScript, no Next.js, no heavy CSS framework, no WebGL — by design.

## Repository structure

```
det_er_xof/
├── content/                 # ← single source of truth (edit this)
│   ├── sections.json        #   the 10 sections + their atmospheres
│   ├── projects.json        #   projects & case studies
│   ├── ai-lab.json, photography.json, skating.json, languages.json,
│   ├── music.json, places.json, about.json, cv.json, contact.json
│   └── github.json          #   curated repos to feature
├── frontend/
│   ├── src/
│   │   ├── components/       # carousel, background, media, contact, github, layout, ui
│   │   ├── context/          # AtmosphereContext (reactive background)
│   │   ├── pages/            # Home + one page per section + ProjectDetail
│   │   ├── lib/              # content loader, api client, hooks
│   │   └── styles/           # tokens.css (design system) + global.css
│   ├── e2e/                  # Playwright specs
│   ├── public/              # static assets, favicon, cv/cv.pdf
│   ├── Dockerfile · nginx.conf
│   └── vite.config.js · playwright.config.js
├── backend/
│   ├── app/
│   │   ├── routers/          # health, sections, projects, github, photography, contact
│   │   ├── services/         # github (cached), email (SMTP), ratelimit
│   │   ├── config.py · db.py · models.py · schemas.py · content.py · main.py
│   ├── tests/
│   └── Dockerfile · requirements*.txt · pyproject.toml
├── assets/                   # your media + guide
├── docker-compose.yml
├── .env.example
└── README.md
```

## Getting started

Prerequisites: **Node 18+** and **Python 3.12+** on your `PATH`
(`node --version`, `python --version`). Run the backend and the frontend in
**two separate terminals**. The `.venv`, `node_modules` and the SQLite database
are not committed, so a fresh clone builds them on first run.

### Linux / macOS

**Terminal 1 — backend** (API on port 8000):

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — frontend** (dev server on port 5173):

```bash
cd frontend
npm install
npm run dev
```

### Windows

Use **PowerShell** (adjust the activate line for cmd — see the note below).

**Terminal 1 — backend** (API on port 8000):

```powershell
cd backend
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — frontend** (dev server on port 5173):

```powershell
cd frontend
npm install
npm run dev
```

Windows notes:

- In **cmd** activate the venv with `.\.venv\Scripts\activate.bat` instead of the
  PowerShell script.
- If PowerShell blocks the activate script, allow it once for your user:
  `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`.
- If `py` is not found, use `python -m venv .venv` (the standard installer adds
  `python`).

### Then, on any OS

- Frontend: <http://localhost:5173>
- API docs (OpenAPI / Swagger): <http://localhost:8000/docs>

The dev server proxies `/api` to the backend on port 8000, so run both for the
GitHub strip and the contact form to work. To see only the design, the frontend
alone is enough (those two features fail silently, by design).

### Or with Docker (any OS)

```bash
docker compose up --build
```

Then open <http://localhost:8080> (nginx serves the SPA and proxies `/api` to the
backend). This needs no local Node or Python.

## Environment variables

Copy `.env.example` to `.env` and fill in what you need. Everything is optional
for local development. Highlights:

| Variable | Purpose |
| --- | --- |
| `GITHUB_USERNAME`, `GITHUB_TOKEN` | Enrich curated repos; token only raises rate limits (public repos work without one). |
| `CONTACT_EMAIL`, `SMTP_*` | Enable emailing contact messages. Without them, messages are still validated and stored in SQLite. |
| `CONTACT_RATE_LIMIT`, `CONTACT_RATE_WINDOW`, `CONTACT_MIN_ELAPSED_MS` | Anti-spam tuning. |
| `CORS_ORIGINS` | Allowed frontend origins. |
| `VITE_API_URL` | Frontend's API base (build-time). `/api` for same-origin; a full URL for a split deployment. |

**Secrets never reach the browser** — tokens and SMTP credentials are read only
by the backend.

## Editing content

All personal content is plain JSON in `content/`. Placeholder text is prefixed
with `__EDITABLE__`; the UI renders it in a muted style with an "editable" badge
so you can see exactly what still needs your words — there is no Lorem Ipsum.

### Add a project / case study

Edit [`content/projects.json`](content/projects.json). Each project supports a
full case study (`context`, `problem`, `idea`, `solution`, `goals`, `decisions`,
`architecture`, `challenges`, `learnings`, `tech`, `links`, `screenshots`). Set
`"featured": true` to surface it as a case study on the Projects page.

### Add photographs

Edit [`content/photography.json`](content/photography.json). Put images in
`frontend/public/…` and set each frame's `src` (see [`assets/README.md`](assets/README.md)).
Until then, elegant gradient placeholders render in their place.

### Feature GitHub repositories

List repositories as `"owner/name"` in
[`content/github.json`](content/github.json). The backend fetches live data
(stars, forks, language, topics, last update), caches it (`GITHUB_CACHE_TTL`),
and the Projects page shows them. An empty list simply hides the strip.

### Add a whole new section

1. Add an object to [`content/sections.json`](content/sections.json) (`id`,
   `index`, `slug`, `route`, `title`, `kicker`, `subtitle`, `summary`,
   `atmosphere`). The carousel and reactive background pick it up automatically.
2. Add a content file `content/<slug>.json` and wire it in
   `frontend/src/lib/content.js` (`getSectionData`).
3. Create `frontend/src/pages/<Name>.jsx` (reuse `PageShell`) and register its
   route in `frontend/src/App.jsx`.

## API

Interactive docs at `/docs`; schema at `/openapi.json`.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service health. |
| `GET` | `/api/sections` | The ordered sections. |
| `GET` | `/api/projects` | All projects. |
| `GET` | `/api/projects/{slug}` | One project / case study. |
| `GET` | `/api/github/repos` | Curated GitHub repos (cached). |
| `GET` | `/api/photography` | Photography collections. |
| `GET` | `/api/photography/{collection}` | One collection. |
| `POST` | `/api/contact` | Validated, rate-limited contact submission (stored in SQLite; optional email). |

## Testing

```bash
# Backend (14 tests: endpoints, validation, GitHub service w/ mocks, contact)
cd backend && source .venv/bin/activate && pytest

# Frontend unit/interaction (Vitest + Testing Library)
cd frontend && npm run test

# End-to-end flows (Playwright)
cd frontend && npm run test:e2e:install   # one-time browser download
npm run test:e2e
```

E2E covers the core journeys: home → open a section → back; Projects → Redactame
case study → back; Photography → open the lightbox → navigate; Contact →
validation → send; and a reduced-motion run of the carousel.

## Building for production

```bash
cd frontend && npm run build      # → frontend/dist (code-split, hashed assets)
```

The backend runs under any ASGI server, e.g.
`uvicorn app.main:app --host 0.0.0.0 --port 8000`.

## Deployment

The frontend is a static bundle and the backend is a small ASGI service, so many
setups work. One straightforward split:

- **Frontend** → any static host / CDN (Netlify, Vercel static, Cloudflare
  Pages, S3+CloudFront). Build with `VITE_API_URL` pointing at your API origin.
- **Backend** → any container host (Fly.io, Render, Railway, a VM). Set
  `CORS_ORIGINS` to the frontend origin; persist the SQLite volume (or point
  `DATABASE_URL` at managed Postgres).

Or deploy the bundled `docker-compose.yml` (nginx + backend, same origin) to a
single host — no CORS needed because nginx proxies `/api`.

## Accessibility & performance

- Semantic HTML, keyboard navigation (arrows/Home/End/Enter on the carousel,
  full keyboard control of the lightbox and forms), visible focus, ARIA only
  where it earns its place, alt text, and a skip link.
- **`prefers-reduced-motion`** is honoured throughout: 3D, parallax and large
  transitions collapse to instant, functional equivalents.
- Route-level code splitting, lazy-loaded images with gradient placeholders (no
  layout shift), transform/opacity-only animation, and a font loaded with
  `display=swap`.
