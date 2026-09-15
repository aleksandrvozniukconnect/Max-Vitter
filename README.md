# Design Choice — B2B millwork production partner

Single-page site in the register of [foliot.com/how-we-work](https://www.foliot.com/how-we-work): one partner, six steps, stacked cards on paper, a black CTA panel. Copy, logo and structure are Design Choice.

## Structure (one owner per fact, nothing repeated)

1. Hero — positioning, two calls
2. Who we work with — four audiences
3. How we work — six steps; the three gates (Approved for Production, QC Approved, Approved for Shipment) are stamps inside steps 3, 4 and 5; each step names what the client receives
4. Made in our own plant
5. Capabilities — four tiles
6. Projects — three cases (placeholders until the client releases photos)
7. On the ground — UA / US / ME, one person per market; the header globe and these cards drive the same market overlay
8. Closing CTA
9. Send your project — UI-only intake, files and cloud link
10. Footer

Content lives in `src/content/site.ts`. Tests in `src/content/site.test.ts` pin the structure: six steps, three gates in order, four audiences, four capabilities, three projects, no unverified numbers.

## Brand

From the DSGN Choice logo guideline: black `#111318`, white `#FCFBFA`, Oswald for display, Mulish for text. Logos in `public/brand/`. Paper `#EEE7E1` and a brass accent for stamps come from the Foliot-style direction.

## Run

```bash
npm install
npm run dev
npm run test
npm run build
```

## Not in this version

CMS, live upload, UK translation, real photography, the full 15-stage path (kept off the home page on purpose).
