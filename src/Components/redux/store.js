import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import { all } from 'redux-saga/effects'
import rootReducer from './reducers/entityReducer'
import Entity from '../others/utilities/entity'
import PostsSagas from './reducers/entityPostsSagas'
import UserSagas from './reducers/entityUserSagas'


const saga = function* root() {
    yield all(Entity.mSagas);
};


/**
* @param {object} initialState
* @param {boolean} options.isServer indicates whether it is a server side or client side
* @param {Request} options.req NodeJS Request object (not set when client applies initialState from server)
* @param {Request} options.res NodeJS Request object (not set when client applies initialState from server)
* @param {boolean} options.debug User-defined debug mode param
* @param {string} options.storeKey This key will be used to preserve store in global namespace for safe HMR
*/
export default (initialState, options) => {
    const sagaMiddleware = createSagaMiddleware();
    const middleware = [sagaMiddleware];

    const composeEnhancers =
        typeof window === 'object' &&
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            }) : compose;

    const enhancer = composeEnhancers(
        applyMiddleware(...middleware)
    );

    const store = createStore(
        rootReducer,
        initialState,
        enhancer
    );

    store.runSaga = () => {
        if (store.saga) return;
        store.saga = sagaMiddleware.run(saga);
    };

    store.stopSaga = async () => {
        if (!store.saga) return;
        store.dispatch(END);
        await store.saga.done;
        store.saga = null;
    };

    store.execSagaTasks = async (ctx, tasks) => {
        // console.log('execSagaTasks',ctx)
        Entity.mContext = ctx.store;
        await store.runSaga();
        if (ctx.hasOwnProperty('query')) {
            const body = JSON.stringify(ctx.query);
            if (body && !body.includes('css') && !body.includes('chunk')) {
                tasks(store.dispatch);
            }
        } else {
            tasks(store.dispatch);
        }
        await store.stopSaga();
        if (!ctx.isServer) {
            store.runSaga();
        }
    };

    store.runSaga();

    return store;
};