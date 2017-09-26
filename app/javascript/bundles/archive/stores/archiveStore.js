import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import archiveReducer from '../reducers/archiveReducer';

const loggerMiddleware = createLogger()

const archiveStore = (railsProps) => (
  createStore(
    archiveReducer, 
    railsProps,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )
);

export default archiveStore;
