import * as React from 'react';
import Link from 'next/link'
import { Map } from 'immutable';

interface IMobileMenuProps {
  authUser: Map<string, any>;
  logOutSubmit: () => void
}

const MobileMenu: React.FunctionComponent<IMobileMenuProps> = ({ authUser, logOutSubmit }) => {

  return (

    <div className='z-20 text-black text-center  bg-white border-2 border-black flex-col absolute top-2 right-0 rounded-lg sm:hidden '>
      <div className='flex flex-wrap flex-col mb-2'>
        {/* <Link href="/">
          <a className='border-b-2 border-black rounded-lg mb-2 p-2'>Main</a>
        </Link> */}
        <Link href="/posts">
          <a className='border-b-2 border-black rounded-lg p-2'>Test google and asana sheet</a>
        </Link>
      </div>
      {/* <div className='flex flex-wrap'>
        {
          authUser && authUser.get('role') === 'user'
            ?
            <div className='flex flex-wrap flex-col mb-2'>
              <button className='flex item-center border-b-2 border-black rounded-lg p-2'
                onClick={logOutSubmit} >
                logOut
              <img src="/reply.png" alt="logOut" title='logOut' className='ml-2 z-10' />
              </button>
              <Link href='/profile'>
                <a className='p-2'>
                  <p>Profile</p>
                </a>
              </Link>
            </div>
            : <div className='flex flex-col'>
              <Link href='/register'>
                <a className='border-b-2 border-black rounded-lg p-2'>
                  <p>Registration</p>
                </a>
              </Link>
              <Link href='/authorization'>
                <a className='p-2'>
                  <p> Authorization</p>
                </a>
              </Link>
            </div>
        }
      </div> */}
    </div>
  )
}

export default MobileMenu;
