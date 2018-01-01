import { combineReducers } from 'redux';
import { LOGOUT } from '../actions/types';
import user from './auth_reducer';
import scopes from './scopes';
import searchInput from './searchInput';
import feed from './feed';

const appReducer = combineReducers({
  user,
  scopes,
  searchInput,
  feed,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
}

export default rootReducer;
