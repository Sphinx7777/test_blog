import '../../styles/style.scss'
import { IPostProps } from '../../pages/posts'
import { blankAvatar } from '../others/utilities/common'
import Link from 'next/link'
import { getDate } from '../others/utilities/common';



export const OnePost = ({ authUser, users, post, author }: IPostProps) => {
  const authorPhoto = users.get(post.get('authorId')).get('photoUrl')
  const lastDateOfActive = users.get(post.get('authorId')).get('lastDateOfActive')

  

  return (

    <Link href={{ pathname: `/view`, query: { id: post.get('id') } }} >
      <a className=''>
        <div className='block md:w-1/2 md:inline-block text-left border-2 border-white py-10 mt-10 px-5 cursor-pointer relative' >
          {
            (authUser && authUser.get('id') === post.get('authorId')) &&
            <p className='text-green-600 absolute top-0 right-0'>
              <span className='hidden sm:inline-block pr-1'>You are the author</span>
              <img src="/read.png" alt="author" title='author' className='inline-block mx-1' />
            </p>
          }
          <div className='flex flex-wrap justify-between ' >
            <div className=' w-4/5'>
              <h2 className='truncate'> <b> {post.get('title')}</b></h2>
              <div className='flex flex-wrap break-words border-b-2 border-black rounded-lg px-1 mb-2'>
                <span className='pr-1'><b>Author: </b></span>{author(post)}
              </div>
              <div className='flex flex-wrap border-b-2 border-black rounded-lg px-1 mb-2'>
                <span className='pr-1'><b>Created post : </b></span>
                <span className='break-words'>{getDate(post.get('createdDate'))}</span>
              </div>
              <div className='flex flex-wrap border-b-2 border-black rounded-lg px-1'>
                <span className='pr-1'><b>Last date of active : </b></span>
                <span className='break-words' >{getDate(lastDateOfActive)}</span>
              </div>
            </div>
            <img className='w-1/5 rounded-lg overflow-hidden self-center pl-2'
              src={authorPhoto ? authorPhoto : blankAvatar}
              alt="photo" />
          </div>
        </div>
      </a>
    </Link>

  )
}




