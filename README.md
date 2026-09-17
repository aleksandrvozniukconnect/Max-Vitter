# Design Choice — B2B millwork production partner

**[Live preview](https://max-vitter-git-cursor-i18n-f27e02-aleksandrvozniukconnect-9664.vercel.app)**

Single-page site in the register of [foliot.com/how-we-work](https://www.foliot.com/how-we-work): one partner, six steps, stacked cards on paper, a black CTA panel. Copy, logo and structure are Design Choice.

## Structure (one owner per fact, nothing repeated)

1. Hero — positioning, two calls
2. Who we work with — four audiences
3. How we work — six steps; the three gates (Approved for Production, QC Approved, Approved for Shipment) are stamps inside steps 3, 4 and 5; each step names what the client receives
4. Made in our own plant
5. Capabilities — four tiles
6. Projects — three cases (placeholders until the client releases photos)
7. On the ground — UA / US / ME, one person per market (static contact cards)
8. Closing CTA
9. Send your project — UI-only intake, files and cloud link
10. Footer

Structure lives in `src/content/site.ts`. UI copy lives in `src/i18n/` (`en`, `uk`, `ru`). Tests in `src/content/site.test.ts` and `src/i18n/locale.test.ts` pin the structure: six steps, three gates in order, four audiences, four capabilities, three projects, no unverified numbers, and a complete EN / UK / RU dictionary.

## Languages

The sticky header has an **EN · UK · RU** switcher. UK is Ukrainian (`uk`), not United Kingdom. Market contacts live in On the ground, not in the header.

Default is English. A chosen language is saved in `localStorage` (`design-choice-lang`) and restored on reload. You can also open the page with `?lang=uk`, `?lang=ru` or `?lang=en` (query wins over the saved choice). Footer language links do the same switch.

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

CMS, live upload, real photography, the full 15-stage path (kept off the home page on purpose).
