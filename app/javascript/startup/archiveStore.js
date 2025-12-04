import { apiMiddleware } from 'modules/api';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import thunkMiddleware from 'redux-thunk';

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
