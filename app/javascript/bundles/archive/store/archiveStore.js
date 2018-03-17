import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import combinedReducers from '../reducers/combinedReducers';

const loggerMiddleware = createLogger();

const archiveStore = (railsProps) => (
  createStore(
    combinedReducers,
    railsProps,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )
);

export default archiveStore;
