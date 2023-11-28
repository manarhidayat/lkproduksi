// @flow

import React, {PureComponent} from 'react';
import {Provider} from 'react-redux';
import createStore from './index';

export const store = createStore();

class AppStoreProvider extends PureComponent {
  render() {
    const {children} = this.props;

    return <Provider store={store}>{children}</Provider>;
  }
}

export default AppStoreProvider;
