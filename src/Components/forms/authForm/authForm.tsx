import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { InputComponent } from '../renderFields';
import '../../../styles/style.scss';
import submit from '../asyncValidator';
import Link from 'next/link';
import Router from 'next/router';
import { myPromise } from 'src/Components/others/utilities/common';
import formValidator from '../formValidator';


interface IAuthFormProps {
initialValues?: Partial<FormData>;
}

const AuthForm = (props: IAuthFormProps & InjectedFormProps) => {
  const { error, handleSubmit, pristine, reset, submitting, submitSucceeded } = props;

  submitSucceeded && myPromise(1000).then((res) => Router.replace('/posts'));

  return (
    <div className="bg-blue-200 max-w-4xl mt-4 mx-auto border-2 border-blue-600 rounded-lg overflow-hidden p-5">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col text-center">
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
          name="validationUrl"
          type="hidden"
          component={InputComponent}
        />
        {error && <strong className="text-red-600 mb-2 border-b-2 border-red-600 rounded-lg"><b>{error}</b></strong>}
        {
          submitSucceeded && (
            <div className="text-green-600 mb-2 border-b-2 border-green-600 rounded-lg">
              <b>You are authorized! Welcome.</b>
            </div>)
        }
        <div className='flex justify-around text-center flex-wrap mb-5'>
          <div>
            <button
              className=" border-solid border-white border-2 rounded-lg px-1 "
              type="submit"
              disabled={submitting}
            >
              Sign Up
              <img src="/upload.png" alt="back" title='back' className='px-1 inline max-w-1' />
            </button>
            <button
              className=" border-solid border-white border-2 rounded-lg ml-5 px-1"
              type="button"
              disabled={pristine || submitting}
              onClick={reset}
            >
              Clear
              <img src="/broom.png" alt="back" title='back' className='px-1 inline max-w-1' />
            </button>
          </div>
          <Link href="/register">
            <a className="border-2 border-white rounded-lg px-1">
              <span>Registration</span>  <img src="/reply.png" alt="registration" title='registration' className='inline' />
            </a>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default reduxForm({
    form: 'authForm',
    validate: formValidator,
  })(AuthForm);
