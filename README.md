# Design Choice

Commercial website for **Design Choice** — a Ukrainian B2B millwork and custom joinery production partner for designers, architects, developers, and general contractors.

This rebuild replaces the old Woodhouse static page. Visual language follows Foliot Furniture’s how-we-work page (whitespace, Poppins-scale type, beige process cards, sticky header, fade reveals, black CTA panel). Information architecture follows the Design Choice Foliot×Kettal prototype: one tree, UA / US / ME overlay.

## Preview

```bash
npm install
npm run dev
```

Open the printed local URL (Vite defaults to `http://localhost:5173`).

```bash
npm run test
npm run build
npm run preview
```

## Page structure

Single-page spine, in this order:

1. **Sticky header** — Design Choice mark, anchors to How we work / Journey / Send project, UA·US·ME market control, Send CTA, mobile menu
2. **Hero** — “One partner. Every stage. One accountable result.” plus cinematic media
3. **How we work** (`#how`) — beige band, Foliot-style stacked cards: Consult → Design → Confirm → Manufacture → Deliver → Support
4. **Visual direction** — Kettal-like mosaic (“Material. Geometry. Sequence.” / “From first line to final detail.”), quiet capabilities and two Challenge→Result cases
5. **Journey** (`#journey`) — 7 chapters with 3 gates: Understand → Define → **Approved for Production** → Make → Verify → **QC Approved** → Deliver → **Approved for Shipment** → Complete → Improve
6. **Closing CTA** — “Your concept. Our responsibility for delivery.”
7. **Send your project** (`#start`) — UI-only intake (PDF / DWG / XLS / cloud link) and footer

## Stack

Vite + React + TypeScript, CSS modules, Framer Motion (respects `prefers-reduced-motion`). Placeholder photography lives in `public/images` and is labeled as temporary.

## Out of scope (this version)

CMS, live file upload, Presenter offline mode, frame-scrubbed plant video.
