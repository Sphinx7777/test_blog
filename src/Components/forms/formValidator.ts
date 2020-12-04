import validator from 'validator'

const registerFormValidator = (values: any) => {
const errors: any = {}

  if (!values.email) {
    errors.email = 'Required'
  } else if (values.email && !validator.isEmail(values.email)) {
    errors.email = 'Entered valid email please'
  }

  if (!values.password) {
    errors.password = 'Required'
  } else if (values.password && values.password.length < 6) {
    errors.password = 'Min length 6 characters'
  }

  if (!values.firstName) {
    errors.firstName = 'Required'
  } else if (values.firstName && values.firstName.length > 50) {
    errors.firstName = 'Max length 50 characters'
  }

  if (!values.lastName) {
    errors.lastName = 'Required'
  } else if (values.lastName && values.lastName.length > 50) {
    errors.lastName = 'Max length 50 characters'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Required'
  }

  if (values.confirmPassword && values.password && values.confirmPassword.length !== values.password.length || values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  if (!values.title) {
    errors.title = 'Required'
  } else if (values.title && values.title.length < 5) {
    errors.title = 'Min length 5 characters'
  } else if (values.title && values.title.length > 200) {
    errors.title = 'Max length 200 characters'
  }

  if (!values.description) {
    errors.description = 'Required'
  } else if (values.description && values.description.length > 1000) {
    errors.description = 'Max length 5000 characters'
  }
  
  return errors
}

export default registerFormValidator