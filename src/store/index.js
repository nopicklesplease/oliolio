import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import auth from './auth';
import btc from './btc';
import wallets from './wallets';
import entries from './entries';
import users from './users';
import hidden from './hidden';

const reducer = combineReducers({
  auth,
  btc,
  wallets,
  entries,
  users,
  hidden
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;

export * from './auth';
export * from './btc';
export * from './wallets';
export * from './entries';
export * from './users';
export * from './hidden';