import React from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import asyncValidate from '../asyncValidator'
import { InputComponent } from '../renderFields';
import '../../../styles/style.scss'
import formValidator from '../formValidator';
import Link from 'next/link';

interface IAuthFormProps {
  onSubmit?: () => {};
  initialValues?: Partial<FormData>;
}

const RegisterForm = (props: IAuthFormProps & InjectedFormProps) => {
  const { handleSubmit, pristine, reset, submitting, onSubmit, submitSucceeded } = props

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col text-center'>
      <Field
        name="firstName"
        type="text"
        component={InputComponent}
        label="First name"
        maxLength="50"
      />
      <Field
        name="lastName"
        type="text"
        component={InputComponent}
        label="Last name"
        maxLength="50"
      />
      <Field
        name="email"
        type="email"
        component={InputComponent}
        label="Email"
        maxLength="100"
      />
      <Field
        name="password"
        type="password"
        component={InputComponent}
        label="Password"
        maxLength="100"
      />
      <Field
        name="confirmPassword"
        type="password"
        component={InputComponent}
        maxLength="100"
        label="Password confirmation"
      />
      <Field
        name="validationUrl"
        type="hidden"
        component={InputComponent}
      />
      {
        submitSucceeded && <div className='text-green-600 mb-2 border-b-2 rounded-lg'>
          <b>You have successfully registered! Now you should be able to log in.</b></div>
      }
      <div className='flex justify-around text-center flex-wrap mb-5' >
        <div>
          <button className=' border-solid border-white border-2 rounded-lg px-1 '
            type="submit"
            disabled={submitting}>
            Sign Up
            <img src="/upload.png" alt="back" title='back' className='px-1 inline max-w-1' />
          </button>
          <button className=' border-solid border-white border-2 rounded-lg ml-5 px-1'
            type="button"
            disabled={pristine || submitting} onClick={reset}>
            Clear
            <img src="/broom.png" alt="back" title='back' className='px-1 inline max-w-1' />
          </button>
        </div>
        <Link href='/authorization'>
          <a className='border-2 border-white rounded-lg px-1'>
            Sign in <img src="/reply.png" alt="Authorization" title='Authorization' className='inline' />
          </a>
        </Link>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'registerForm',
  validate: formValidator,
  asyncValidate,
  asyncBlurFields: ['email']
})(RegisterForm)