import React from 'react'
import { useDispatch, connect } from 'react-redux'
import '../styles/style.scss'
import { setRegistrationAC } from 'src/Components/others/utilities/action'
import RegisterForm from 'src/Components/forms/registerForm/registerForm'
import { femaleAvatar } from 'src/Components/others/utilities/common'

interface IRegisterProps {
  setRegistrationAC: (data: any) => void;
}

const Register = ({ setRegistrationAC }: IRegisterProps) => {
  const dispatch = useDispatch()

  const onSubmitRegister = async (data: any) => {
    data.photoUrl = "https://i.ibb.co/nb8ftzH/foto.jpg"
    //data.photoUrl = femaleAvatar
    //data.photoUrl = null
    dispatch(setRegistrationAC({ data }))
  }
  const initialValues = {email: '',validationUrl: 'users/emailValidate'}

  return (
    <div className='bg-blue-200 max-w-4xl mt-4 mx-auto border-2 border-blue-600 rounded-lg overflow-hidden'>
      <RegisterForm onSubmit={onSubmitRegister} initialValues={initialValues}/>
    </div>
  )
}

// Register.getInitialProps = async (ctx: any) => {
//     await ctx.store.execSagaTasks(ctx, async (dispatch: any) => {
//         dispatch(getAllPostsAC());
//     });
// }

export default connect((state: any) => ({
  authUser: state.auth
}), { setRegistrationAC })(Register);
