// Photos for the project cases, resized to at most 1600 px (public/images/projects/<case>/).
// Only sharp frames of at least 960 px on the short side are published; the first photo is the cover.
export type ProjectPhoto = { src: string; width: number; height: number }

export const projectPhotos = {
  house: [
    { src: '/images/projects/house/01.webp', width: 1600, height: 1200 },
    { src: '/images/projects/house/02.webp', width: 1200, height: 1600 },
    { src: '/images/projects/house/03.webp', width: 1200, height: 1600 },
    { src: '/images/projects/house/04.webp', width: 1200, height: 1600 },
    { src: '/images/projects/house/05.webp', width: 1200, height: 1600 },
    { src: '/images/projects/house/06.webp', width: 1200, height: 1600 },
    { src: '/images/projects/house/07.webp', width: 1200, height: 1600 },
    { src: '/images/projects/house/08.webp', width: 1200, height: 1600 },
    { src: '/images/projects/house/09.webp', width: 1200, height: 1600 },
    { src: '/images/projects/house/10.webp', width: 1200, height: 1600 },
    { src: '/images/projects/house/11.webp', width: 1200, height: 1600 },
    { src: '/images/projects/house/12.webp', width: 1200, height: 1600 },
  ],
  restaurant: [
    { src: '/images/projects/restaurant/03.webp', width: 1200, height: 1600 },
    { src: '/images/projects/restaurant/01.webp', width: 1200, height: 1600 },
    { src: '/images/projects/restaurant/02.webp', width: 1200, height: 1600 },
    { src: '/images/projects/restaurant/04.webp', width: 1200, height: 1600 },
    { src: '/images/projects/restaurant/05.webp', width: 1200, height: 1600 },
    { src: '/images/projects/restaurant/06.webp', width: 1200, height: 1600 },
    { src: '/images/projects/restaurant/07.webp', width: 1200, height: 1600 },
    { src: '/images/projects/restaurant/08.webp', width: 1200, height: 1600 },
  ],
  apartment: [
    { src: '/images/projects/apartment/01.webp', width: 960, height: 1280 },
    { src: '/images/projects/apartment/02.webp', width: 960, height: 1280 },
    { src: '/images/projects/apartment/03.webp', width: 960, height: 1280 },
    { src: '/images/projects/apartment/04.webp', width: 960, height: 1280 },
    { src: '/images/projects/apartment/05.webp', width: 960, height: 1280 },
    { src: '/images/projects/apartment/06.webp', width: 960, height: 1280 },
    { src: '/images/projects/apartment/07.webp', width: 960, height: 1280 },
    { src: '/images/projects/apartment/08.webp', width: 960, height: 1280 },
    { src: '/images/projects/apartment/09.webp', width: 960, height: 1280 },
    { src: '/images/projects/apartment/10.webp', width: 960, height: 1280 },
    { src: '/images/projects/apartment/11.webp', width: 960, height: 1280 },
  ],
  sculpture: [
    { src: '/images/projects/sculpture/01.webp', width: 900, height: 1600 },
    { src: '/images/projects/sculpture/02.webp', width: 900, height: 1600 },
    { src: '/images/projects/sculpture/03.webp', width: 900, height: 1600 },
    { src: '/images/projects/sculpture/04.webp', width: 900, height: 1600 },
    { src: '/images/projects/sculpture/05.webp', width: 900, height: 1600 },
  ],
  ceiling: [
    { src: '/images/projects/ceiling/01.webp', width: 960, height: 1280 },
    { src: '/images/projects/ceiling/02.webp', width: 960, height: 1280 },
    { src: '/images/projects/ceiling/03.webp', width: 960, height: 1280 },
  ],
} as const satisfies Record<string, readonly ProjectPhoto[]>
