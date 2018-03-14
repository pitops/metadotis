import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import torrentsReducer from './torrentsReducer';

const rootReducer = combineReducers({
  torrents: torrentsReducer,
  router: routerReducer
});

export default rootReducer;
