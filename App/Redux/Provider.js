// @flow

import React, {PureComponent} from 'react';
import {Provider} from 'react-redux';
import createStore from './index';

// export const store = createStore();
let store;

class AppStoreProvider extends PureComponent {

  getChildContext() {
    return {
      store
    };
  }

  render() {
    const {children} = this.props;

    store = store || createStore();

    return <Provider store={store}>{children}</Provider>;
  }
}

export default AppStoreProvider;
