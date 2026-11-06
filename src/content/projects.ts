import type { SiteCopy } from '../i18n/en'
import { projectPhotos, type ProjectPhoto } from './projectPhotos'
import { featuredProjectKeys, projectCases, type ProjectKey } from './site'

export type ProjectChapter = {
  key: ProjectKey
  n: string
  /** Cover photo, the first of the case. */
  photo: string
  /** All photos of the case, cover first. */
  photos: readonly ProjectPhoto[]
  title: string
  shortTitle: string
  sector: string
  summary: string
  challenge: string
  result: string
  tags: readonly string[]
}

export function chaptersFrom(copy: SiteCopy): ProjectChapter[] {
  return projectCases.map((item) => {
    const text = copy.projects.items[item.key]
    const photos = projectPhotos[item.key]
    return {
      key: item.key,
      n: item.n,
      photo: photos[0].src,
      photos,
      title: text.title,
      shortTitle: text.shortTitle,
      sector: text.sector,
      summary: text.summary,
      challenge: text.challenge,
      result: text.result,
      tags: text.tags,
    }
  })
}

/** The cases shown on the home page. */
export function featuredChapters(chapters: readonly ProjectChapter[]): ProjectChapter[] {
  return featuredProjectKeys.flatMap((key) => chapters.filter((chapter) => chapter.key === key))
}
