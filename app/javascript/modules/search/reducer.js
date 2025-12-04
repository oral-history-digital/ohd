import {
    CHANGE_REGISTRY_ENTRIES_VIEW_MODE,
    RECEIVE_REGISTRY_ENTRY_SEARCH,
    REQUEST_REGISTRY_ENTRY_SEARCH,
    RESET_QUERY,
    SET_QUERY_PARAMS,
} from './action-types';

export const initialState = {
    registryEntries: {},
    users: {
        query: {
            'user_projects.workflow_state': 'project_access_requested',
            page: 1,
        },
    },
    roles: { query: { page: 1 } },
    permissions: { query: { page: 1 } },
    people: { query: { page: 1 } },
    projects: { query: { page: 1 } },
    collections: { query: { page: 1 } },
    languages: { query: { page: 1 } },
};

const search = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_REGISTRY_ENTRY_SEARCH:
            return Object.assign({}, state, {
                isRegistryEntrySearching: true,
            });
        case RECEIVE_REGISTRY_ENTRY_SEARCH:
            return Object.assign({}, state, {
                isRegistryEntrySearching: false,
                registryEntries: Object.assign({}, state.registryEntries, {
                    [action.project]: Object.assign(
                        {},
                        state.registryEntries[action.project],
                        {
                            results: action.registryEntries,
                        }
                    ),
                }),
            });
        case SET_QUERY_PARAMS:
            return Object.assign({}, state, {
                [action.scope]: Object.assign({}, state[action.scope], {
                    query: Object.assign(
                        {},
                        state[action.scope].query,
                        action.params
                    ),
                }),
            });
        case RESET_QUERY:
            return Object.assign({}, state, {
                [action.scope]: Object.assign({}, state[action.scope], {
                    query: { page: 1 },
                }),
                interviews:
                    action.scope === 'archive' ? {} : state['interviews'],
            });
        case CHANGE_REGISTRY_ENTRIES_VIEW_MODE:
            return Object.assign({}, state, {
                registryEntries: Object.assign({}, state.registryEntries, {
                    [action.projectId]: Object.assign(
                        {},
                        state.registryEntries[action.projectId],
                        {
                            showRegistryEntriesSearchResults: action.bool,
                        }
                    ),
                }),
            });
        default:
            return state;
    }
};

export default search;
