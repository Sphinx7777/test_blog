import '../../styles/style.scss'
import Link from 'next/link'


export const GuestUser= () => {
	return (
        <div className='flex flex-wrap text-center justify-around border-b-2 border-white items-center' >
        <p>Only authorized users can add new entries</p>
        <Link href='/register'>
          <a className=' border-2 border-white rounded-lg px-2 m-1'>
            <p>Registration</p>
          </a>
        </Link>
      </div>
	)
}