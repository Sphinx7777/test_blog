import Entity from 'src/Components/others/utilities/entity'
import { setIdentityAC } from '../others/utilities/action';
import { SubmissionError } from 'redux-form';


const submit = (values: any) => {
  if (values.validationUrl === 'users/emailValidate') {
    return Entity.fetch(values.validationUrl, { email: values.email })
      .then((response) => {
        if (!response.success) {
          throw { email: response.message }
        }
      })
  } else if (values.validationUrl === 'users/auth') {
    return Entity.fetch(values.validationUrl, { email: values.email, password: values.password })
      .then(response => {
        if (!response.success) {
          throw new SubmissionError({
            _error: response.message
          });
        }
        values.validationUrl === 'users/auth' && response.success && Entity.mContext.dispatch(setIdentityAC({ authUser: response.data }));
      })
  }
}

export default submit