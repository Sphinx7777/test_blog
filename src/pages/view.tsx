import React, { useState, useEffect } from 'react'
import { withRouter } from 'next/router'
import { compose } from 'redux';
import { useDispatch, connect } from 'react-redux'
import '../styles/style.scss'
import { ShowPostDescription } from '../Components/view/showPostDescription';
import { ShowIsAuthorMode } from '../Components/view/showIsAuthorMode';
import { Map } from 'immutable';
import { getAllPostsAC, getOnePostAC, updatePostAC, deletePostAC } from '../Components/others/utilities/action'
import PostForm from 'src/Components/forms/postForm/postForm';
import { Preloader } from 'src/Components/others/preloader';

interface IViewOnePostProps {
  posts: Map<string, any>;
  users: Map<string, any>;
  authUser: Map<string, any>;
  router: any;
  getOnePostAC: any;
}

const ViewOnePost = ({ posts, users, getOnePostAC, authUser, ...props }: IViewOnePostProps) => {
  const dispatch = useDispatch()
  const post = posts.get(props.router.query.id)
  const author = post && users.get(post.get('authorId'))
  const [showForm, setShowForm] = useState(false)
  const isAuthor = authUser && post ? post.get('authorId') === authUser.get('id') : false
  const initialValues = post && {
    title: post.get('title'),
    description: post.get('description')
  }

const toggleShowForm = () => setShowForm(!showForm)
  
const deletePost = (id: string) => {
    if (confirm("Delete post ???")) {
      dispatch(deletePostAC({ id }))
    }
  }

  const onSubmit = (updatePost: any) => {
    const data = {
      post: {
        title: updatePost.title,
        description: updatePost.description,
        authorId: authUser.get('id')
      },
      id: post.get('id')
    }
    dispatch(updatePostAC({ data }))
  }

  return (
    <div className='bg-blue-200 max-w-4xl mx-auto border-2 border-black rounded-lg overflow-hidden text-center mt-5 p-5'>
      {
        (typeof post === 'object')
        && <ShowPostDescription {...{ post, author }} />
        || <Preloader />
      }
      {
        isAuthor && <ShowIsAuthorMode {...{ post, deletePost, toggleShowForm, showForm }} />
        
      }
      {
        showForm && <PostForm {...{ initialValues, onSubmit, toggleShowForm }} />
      }
    </div>
  )
}

ViewOnePost.getInitialProps = async (ctx: any) => {
  await ctx.store.execSagaTasks(ctx, async (dispatch: any) => {
    dispatch(getOnePostAC({ id: ctx.query.id }));
  });
}

export default compose(
  connect((state: any) => ({
    posts: state.entities.get('posts'),
    users: state.entities.get('users'),
    authUser: state.auth
  }), { getAllPostsAC, getOnePostAC, updatePostAC, deletePostAC }),
  withRouter)(ViewOnePost);


