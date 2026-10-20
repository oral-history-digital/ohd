import { LOGOUT } from '../../user/action-types';
import {
    DELETE_STATUS_MSG,
    RECEIVE_DATA,
    RECEIVE_ERROR,
    REMOVE_DATA,
    REPLACE_INSTANCE_SETTINGS,
    REQUEST_DATA,
    UPDATE_DATA,
} from './action-types';
import { reduceProjectRecords } from './projectReducer';
import { reduceV2Projects } from './v2ProjectReducer';

const initialState = {
    users: {
        current: null,
    },
    projects: {},
    projectRequests: {},
    projectRepresentations: {},
    instance_settings: null,
    statuses: {
        users: { resultPagesCount: 1 },
        interviews: {},
        random_featured_interviews: {},
        segments: {},
        doi_contents: {},
        headings: {},
        ref_tree: {},
        registry_references: {},
        registry_reference_types: {},
        registry_entries: {},
        contributions: {},
        people: {},
        user_contents: {},
        annotations: {},
        uploads: {},
        biographical_entries: {},
        speaker_designations: {},
        mark_text: {},
        roles: {},
        permissions: {},
        tasks: {},
        projects: {},
        collections: {},
        languages: {},
    },
};

/**
 * Updates cached entities and request status. Routes v2 project actions to their
 * own state branch while preserving the existing legacy data flow.
 * Logout clears cached accounts; anonymous current-account responses remain null.
 *
 * @param {Object} [state=initialState] - Data branch of the Redux store.
 * @param {Object} action - Request, response, mutation, or access-change action.
 * @returns {Object} Updated data state, or the same object for ignored actions.
 */
