import { take, put, call } from 'redux-saga/effects';
import Entity from '../../others/utilities/entity';
import { schema } from 'normalizr';
import { setAuthUserAC, SET_REGISTRATION, SET_LOGOUT_USER, SET_IDENTITY } from 'src/Components/others/utilities/action';
import Router from 'next/router';


class UserSagas extends Entity {
  constructor() {
    super('authUser', {
      id: new schema.Entity('authUser')
    });

    Entity.addSaga([
      this.setIdentity.bind(this),
      this.setLogout.bind(this),
      this.setRegisteredUser.bind(this)
    ])
  }

  private uri = 'users';

  replaceWithEmail = (email: string) => {
    Router.push({
      pathname: '/authorization',
      query: { email }
    })
  }

  public * setRegisteredUser() {
    while (true) {
      const data = yield take(SET_REGISTRATION)
      const response = yield call(Entity.fetch, `${this.uri}/registration`, data.data)
      const email = response && response.success && response.data
      response.success && this.replaceWithEmail(email)
    }
  }

  public * setLogout() {
    while (true) {
      const data = yield take(SET_LOGOUT_USER)
      const response = yield call(Entity.fetch, `${this.uri}/logout`, data.data)
      yield put(setAuthUserAC({ authUser: response.data }))
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
     }
  }

  public * setIdentity() {
    while (true) {
      const data = yield take(SET_IDENTITY)
      yield put(setAuthUserAC({ authUser: data.authUser }))
    }
  }
}

export default new UserSagas;

