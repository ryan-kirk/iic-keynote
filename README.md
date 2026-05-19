# Iowa Co-op Keynote Deck

This repository contains the interactive web deck, chart assets, and PowerPoint export workflow for a keynote on how data and AI are changing Iowa agricultural co-ops.

## Current capabilities

- Interactive slide app with keyboard and on-screen navigation.
- Structured deck content in `src/content/deck.ts`, so the same source drives both the web presentation and the PowerPoint export.
- Data-story slides that distinguish real, proxy, and illustrative inputs.
- Scripted PowerPoint export with chart assets and speaker notes.
- Public deployment path for Fly.io with a hardened static runtime.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## PowerPoint export

```bash
npm run export:charts
npm run export:pptx
```

The export workflow writes SVG chart assets and a `.pptx` deck into `artifacts/powerpoint/`. See [docs/powerpoint-export.md](docs/powerpoint-export.md) for the mapping and manual polish notes.

## Fly deployment

The public deployment path uses Fly.io with a multi-stage Docker build and a hardened static nginx runtime.

```bash
flyctl config validate --strict
flyctl deploy
```

See [docs/fly-deployment.md](docs/fly-deployment.md) for the full first-deploy, verification, and rollback flow.

## References and content notes

- [REFERENCES.md](REFERENCES.md) tracks the data sources, supporting artifacts, and planned source upgrades.
- `KEYNOTE.md` remains the core narrative brief.
- `SLIDES.md` is the human-readable deck outline.
