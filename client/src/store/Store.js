import { createStore, compose } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';

import rootReducer from './reducers/index';

const defaultState = {
  torrents: []
};

const store = createStore(rootReducer, defaultState);

// export const history = syncHistoryWithStore(browserHistory, store)
export default store;
