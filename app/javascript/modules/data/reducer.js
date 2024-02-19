import {
    UPDATE_DATA,
    REMOVE_DATA,
    REQUEST_DATA,
    RECEIVE_DATA,
    DELETE_STATUS_MSG,
} from './action-types';

const initialState = {
    users: {
        current: null
    },
    projects: {},
    translation_values: {},
    translations: {},
    statuses: {
        users: {},
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
        users: {resultPagesCount: 1},
        roles: {},
        permissions: {},
        tasks: {},
        projects: {},
        collections: {},
        languages: {},
        translation_values: {},
        translations: {},
    }
}

const data = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_STATUS_MSG:
            return Object.assign({}, state, {
                statuses: Object.assign({}, state.statuses, {
                    [action.dataType]: Object.keys(state.statuses[action.dataType]).reduce((acc, key) => {
                        if (action.msgOrIndex !== key) {
                            return {...acc, [key]: state.statuses[action.dataType][key]}
                        }
                        return acc;
                    }, {lastModified: new Date()})
                })
            })
        case UPDATE_DATA:
            if (action.nestedId) {
                return Object.assign({}, state, {
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: Object.assign({}, state[action.dataType][action.id], {
                            [action.nestedDataType]: Object.assign({}, state[action.dataType][action.id][action.nestedDataType], {
                                [action.nestedId]: action.data
                            })
                        })
                    }),
                })
            } else {
                return Object.assign({}, state, {
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: Object.assign({}, state[action.dataType][action.id], action.data)
                    }),
                })
            }
        case REMOVE_DATA:
            if (action.nestedId) {
                let nestedData = state[action.dataType][action.id][action.nestedDataType];
                if(nestedData) {
                    return Object.assign({}, state, {
                        statuses: updateStatus(state.statuses, action.nestedDataType, {lastModified: new Date()}),
                        [action.dataType]: Object.assign({}, state[action.dataType], {
                            [action.id]: Object.assign({}, state[action.dataType][action.id], {
                                [action.nestedDataType]: Object.keys(nestedData).reduce((acc, key) => {
                                    if (key !== action.nestedId.toString()) {
                                        return {...acc, [key]: nestedData[key]}
                                    }
                                    return acc;
                                }, {})
                            })
                        })
                    })
                } else {
                    return state;
                }
            } else if (action.nestedDataType) {
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.nestedDataType, {lastModified: new Date()}),
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: Object.assign({}, state[action.dataType][action.id], {
                            [action.nestedDataType]: {}
                        })
                    })
                })
            } else if (action.id) {
                if(state[action.dataType]) {
                    return Object.assign({}, state, {
                        statuses: updateStatus(state.statuses, action.dataType, {lastModified: new Date()}),
                        [action.dataType]: Object.keys(state[action.dataType]).reduce((acc, key) => {
                            if (key !== action.id.toString()) {
                                return {...acc, [key]: state[action.dataType][key]}
                            }
                            return acc;
                        }, {})
                    })
                } else {
                    return state;
                }
            } else if (action.dataType) {
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.dataType, {lastModified: new Date()}),
                    [action.dataType]: {}
                })
            } else {
                return state;
            }
        case REQUEST_DATA:
            if (action.nestedDataType) {
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.nestedDataType, {[`for_${action.dataType}_${action.id}`]: 'fetching'})
                })
            } else if (action.id) {
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.dataType, {[action.id]: 'fetching'}),
                })
            } else if (action.extraParams) {
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.dataType, {[action.extraParams]: 'fetching'}),
                })
            } else {
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.dataType, {all: 'fetching'}),
                })
            }
        case RECEIVE_DATA:
            if (action.extraId) { //for segments
                let statuses = updateStatus(state.statuses, action.nestedDataType, {[action.nestedId]: action.msg || `fetched-${new Date()}`});
                statuses = updateStatus(statuses, action.reloadDataType, {[action.reloadId]: `reload-${new Date()}`});
                return Object.assign({}, state, {
                    statuses: statuses,
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: Object.assign({}, state[action.dataType][action.id], {
                            [action.nestedDataType]: Object.assign({}, state[action.dataType][action.id][action.nestedDataType], {
                                [action.extraId]: Object.assign({}, state[action.dataType][action.id][action.nestedDataType][action.extraId], {
                                    [action.nestedId]: action.data,
                                })
                            })
                        })
                    })
                })
            } else if (action.nestedId) {
                let statuses = updateStatus(state.statuses, action.nestedDataType, {[action.nestedId]: action.msg || `fetched-${new Date()}`});
                statuses = updateStatus(statuses, action.reloadDataType, {[action.reloadId]: `reload-${new Date()}`});
                return Object.assign({}, state, {
                    statuses: statuses,
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: Object.assign({}, state[action.dataType][action.id], {
                            [action.nestedDataType]: Object.assign({}, state[action.dataType][action.id][action.nestedDataType], {
                                [action.nestedId]: action.data,
                            })
                        })
                    })
                })
            } else if (action.nestedDataType) {
                let statuses = updateStatus(state.statuses, action.nestedDataType, {[action.extraParams || `for_${action.dataType}_${action.id}`]: action.msg || `fetched-${new Date()}`});
                statuses = updateStatus(statuses, action.reloadDataType, {[action.reloadId]: `reload-${new Date()}`});
                statuses = updateStatus(statuses, action.nestedDataType, {resultPagesCount: action.resultPagesCount});
                let nestedData = (state[action.dataType] && state[action.dataType][action.id] && state[action.dataType][action.id][action.nestedDataType]) || {};
                return Object.assign({}, state, {
                    statuses: statuses,
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: Object.assign({}, state[action.dataType] && state[action.dataType][action.id], {
                            [action.nestedDataType]: (action.page === '1') ? action.data : Object.assign({}, nestedData, action.data)
                        })
                    })
                })
            } else if (action.id) {
                let statuses = updateStatus(state.statuses, action.dataType, {[action.id]: action.msg || `fetched-${new Date()}`});
                statuses = updateStatus(statuses, action.reloadDataType, {[action.reloadId]: `reload-${new Date()}`});
                return Object.assign({}, state, {
                    statuses: statuses,
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: state[action.dataType] ? Object.assign({}, state[action.dataType][action.id], action.data) : action.data
                    })
                })
            } else if (action.extraParams) {
                let statuses = updateStatus(state.statuses, action.dataType, {[action.extraParams]: action.msg || `fetched-${new Date()}`});
                statuses = updateStatus(statuses, action.reloadDataType, {[action.reloadId]: `reload-${new Date()}`});
                statuses = updateStatus(statuses, action.dataType, {resultPagesCount: action.resultPagesCount});
                return Object.assign({}, state, {
                    statuses: statuses,
                    [action.dataType]: (action.page === '1') ? action.data : Object.assign({}, state[action.dataType], action.data)
                })
            } else if (action.dataType) {
                let statuses = updateStatus(state.statuses, action.dataType, {all: action.msg || `fetched-${new Date()}`});
                statuses = updateStatus(statuses, action.reloadDataType, {[action.reloadId]: `reload-${new Date()}`});
                statuses = updateStatus(statuses, action.dataType, {resultPagesCount: action.resultPagesCount});
                return Object.assign({}, state, {
                    statuses: statuses,
                    [action.dataType]: (action.page === '1') ? action.data : Object.assign({}, state[action.dataType], action.data)
                })
            } else {
                return state;
            }

        default:
            return state;
    }
};

function updateStatus(statuses, dataType, messageObject) {
    if (dataType) {
        return Object.assign({}, statuses, {
            [dataType]: Object.assign({}, statuses[dataType], messageObject)
        })
    } else {
        return statuses;
    }
}

export default data;
