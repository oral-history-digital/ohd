import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

import combinedReducers from './combinedReducers';

const archiveStore = (railsProps) => (
    createStore(
        combinedReducers,
        railsProps,
        composeWithDevTools(applyMiddleware(thunkMiddleware))
    )
);

export default archiveStore;
