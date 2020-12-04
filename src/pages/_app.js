import App from 'next/app';
const { serialize, deserialize } = require('json-immutable');
import withRedux from 'next-redux-wrapper';
import makeStore from '../Components/redux/store';
import React from 'react';
import { Provider } from 'react-redux';
import '../styles/style.scss';
import { setQueryAC, setIdentityAC } from '../Components/others/utilities/action'
import Entity from '../Components/others/utilities/entity'
import Layout from '../Components/layout'




class MyApp extends App {

  static async getInitialProps({ Component, ctx }) {
    if (ctx.req) {
      await ctx.store.execSagaTasks(ctx, dispatch => {
        const authUser = ctx.req.session.identity;
        if (authUser) {
          dispatch(setIdentityAC({ authUser }))
        }
        if (ctx.isServer && ctx.query) {
          dispatch(setQueryAC({ query: ctx.query }))
        }
      });
    }
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
  }

  render() {
    const { Component, pageProps, store} = this.props;
    Entity.mContext = store;
    return (
      <Provider store={store}>
        <Layout >
          <Component {...pageProps} dispatch={store.dispatch} />
        </Layout>
      </Provider>
    )
  }
}

const wRedux = withRedux(makeStore, {
  serializeState: state => {
    return state ? serialize(state) : state;
  },
  deserializeState: state => {
    return state ? deserialize(state) : state;
  }
})(MyApp);

export default wRedux;