# Assets

Drop your own media here (photographs, project screenshots, skating clips, album
art, a CV PDF) and reference them from the content JSON in `../content/`.

## How images are wired

Every visual in the content files is described by a small object:

```json
{ "kind": "gradient", "from": "#243b63", "to": "#0a1120", "accent": "#8fb8ff", "src": null }
```

- While `src` is `null`, the UI renders the **gradient placeholder** and shows a
  small "replace image" badge — no broken images, no fake photos.
- Set `src` to a URL the frontend can load and the real image fades in over the
  placeholder (lazy-loaded, no layout shift).

## Recommended workflow

1. Put optimised images in `frontend/public/` (e.g. `frontend/public/photos/…`).
   Anything in `public/` is served from the site root, so a file at
   `frontend/public/photos/road.jpg` is referenced as `"/photos/road.jpg"`.
2. Point the relevant `src` in `content/*.json` at that path.
3. Prefer modern formats (`.webp`/`.avif`) and reasonable dimensions
   (long edge ~2000px) for performance.

## CV PDF

Replace `frontend/public/cv/cv.pdf` with your real CV. The path is configured in
`content/cv.json` (`"pdf": "/cv/cv.pdf"`).

> Reference screenshots of other people's designs (Istanbul Explorer, Patagonia
> Express, etc.) are **study material only** and must not be published as
> portfolio content.
