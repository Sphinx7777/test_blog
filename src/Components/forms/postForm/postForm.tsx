import React from 'react';
import { Field, reduxForm, InjectedFormProps, Form, ConfigProps } from 'redux-form';
import { InputComponent, TextAreaComponent } from '../renderFields';
import '../../../styles/style.scss';
import formValidator from '../formValidator';

interface IPostFormProps {
  toggleShowForm?: any;
  onSubmit?: () => void;
  initialValues?: Partial<FormData>;
}


const PostForm = (props: IPostFormProps & InjectedFormProps) => {
  const { error, handleSubmit, pristine, reset, toggleShowForm, submitting, onSubmit, submitSucceeded } = props;

  submitSucceeded && setTimeout(reset, 0)

  if (toggleShowForm) {
    submitSucceeded && toggleShowForm()
  }

  return (
    <div className="bg-blue-200 max-w-4xl z-20 fixed top-1 right-0 left-0 mx-auto border-2 border-blue-600 rounded-lg overflow-hidden p-2 my-5 xl:w-1/2 ">
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col text-center">
        <Field
          name="title"
          type="text"
          component={InputComponent}
          label="Title"
          maxLength="200"
          minLength='5'
        />
        <Field
          name="description"
          type="text"
          component={TextAreaComponent}
          label="Description"
          maxLength="5000"
        />
        {
        error && <strong className="text-red-600 mb-2 border-b-2 border-red-600 rounded-lg"><b>{error}</b></strong>
        }
        <div className='flex text-center flex-wrap'>
          <button
            className=" border-solid border-white border-2 rounded-lg px-1 focus:border-transparent"
            type="submit"
            disabled={submitting}
          >
            Sign Up
            <img src="/upload.png" alt="back" title='back' className='px-1 inline max-w-1' />
          </button>
          <button
            className=" border-solid border-white border-2 rounded-lg ml-5 px-1 focus:border-transparent"
            type="button"
            disabled={pristine || submitting}
            onClick={reset}
          >
            Clear
            <img src="/broom.png" alt="back" title='back' className='px-1 inline max-w-1' />
          </button>
        </div>
      </Form>
    </div>
  );
};

export default reduxForm({
  form: 'postForm',
  validate: formValidator,
})(PostForm);
