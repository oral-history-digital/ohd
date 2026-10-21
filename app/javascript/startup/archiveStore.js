import { apiMiddleware } from 'modules/api';
import { initializeProjects } from 'modules/data';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import thunkMiddleware from 'redux-thunk';

import combinedReducers from './combinedReducers';
import persistedState from './persistedState';

/**
 * Creates the store with authorized base project details ready for the bootstrap locale.
 * Lists, optional includes, other locales, and editing data still load on demand.
 *
 * @param {Object} railsProps - Initial Redux branches, with project display payload under data.projects.
 * @returns {import('redux').Store} Initialized application store.
 */
const archiveStore = (railsProps) => {
    const { projects, ...data } = railsProps.data || {};
    const initialState = { ...railsProps, data, ...persistedState };
    // Rails supplies display responses; Redux owns their normalized storage and request keys.
    const normalizedState = projects
        ? combinedReducers(
              initialState,
              initializeProjects(projects, initialState)
          )
        : initialState;
    return createStore(
        combinedReducers,
        normalizedState,
        composeWithDevTools(applyMiddleware(thunkMiddleware, apiMiddleware))
    );
};

export default archiveStore;
