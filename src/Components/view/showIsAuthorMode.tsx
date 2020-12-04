import Link from 'next/link';

interface IShowIsAuthorModeProps {
  post: Map<string, any>;
  deletePost: (id: string) => void;
  toggleShowForm: () => void;
  showForm: boolean;
}

export const ShowIsAuthorMode = ({ post, deletePost, toggleShowForm, showForm }: IShowIsAuthorModeProps) => {
  return (
    <div className='mb-5'>
      <div>
        <button className='border-2 border-white rounded-lg px-1 mr-2 focus:border-transparent'
          disabled={typeof post !== 'object'}
          onClick={() => deletePost(post.get('id'))}>
          Delete post <img src="/trash.png" alt="back" title='back' className='px-1 inline' />
        </button>
        <button className='border-2 border-white rounded-lg px-1 mr-2 focus:border-transparent'
          onClick={toggleShowForm}
          disabled={typeof post !== 'object'}
        >
          {!showForm ? 'Change post' : 'Cancel'}  <img src="/transfer.png" alt="back" title='back' className='px-1 inline max-w-1' />
        </button>
        <Link href='/posts'>
          <a className='border-2 border-white rounded-lg p-1 focus:border-transparent'>
            Back  <img src="/reply.png" alt="back" title='back' className='px-1 inline' />
          </a>
        </Link>
      </div>
    </div>
  )
}
