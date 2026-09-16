import { en, type SiteCopy } from './en'
import { ru } from './ru'
import { uk } from './uk'
import type { LocaleId } from './locale'

export type { SiteCopy }

export const dictionaries: Record<LocaleId, SiteCopy> = { en, uk, ru }
