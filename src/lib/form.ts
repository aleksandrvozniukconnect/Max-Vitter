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

const allowedFile = /\.(pdf|dwg|xls|xlsx)$/i

export function validateProjectForm(values: ProjectFormValues): ProjectFormErrors {
  const errors: ProjectFormErrors = {}

  if (!values.name.trim()) errors.name = 'Name is required.'
  if (!values.company.trim()) errors.company = 'Company is required.'
  if (!values.country.trim()) errors.country = 'Country is required.'
  if (!values.projectType.trim()) errors.projectType = 'Project type is required.'
  if (!values.timing.trim()) errors.timing = 'Timing is required.'

  const hasFiles = values.fileNames.length > 0
  const hasLink = values.cloudLink.trim().length > 0

  if (hasFiles) {
    const invalid = values.fileNames.filter((name) => !allowedFile.test(name))
    if (invalid.length > 0) {
      errors.files = 'Use PDF, DWG, or XLS — or a cloud link.'
    }
  }

  if (!hasFiles && !hasLink && !values.comment.trim()) {
    errors.comment = 'Add a short comment, a file, or a cloud link.'
  }

  return errors
}

export function isFormValid(values: ProjectFormValues): boolean {
  return Object.keys(validateProjectForm(values)).length === 0
}