export const dataReducer = (state = initialState, action) => {
    const v2Projects = reduceV2Projects(state.v2?.projects, action);
    if (v2Projects !== state.v2?.projects)
        state = { ...state, v2: { ...state.v2, projects: v2Projects } };
    if (action.apiVersion === 2) return state;
    // Save project request progress alongside the usual data and loading updates.
    if (action.projectRequest) {
        const { key, ...request } = action.projectRequest;
        state = {
            ...state,
            projectRequests: { ...state.projectRequests, [key]: request },
        };
    }
    if (
        action.type === LOGOUT ||
        (action.type === RECEIVE_DATA &&
            action.dataType === 'users' &&
            action.id === 'current' &&
            action.data === null)
    ) {
        return {
            ...state,
            users: { current: null },
            statuses: { ...state.statuses, users: initialState.statuses.users },
        };
    }
    switch (action.type) {
        case REPLACE_INSTANCE_SETTINGS:
            return { ...state, instance_settings: action.data };
        case DELETE_STATUS_MSG:
            return Object.assign({}, state, {
                statuses: Object.assign({}, state.statuses, {
                    [action.dataType]: Object.keys(
                        state.statuses[action.dataType]
                    ).reduce(
                        (acc, key) => {
                            if (action.msgOrIndex !== key) {
                                return {
                                    ...acc,
                                    [key]: state.statuses[action.dataType][key],
                                };
                            }
                            return acc;
                        },
                        { lastModified: new Date() }
                    ),
                }),
            });
        case UPDATE_DATA:
            if (action.nestedId) {
                return Object.assign({}, state, {
                    [action.dataType]: Object.assign(
                        {},
                        state[action.dataType],
                        {
                            [action.id]: Object.assign(
                                {},
                                state[action.dataType][action.id],
                                {
                                    [action.nestedDataType]: Object.assign(
                                        {},
                                        state[action.dataType][action.id][
                                            action.nestedDataType
                                        ],
                                        {
                                            [action.nestedId]: action.data,
                                        }
                                    ),
                                }
                            ),
                        }
                    ),
                });
            } else {
                return Object.assign({}, state, {
                    [action.dataType]: Object.assign(
                        {},
                        state[action.dataType],
                        {
                            [action.id]: Object.assign(
                                {},
                                state[action.dataType][action.id],
                                action.data
                            ),
                        }
                    ),
                });
            }
        case REMOVE_DATA:
            if (action.nestedId) {
                let nestedData =
                    state[action.dataType][action.id][action.nestedDataType];
                if (nestedData) {
                    return Object.assign({}, state, {
                        statuses: updateStatus(
                            state.statuses,
                            action.nestedDataType,
                            { lastModified: new Date() }
                        ),
                        [action.dataType]: Object.assign(
                            {},
                            state[action.dataType],
                            {
                                [action.id]: Object.assign(
                                    {},
                                    state[action.dataType][action.id],
                                    {
                                        [action.nestedDataType]: Object.keys(
                                            nestedData
                                        ).reduce((acc, key) => {
                                            if (
                                                key !==
                                                action.nestedId.toString()
                                            ) {
                                                return {
                                                    ...acc,
                                                    [key]: nestedData[key],
                                                };
                                            }
                                            return acc;
                                        }, {}),
                                    }
                                ),
                            }
                        ),
                    });
                } else {
                    return state;
                }
            } else if (action.nestedDataType) {
                return Object.assign({}, state, {
                    statuses: updateStatus(
                        state.statuses,
                        action.nestedDataType,
                        { lastModified: new Date() }
                    ),
                    [action.dataType]: Object.assign(
                        {},
                        state[action.dataType],
                        {
                            [action.id]: Object.assign(
                                {},
                                state[action.dataType][action.id],
                                {
                                    [action.nestedDataType]: {},
                                }
                            ),
                        }
                    ),
                });
            } else if (action.id) {
                if (state[action.dataType]) {
                    return Object.assign({}, state, {
                        statuses: updateStatus(
                            state.statuses,
                            action.dataType,
                            { lastModified: new Date() }
                        ),
                        [action.dataType]: Object.keys(
                            state[action.dataType]
                        ).reduce((acc, key) => {
                            if (key !== action.id.toString()) {
                                return {
                                    ...acc,
                                    [key]: state[action.dataType][key],
                                };
                            }
                            return acc;
                        }, {}),
                    });
                } else {
                    return state;
                }
            } else if (action.dataType) {
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.dataType, {
                        lastModified: new Date(),
                    }),
                    [action.dataType]: {},
                });
            } else {
                return state;
            }
        case REQUEST_DATA:
            if (action.nestedDataType) {
                return Object.assign({}, state, {
                    statuses: updateStatus(
                        state.statuses,
                        action.nestedDataType,
                        { [`for_${action.dataType}_${action.id}`]: 'fetching' }
                    ),
                });
            } else if (action.id) {
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.dataType, {
                        [action.id]: 'fetching',
                    }),
                });
            } else if (action.extraParams) {
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.dataType, {
                        [action.extraParams]: 'fetching',
                    }),
                });
            } else {
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.dataType, {
                        all: 'fetching',
                    }),
                });
            }
        case RECEIVE_DATA:
            if (action.extraId) {
                //for segments
                let statuses = updateStatus(
                    state.statuses,
                    action.nestedDataType,
                    { [action.nestedId]: action.msg || `fetched-${new Date()}` }
                );
                statuses = updateStatus(statuses, action.reloadDataType, {
                    [action.reloadId]: `reload-${new Date()}`,
                });
                return Object.assign({}, state, {
                    statuses: statuses,
                    [action.dataType]: Object.assign(
                        {},
                        state[action.dataType],
                        {
                            [action.id]: Object.assign(
                                {},
                                state[action.dataType][action.id],
                                {
                                    [action.nestedDataType]: Object.assign(
                                        {},
                                        state[action.dataType][action.id][
                                            action.nestedDataType
                                        ],
                                        {
                                            [action.extraId]: Object.assign(
                                                {},
                                                state[action.dataType][
                                                    action.id
                                                ][action.nestedDataType][
                                                    action.extraId
                                                ],
                                                {
                                                    [action.nestedId]:
                                                        action.data,
                                                }
                                            ),
                                        }
                                    ),
                                }
                            ),
                        }
                    ),
                });
            } else if (action.nestedId) {
                let statuses = updateStatus(
                    state.statuses,
                    action.nestedDataType,
                    { [action.nestedId]: action.msg || `fetched-${new Date()}` }
                );
                statuses = updateStatus(statuses, action.reloadDataType, {
                    [action.reloadId]: `reload-${new Date()}`,
                });
                return Object.assign({}, state, {
                    statuses: statuses,
                    [action.dataType]: Object.assign(
                        {},
                        state[action.dataType],
                        {
                            [action.id]: Object.assign(
                                {},
                                state[action.dataType][action.id],
                                {
                                    [action.nestedDataType]: Object.assign(
                                        {},
                                        state[action.dataType][action.id][
                                            action.nestedDataType
                                        ],
                                        {
                                            [action.nestedId]: action.data,
                                        }
                                    ),
                                }
                            ),
                        }
                    ),
                });
            } else if (action.nestedDataType) {
                let statuses = updateStatus(
                    state.statuses,
                    action.nestedDataType,
                    {
                        [action.extraParams ||
                        `for_${action.dataType}_${action.id}`]:
                            action.msg || `fetched-${new Date()}`,
                    }
                );
                statuses = updateStatus(statuses, action.reloadDataType, {
                    [action.reloadId]: `reload-${new Date()}`,
                });
                statuses = updateStatus(statuses, action.nestedDataType, {
                    resultPagesCount: action.resultPagesCount,
                });
                let nestedData =
                    (state[action.dataType] &&
                        state[action.dataType][action.id] &&
                        state[action.dataType][action.id][
                            action.nestedDataType
                        ]) ||
                    {};
                return Object.assign({}, state, {
                    statuses: statuses,
                    [action.dataType]: Object.assign(
                        {},
                        state[action.dataType],
                        {
                            [action.id]: Object.assign(
                                {},
                                state[action.dataType] &&
                                    state[action.dataType][action.id],
                                {
                                    [action.nestedDataType]:
                                        action.page === '1'
                                            ? action.data
                                            : Object.assign(
                                                  {},
                                                  nestedData,
                                                  action.data
                                              ),
                                }
                            ),
                        }
                    ),
                });
            } else if (action.id) {
                let statuses = updateStatus(state.statuses, action.dataType, {
                    [action.id]: action.msg || `fetched-${new Date()}`,
                });
                statuses = updateStatus(statuses, action.reloadDataType, {
                    [action.reloadId]: `reload-${new Date()}`,
                });
                return Object.assign({}, state, {
                    statuses: statuses,
                    [action.dataType]: Object.assign(
                        {},
                        state[action.dataType],
                        {
                            [action.id]: state[action.dataType]
                                ? Object.assign(
                                      {},
                                      state[action.dataType][action.id],
                                      action.data
                                  )
                                : action.data,
                        }
                    ),
                    ...reduceProjectRecords(state, action),
                });
            } else if (action.extraParams) {
                let statuses = updateStatus(state.statuses, action.dataType, {
                    [action.extraParams]: action.msg || `fetched-${new Date()}`,
                });
                statuses = updateStatus(statuses, action.reloadDataType, {
                    [action.reloadId]: `reload-${new Date()}`,
                });
                statuses = updateStatus(statuses, action.dataType, {
                    resultPagesCount: action.resultPagesCount,
                });
                return Object.assign({}, state, {
                    statuses: statuses,
                    [action.dataType]:
                        action.page === '1'
                            ? action.data
                            : Object.assign(
                                  {},
                                  state[action.dataType],
                                  action.data
                              ),
                    ...reduceProjectRecords(state, action),
                });
            } else if (action.dataType) {
                let statuses = updateStatus(state.statuses, action.dataType, {
                    all: action.msg || `fetched-${new Date()}`,
                });
                statuses = updateStatus(statuses, action.reloadDataType, {
                    [action.reloadId]: `reload-${new Date()}`,
                });
                statuses = updateStatus(statuses, action.dataType, {
                    resultPagesCount: action.resultPagesCount,
                });
                return Object.assign({}, state, {
                    statuses: statuses,
                    [action.dataType]:
                        action.page === '1'
                            ? action.data
                            : Object.assign(
                                  {},
                                  state[action.dataType],
                                  action.data
                              ),
                });
            } else {
                return state;
            }

        case RECEIVE_ERROR:
            // Clear loading state and mark error
            if (action.id) {
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.dataType, {
                        [action.id]: `error-${new Date()}`,
                    }),
                });
            } else {
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.dataType, {
                        all: `error-${new Date()}`,
                    }),
                });
            }

        default:
            return state;
    }
};

function updateStatus(statuses, dataType, messageObject) {
    if (dataType) {
        return Object.assign({}, statuses, {
            [dataType]: Object.assign({}, statuses[dataType], messageObject),
        });
    } else {
        return statuses;
    }
}

export default dataReducer;
