import { describe, expect, it } from 'vitest'
import { isFormValid, validateProjectForm, type ProjectFormValues } from './form'

const complete: ProjectFormValues = {
  name: 'Ana Koval',
  company: 'Studio North',
  country: 'UA',
  projectType: 'Hospitality',
  timing: 'This quarter',
  comment: 'Guest-room millwork, 40 keys.',
  cloudLink: '',
  fileNames: ['set.pdf'],
}

describe('validateProjectForm', () => {
  it('accepts a complete package', () => {
    expect(validateProjectForm(complete)).toEqual({})
    expect(isFormValid(complete)).toBe(true)
  })

  it('requires identity fields', () => {
    const errors = validateProjectForm({ ...complete, name: '', company: '' })
    expect(errors.name).toBeDefined()
    expect(errors.company).toBeDefined()
  })

  it('rejects files that are not PDF, DWG, or XLS', () => {
    const errors = validateProjectForm({ ...complete, fileNames: ['mood.png'] })
    expect(errors.files).toMatch(/PDF/)
  })

  it('allows a cloud link instead of a file', () => {
    expect(
      validateProjectForm({
        ...complete,
        fileNames: [],
        comment: '',
        cloudLink: 'https://drive.example/set',
      }),
    ).toEqual({})
  })
})
