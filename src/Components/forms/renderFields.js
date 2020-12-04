import { useState } from 'react'
import '../../styles/style.scss'

export const InputComponent = (
  { input, maxLength, minLength, label, type, meta: { asyncValidating, touched, error } }) => {

  const [showPassword, setShowPassword] = useState(false)
  const toggleShowPass = () => setShowPassword(!showPassword)
  showPassword && setTimeout(setShowPassword, 5000)

  return (
    <div className='mb-1 p-1 text-center '>
      <label><b>{label}</b></label>
      <div className='bg-white flex items-center '>
        <input
          {...input}
          type={!showPassword ? type : 'text'}
          maxLength={maxLength}
          minLength={minLength}
          placeholder={label}
          className='w-full p-2 '
        />
        {
          (input.name === 'password' || input.name === 'confirmPassword') && touched
          && <span className='mx-2 text-green-600' onClick={toggleShowPass} >
            <img src="/eye.png" alt="eye" title='' className='inline-block pr-2  cursor-pointer' />
          </span>
        }
        {input.name === 'email' && asyncValidating && <span className='mx-2 text-green-600' >O</span>}
        {input.name === 'email' && touched && !error && <img src="/checkmark.png" alt="ok" title='' className='px-2' />}
      </div>
      {
        touched && error ? <span className='text-red-600'>
          {error}
        </span>
          : <span className='opacity-0'>
            XXX
      </span>
      }
    </div>
  )
}

export const TextAreaComponent = ({ input, label, type, meta: { touched, error } }) => {
  function auto_grow(element) {
    element.target.style.height = "5px";
    element.target.style.height = (element.target.scrollHeight) + "px";
  }

  return (
    <div  >
      <label><b>{label}</b></label>
      <div className='flex flex-col mb-1'>
        <textarea {...input} onInput={auto_grow} type={type} placeholder={label} />
        {
          touched && error
            ? <span className='text-red-600' >{error}</span>
            : <span className='opacity-0'>
              XXX
        </span>
        }
      </div>
    </div>
  )
}