import { apiMiddleware } from 'modules/api';
import { initializeProjectSummaries } from 'modules/data';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import thunkMiddleware from 'redux-thunk';

import combinedReducers from './combinedReducers';
import persistedState from './persistedState';

/**
 * Creates the application store and normalizes authorized bootstrap project summaries.
 * Summary data does not mark detail requests or optional includes as loaded.
 *
 * @param {Object} railsProps - Initial Redux branches and optional projectSummaries envelope.
 * @returns {import('redux').Store} Initialized application store.
 */
const archiveStore = ({ projectSummaries, ...railsProps }) => {
    const store = createStore(
        combinedReducers,
        {
            ...railsProps,
            ...persistedState,
        },
        composeWithDevTools(applyMiddleware(thunkMiddleware, apiMiddleware))
    );
    if (projectSummaries)
        store.dispatch(initializeProjectSummaries(projectSummaries));
    return store;
};

export default archiveStore;
