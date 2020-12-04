import { connect } from 'react-redux'
import '../styles/style.scss'
import AuthForm from 'src/Components/forms/authForm/authForm'
import {useRouter} from 'next/router'


const Authorization = () => {
    const router = useRouter()
    const email = router.query.email
    const initialValues = {email,validationUrl: 'users/auth'}

return (
        <>
            <AuthForm {...{initialValues}}/>
        </>
    )
}

// AuthorizedForm.getInitialProps = async (ctx: any) => {
//     await ctx.store.execSagaTasks(ctx, async (dispatch: any) => {
//         
//     });
// }

export default connect((state: any) => ({
    authUser: state.auth
}), { })(Authorization);
