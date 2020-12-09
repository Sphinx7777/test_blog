import React from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import asyncValidate from '../asyncValidator'
import { InputComponent } from '../renderFields';
import '../../../styles/style.scss'
import formValidator from '../formValidator';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { Checkbox, ListItemText } from '@material-ui/core';

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
        name="datePicker"
        type="text"
        component={picker}
        label="Date Picker"
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

const picker = () => {
  const [selectedDate, setSelectedDate] = React.useState(new Date().toLocaleDateString());
  const handleDateChange = (date: any) => {
      setSelectedDate(date);
  };
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <Grid container justify="space-around">
        <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Date picker dialog"
            format="MM/dd/yyyy"
            name='datePicker'
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
        />
    </Grid>
</MuiPickersUtilsProvider>
  )
}