import type { SiteCopy } from '../i18n/en'
import { photos, projectCases, type ProjectKey } from './site'

export type ProjectChapter = {
  key: ProjectKey
  n: string
  market: (typeof projectCases)[number]['market']
  photo: string
  marketLabel: string
  title: string
  shortTitle: string
  sector: string
  challenge: string
  result: string
  tags: readonly string[]
  placeholder: string
}

export function chaptersFrom(copy: SiteCopy): ProjectChapter[] {
  return projectCases.map((item, index) => {
    const text = copy.projects.items[item.key]
    return {
      key: item.key,
      n: item.n,
      market: item.market,
      photo: photos.projects[index] ?? photos.projects[0],
      marketLabel: copy.markets[item.market].label,
      title: text.title,
      shortTitle: text.shortTitle,
      sector: text.sector,
      challenge: text.challenge,
      result: text.result,
      tags: text.tags,
      placeholder: text.placeholder,
    }
  })
}
