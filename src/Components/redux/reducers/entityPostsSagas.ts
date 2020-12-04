import { take, put, call, select, fork } from 'redux-saga/effects';
import Entity from '../../others/utilities/entity';
import { schema } from 'normalizr';
import Router from 'next/router';
import {
  GET_ALL_POST, SET_NEW_POST, GET_ONE_POST, UPDATE_POST,
  DELETE_POST, GET_MESSAGE, dellMessageAC, setMessageAC
}
  from 'src/Components/others/utilities/action';
import url from 'url'

class PostsSagas extends Entity {
  constructor() {
    super('posts', {
      authorId: new schema.Entity('users')
    });

    Entity.addSaga([
      this.getAllPosts.bind(this),
      this.setNewPosts.bind(this),
      this.deletePost.bind(this),
      this.updatePost.bind(this),
      this.getOnePost.bind(this),
      this.messagesControl.bind(this),
    ])
  }

  private uri = 'posts';

  public * getAllPosts() {
    while (true) {
      const data = yield take(GET_ALL_POST)
      //console.log('getAllPostsSAGA',data)

      const toFormat: any = {
        pathname: this.uri
      };
      if (data && data.data && data.data.name && data.data.value) {
        toFormat.query = {};
        toFormat.query[data.data.name] = data.data.value;
      }
      const urlFormatted = url.format(toFormat);
      yield fork(this.xRead, urlFormatted)
    }
  }

  public * setNewPosts() {
    while (true) {
      const data = yield take(SET_NEW_POST)
      yield fork(this.xSave, `${this.uri}/add`, data.post)
    }
  }

  public * getOnePost() {
    while (true) {
      const data = yield take(GET_ONE_POST)
      const response = yield select((state: any) => state.entities.getIn(['posts', data.id]))
      if (!response) {
        yield fork(this.xRead, `${this.uri}/one/${data.id}`)
      }
    }
  }

  public * updatePost() {
    while (true) {
      const data = yield take(UPDATE_POST)
      yield fork(this.xUpdate, `${this.uri}/update/${data.data.id}`, data.data)
    }
  }

  public * deletePost() {
    while (true) {
      const data = yield take(DELETE_POST)
      const response = yield call(this.xDelete, `${this.uri}/del/${data.id}`)
      response && Router.push('/posts')
    }
  }

  public * messagesControl() {
    while (true) {
      const message = yield take(GET_MESSAGE)
      const response = yield put(setMessageAC({ payload: message.payload }))
      response && setTimeout(() => this.context.dispatch(dellMessageAC()), 2000)
    }
  }

    // public * fetchItems(data: any) {
  //   const func = this.request('/api/md/poem/get-all', {method: 'POST'}).bind(this);
  //   yield call(this.pageEntity,func, data);
  //   }

  //   public * pageEntity(func: any, params: IPagerParams) {
  //     const pageName  = params.pageName;
  //     const pagination = yield select((state: any) => state['pagination']);

  //     if (!params.hasOwnProperty('page')) {
  //         params['page'] = pagination.getIn([pageName, 'currentPage']);
  //     }

  //     // send event about starting page fetching
  //     yield put(pageFetching(pageName, params.page, true, params.force));
  //     // check if this page already fetched
  //     if (!pagination.hasIn([pageName, 'pages', params.page]) || params.force) {
  //         let count = 0;
  //         if (!params.force && pagination.hasIn([pageName, 'count'])) {
  //             count = pagination.get(pageName).get('count');
  //         }
  //         yield call(func, {
  //             ...params,
  //             pageName,
  //             count,
  //         });
  //     }
  //     // send event about ending page fetching
  //     yield put(pageFetching(pageName, params.page, false));
  // }



}

export default new PostsSagas;