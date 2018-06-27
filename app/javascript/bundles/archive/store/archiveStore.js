import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import combinedReducers from '../reducers/combinedReducers';

let archiveStore;

if (process.env.NODE_ENV === "development") {
    const loggerMiddleware = createLogger();
    archiveStore = (railsProps) => (
        createStore(
            combinedReducers,
            railsProps,
            applyMiddleware(
                thunkMiddleware,
                loggerMiddleware
            )
        )
    );
} else {
    archiveStore = (railsProps) => (
        createStore(
            combinedReducers,
            railsProps,
            applyMiddleware(
                thunkMiddleware,
            )
        )
    );
}



export default archiveStore;
