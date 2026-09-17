export type ProjectFormValues = {
  name: string
  company: string
  country: string
  projectType: string
  timing: string
  comment: string
  cloudLink: string
  fileNames: string[]
}

export type ProjectFormErrors = Partial<Record<keyof ProjectFormValues | 'files', string>>

export type FormErrorMessages = {
  name: string
  company: string
  country: string
  projectType: string
  timing: string
  files: string
  comment: string
}

const allowedFile = /\.(pdf|dwg|xls|xlsx)$/i

export const defaultFormErrors: FormErrorMessages = {
  name: 'Name is required.',
  company: 'Company is required.',
  country: 'Country is required.',
  projectType: 'Project type is required.',
  timing: 'Timing is required.',
  files: 'Use PDF, DWG, or XLS — or a cloud link.',
  comment: 'Add a short comment, a file, or a cloud link.',
}

export function validateProjectForm(
  values: ProjectFormValues,
  messages: FormErrorMessages = defaultFormErrors,
): ProjectFormErrors {
  const errors: ProjectFormErrors = {}

  if (!values.name.trim()) errors.name = messages.name
  if (!values.company.trim()) errors.company = messages.company
  if (!values.country.trim()) errors.country = messages.country
  if (!values.projectType.trim()) errors.projectType = messages.projectType
  if (!values.timing.trim()) errors.timing = messages.timing

  const hasFiles = values.fileNames.length > 0
  const hasLink = values.cloudLink.trim().length > 0

  if (hasFiles) {
    const invalid = values.fileNames.filter((name) => !allowedFile.test(name))
    if (invalid.length > 0) {
      errors.files = messages.files
    }
  }

  if (!hasFiles && !hasLink && !values.comment.trim()) {
    errors.comment = messages.comment
  }

  return errors
}

export function isFormValid(
  values: ProjectFormValues,
  messages: FormErrorMessages = defaultFormErrors,
): boolean {
  return Object.keys(validateProjectForm(values, messages)).length === 0
}
