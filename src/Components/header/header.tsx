import { useState } from 'react';
import { Map } from 'immutable';
import { setLogOutUserAC } from '../../Components/others/utilities/action';
import { useDispatch, connect } from 'react-redux'
import Menu from './menu';
import MobileMenu from './mobileMenu';
import Link from 'next/link';

interface IHeaderProps {
  authUser: Map<string, any>;
  setLogOutUserAC: (payload?: any) => void
}

const Header: React.FunctionComponent<IHeaderProps> = ({ authUser, setLogOutUserAC }) => {
  const dispatch = useDispatch()
  const [showMobile, setShowMobile] = useState(false)

  const toggleMobileMenu = () => setShowMobile(!showMobile)

  const logOutSubmit = async () => {
    const data = {
      userId: authUser.get('id'),
      password: authUser.get('id')
    }
    dispatch(setLogOutUserAC({ data }))
  }

  return (
    <div className=' bg-blue-500 text-white items-center px-2 z-20'  >
      <div className='flex flex-wrap justify-between  items-center text-center pb-1 sm:justify-around'>
        {
          authUser && authUser.get('role') === 'user'
            ? <div className='flex justify-between items-center w-full sm:justify-around'>
              <h1 className='hidden usm:inline-block text-2xl'>appBlog</h1>
              {
                <Link href={{ pathname: '/profile', query: { id: `${authUser.get('id')}` } }}>
                  <a className='font-normal'><b>{authUser.get('firstName')} {authUser.get('lastName')}</b>
                    <img src="/profiles.png" alt="back" title='back' className='px-1 inline' />
                  </a>
                </Link>
              }
              <img className='inline-block pl-20 cursor-pointer pr-1 sm:hidden'
                src="/menu.png"
                alt="author"
                title=''
                onClick={toggleMobileMenu}
              />
            </div>
            : <p>Unregister guest
              <img className='inline-block ml-5 cursor-pointer sm:hidden'
                src="/menu.png"
                alt="author"
                title=''
                onClick={toggleMobileMenu}
              />
            </p>
        }
      </div>
      <Menu logOutSubmit={logOutSubmit} authUser={authUser} />
      {showMobile && <MobileMenu logOutSubmit={logOutSubmit} authUser={authUser} />}
    </div>
  )
}

export default connect((state: any) => ({
  authUser: state.auth
}), { setLogOutUserAC })(Header);
