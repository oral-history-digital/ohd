import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

import { apiMiddleware } from 'modules/api';
import combinedReducers from './combinedReducers';
import persistedState from './persistedState';

const archiveStore = (railsProps) =>
    createStore(
        combinedReducers,
        {
            ...railsProps,
            ...persistedState,
        },
        composeWithDevTools(applyMiddleware(thunkMiddleware, apiMiddleware))
    );

export default archiveStore;
