import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import interviewReducer from '../reducers/interviewReducer';

const loggerMiddleware = createLogger()

const archiveStore = (railsProps) => (
  createStore(
    interviewReducer, 
    railsProps,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )
);

export default archiveStore;
