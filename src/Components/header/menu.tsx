import * as React from 'react';
import Link from 'next/link'
import { Map } from 'immutable';

interface IMenuProps {
  authUser: Map<string, any>;
  logOutSubmit: () => void
}

const Menu: React.FunctionComponent<IMenuProps> = ({ authUser, logOutSubmit}) => {

  return (

    <div className='hidden sm:flex flex-wrap justify-between items-center'>
      <div className='flex flex-wrap  items-center p-1'>
        {/* <Link href="/">
          <a className='border-2 border-white rounded-lg px-1 mr-2'>Main</a>
        </Link> */}
        <Link href="/posts">
          <a className='border-2 border-white rounded-lg px-1'>Test google and asana sheet</a>
        </Link>
      </div>
      <div className='flex flex-wrap items-center p-1'>
        {
          authUser && authUser.get('id')
            ? <button className='flex item-center border-2 border-white rounded-lg px-2'
              onClick={logOutSubmit} >
              logOut
              <img src="/reply.png" alt="logOut" title='logOut' className='pl-1' />
            </button>
            :
            <div className='flex flex-wrap items-center p-1'>
              {/* <Link href='/register'>
                <a className='border-2 border-white rounded-lg px-2 ml-2'>
                  <p>Registration</p>
                </a>
              </Link>
              <Link href='/authorization'>
                <a className='border-2 border-white rounded-lg px-2 ml-2'>
                  <p>Sign in</p>
                </a>
              </Link> */}
            </div>
        }
      </div>
    </div>
  )
}

export default Menu;
