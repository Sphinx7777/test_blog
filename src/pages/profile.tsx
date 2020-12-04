import { connect } from 'react-redux';
import { useRouter } from 'next/router'
import 'src/styles/style.scss'
import { blankAvatar, getDate } from 'src/Components/others/utilities/common';
import { getOnePostAC } from 'src/Components/others/utilities/action';


interface IIndexProps {
  authUser?: Map<string, any>;
  users?: Map<string, any>;
  posts?: Map<string, any>;
  getOnePostAC?: any;
}

const Profile = ({ authUser, users, posts }: IIndexProps) => {
  const router = useRouter()
  const post = posts.get(`${router.query.id}`)
  const getAuthorId = () => {
    if (authUser.get('pole') === 'user' && router.query.id === authUser.get('id')) {
      return authUser.get('id')

    } else if (router.query.id) {
      return post && post.size && post.get(`authorId`)
    }
  }
  const author = (post && post.size && users && users.size) ? users.get(getAuthorId()) : authUser

  return (
    <div>
      <div className='text-center'>
        <img className='max-w-xs inline-block mt-5 rounded-lg overflow-hidden'
          src={author.get('photoUrl') ? author.get('photoUrl') : blankAvatar}
          alt="photo" />
      </div>
      <div className='flex flex-wrap p-2 mt-5 border-b-2 border-black rounded-lg'>
        <span className='px-5' >Name : </span>
        <span className='px-5' >{`${author.get('firstName')} ${author.get('lastName')}`}</span>
      </div>
      <div className='flex flex-wrap p-2 mt-5 border-b-2 border-black rounded-lg'>
        <span className='px-5' >Email : </span>
        <a className='text-blue-600'
          href={`mailto:${author.get('email')}`} >
          {author.get('email')}
        </a>
      </div>
      <div className='flex flex-wrap p-2 mt-5 border-b-2 border-black rounded-lg'>
        <span className='px-5' >Registered : </span>
        <span className='px-5' >{getDate(author.get('createdDate'))}</span>
      </div>
      <div className='flex flex-wrap p-2 mt-5 border-b-2 border-black rounded-lg'>
        <span className='px-5' >Last activity : </span>
        <span className='px-5' >{getDate(author.get('lastDateOfActive'))}</span>
      </div>
    </div>
  );
};

Profile.getInitialProps = async (ctx: any) => {
  await ctx.store.execSagaTasks(ctx, async (dispatch: any) => {
    dispatch(getOnePostAC({ id: ctx.query.id }));
  });
}

export default
  connect((state: any) => ({
    authUser: state.auth,
    users: state.entities.get('users'),
    posts: state.entities.get('posts')
  }), { getOnePostAC })(Profile);




