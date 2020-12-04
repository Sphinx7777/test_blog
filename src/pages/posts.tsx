import React, { Component } from 'react'
import { connect } from "react-redux";
import '../styles/style.scss'
import { Map } from 'immutable';
import { setNewPostAC, getAllPostsAC } from '../Components/others/utilities/action'
import { GuestUser } from 'src/Components/posts/guestUser';
import { OnePost } from 'src/Components/posts/post';
import PostForm from 'src/Components/forms/postForm/postForm';
import  SearchForm  from '../Components/posts/searchForm';
import { PageString } from 'src/Components/posts/pageString';
import Entity from 'src/Components/others/utilities/entity';


export interface IPostProps {
  posts?: Map<string, any>;
  users?: Map<string, any>;
  setNewPostAC?: any;
  getAllPostsAC?: any;
  dispatch?: any;
  authUser?: any;
  post?: Map<string, any>;
  author?: (post: Map<string, any>) => void;
  pagination?: any
}

class Post extends Component<IPostProps>{

  static getInitialProps = async (ctx: any) => {
    await ctx.store.execSagaTasks(ctx, async (dispatch: any) => {
    dispatch(getAllPostsAC({data: null}));
    });
  }

  state = {
    showForm: false
  }

  toggleShowForm = () => this.setState({ showForm: !this.state.showForm })

  onSubmit = (data: any) => {
    const post = {
      title: data.title,
      description: data.description,
      authorId: this.props.authUser.get('id')
    }
    this.props.dispatch(setNewPostAC({ post }))
  }


  render() {
    const { users, authUser } = this.props;
   const posts = Entity.getPagerItems('posts')
    const author = (post: Map<string, any>) =>
    users.get(`${post.get('authorId')}`).get('firstName') + ' ' + users.get(`${post.get('authorId')}`).get('lastName')

    return (
      <div className='bg-blue-200 max-w-screen-xl'>
        <PageString pagination={this.props.pagination} />
        <SearchForm />
        {
          (!authUser || !authUser.size || authUser.get('role') === 'guest') && <GuestUser />
        }
        {
          this.state.showForm && authUser.get('role') === 'user'
            ? <div className='flex item-center justify-center py-5'  >
              <button className='z-20 border-2 fixed top-1 border-white rounded-lg p-1 text-white cursor-pointer bg-blue-600'
                onClick={this.toggleShowForm}
              >Cancel  <img src="/reply.png" alt="back" title='back' className='px-1 inline' />
              </button>
           </div>
            : <div></div>
        }
        {
          authUser && authUser.get('role') === 'user' && this.state.showForm &&
          <PostForm onSubmit={this.onSubmit} />}
        {
          !this.state.showForm && authUser.get('role') === 'user'
            ? <div className=' flex item-center justify-center py-5' >
              <span className=' z-20 border-2  border-white fixed top-1 rounded-lg p-1 text-white cursor-pointer bg-blue-600'
                onClick={this.toggleShowForm}
              >Write a new post</span></div>
            : <div></div>
        }
        <div>
          {
            posts.size > 0 && 
            posts.valueSeq().map((post: any) => <OnePost key={post.get('id')} {...{ authUser, users, post, author }} />)
          }
        </div>
      </div>
    )
  }
}


export default connect((state: any) => ({
  posts: state.entities.get('posts'),
  users: state.entities.get('users'),
  authUser: state.auth,
  pagination: state.pagination
}), { setNewPostAC, getAllPostsAC })(Post);


