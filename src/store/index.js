import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import thunk from 'redux-thunk';
import { AsyncStorage } from 'react-native';
import reducers from '../reducers';

const composeEnhancers = composeWithDevTools({ realtime: true });

const store = createStore(
  reducers,
  {},
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
