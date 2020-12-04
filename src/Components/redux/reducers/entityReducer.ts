import { combineReducers } from 'redux';
import { fromJS, has, get, set, Map } from 'immutable';
import { CRUD } from 'src/Components/others/utilities/common';
import { reducer as form } from 'redux-form'
import { SET_QUERY, SET_AUTH_USER, SET_MESSAGE, DELL_MESSAGE, action } from 'src/Components/others/utilities/action';



const initialState = fromJS({
  posts: {},
  users: {}
});

const entities = (state = initialState, action: any) => {
 // console.log('entities', action)
  if (action.response && action.response.posts && action.glob && action.glob.crud && action.glob.entity.mEntityName === 'posts') {
    const entityName = action.glob.entity.mEntityName
    switch (action.glob.crud) {
      case CRUD.READ:
        // state = fromJS({})
        return state.mergeDeep(fromJS(action.response));
      case CRUD.CREATE:
        return state.mergeDeep(fromJS(action.response));
      case CRUD.UPDATE:
        const postsAfterUpdate = state.get(entityName).delete(Object.keys(action.response.posts)[0]).concat(fromJS(action.response.posts))
        state = fromJS({ posts: postsAfterUpdate, users: state.get('users') })
        return state
      case CRUD.DELETE:
        const postsAfterRemoval = state.get(entityName).delete(Object.keys(action.response.posts)[0])
        state = fromJS({ posts: postsAfterRemoval, users: state.get('users') })
        return state
      default:
        return state;
    }
  }
  return state;
}

const authUserInitialState = fromJS({
});

const auth = (state = authUserInitialState, action: any) => {
  switch (action.type) {
    case SET_AUTH_USER:
      return state.mergeDeep(fromJS(action.authUser));
    default:
      return state;
  }
}

const queryInitialState: any = null;

const queries = (state = queryInitialState, action: any) => {
  switch (action.type) {
    case SET_QUERY:
      return action.query;
    default:
      return state;
  }
}

const messagesInitialState: any = [];

const messages = (state = messagesInitialState, action: any) => {
  switch (action.type) {
    case SET_MESSAGE: {
      return [...state, action.payload]
    }

    case DELL_MESSAGE:
      state.splice(0, 1)
      return [...state]
    default:
      return state;
  }
}


const pagination = (state = fromJS({}), action: any) => {
  if (action.response && action.response.pager) {
    const { response: { pager } } = action;
    if (action.hasOwnProperty('glob') && action.glob.entity.mEntityName) {
      const pageName = action.glob.entity.mEntityName;
      let pagination = state.has(pageName) ? state.get(pageName) : Map();
      pagination = pagination
        .set('entityName', action.glob.entity.entityName)
        .set('pageName', pageName)
        .set('currentPage', pager.page)
        .set('count', pager.count)
        .set('perPage', pager.perPage);
      const pages = pagination.has('pages') ? pagination.get('pages') : Map();
      const item = fromJS({
        ids: action.response.result,
      });
      pagination = pagination.set('pages', pages.set(pager.page, item));
      state = state.set(pageName, pagination);
      return state
    }
  }
  return state
}




export default combineReducers({ entities, queries, auth, messages, form, pagination });