import '../../styles/style.scss'
import Link from 'next/link'
import { getDate } from '../others/utilities/common'

interface IShowPostDescriptionProps {
  post: Map<string, any>;
  author: Map<string, any>;
}

export const ShowPostDescription = ({ post, author }: IShowPostDescriptionProps) => {

  return (
    <div className="flex flex-col p-2 " >
      <div className='break-all my-2 mb-5 px-2 border-b-2 border-black break-words rounded-lg'><b>{post.get('title')}</b></div>
      <div className="px-1 mb-5 text-left break-all border-b-2 border-black break-words rounded-lg bg-white">{post.get('description')}</div>
      <div className="flex flex-wrap flex-col">
        <div className='text-left'>
          <span><b>Date of creation : </b></span><span className="inline-block" >{getDate(post.get('createdDate'))}</span>
        </div>
        <Link href={{ pathname: '/profile', query: { id: `${post.get('id')}` } }}>
          <a className='text-blue-500 my-3 flex flex-wrap'>
            <span className='text-black pr-1'><b>Author : </b></span>
            <div>
              <span >{`${author.get('firstName')} ${author.get('lastName')}`}</span>
              <img src="/profiles.png" alt="back" title='back' className='px-1 inline-block' />
            </div>
          </a>
        </Link>
      </div>
    </div>
  )
}



