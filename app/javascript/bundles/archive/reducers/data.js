import { 
    ADD_DATA,
    UPDATE_DATA,
    REMOVE_DATA,
    REQUEST_DATA,
    RECEIVE_DATA,
    DELETE_PROCESS_MSG,
} from '../constants/archiveConstants';

const initialState = {
    statuses: {
        interviews: {},
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
    }
}

const data = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_PROCESS_MSG:
            let clone = state.statuses[action.dataType];
            delete clone.processing;
            delete clone.processed;
            clone.lastModified = new Date();
            return Object.assign({}, state, {
                statuses: Object.assign({}, state.statuses, {
                    [action.dataType]: clone
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
                clone = state[action.dataType][action.id][action.nestedDataType];
                delete clone[action.nestedId];
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.nestedDataType, {lastModified: new Date()}), 
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: Object.assign({}, state[action.dataType][action.id], {
                            [action.nestedDataType]: clone,
                        })
                    })
                })
            } else {
                clone = state[action.dataType];
                delete clone[action.id];
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.dataType, {lastModified: new Date()}), 
                    [action.dataType]: clone,
                })
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
            if (action.extraId) {
                let statuses = updateStatus(state.statuses, action.nestedDataType, {[action.nestedId]: `fetched-${new Date()}`});
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
                let statuses = updateStatus(state.statuses, action.nestedDataType, {[action.nestedId]: `fetched-${new Date()}`});
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
                let statuses = updateStatus(state.statuses, action.nestedDataType, {[`for_${action.dataType}_${action.id}`]: `fetched-${new Date()}`});
                statuses = updateStatus(statuses, action.reloadDataType, {[action.reloadId]: `reload-${new Date()}`});
                return Object.assign({}, state, {
                    statuses: statuses,
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: Object.assign({}, state[action.dataType][action.id], {
                            [action.nestedDataType]: Object.assign({}, state[action.dataType][action.id][action.nestedDataType], action.data)
                        })
                    })
                })
            } else if (action.id) {
                // if action comes with a msg (like 'processed') we use msg as id and the id instead of 'fetched'.
                // like this after submiting a form it can be checked if sth. is processed (the id is not known before for new objects)
                // and thus the form can be hidden
                //
                let statuses = updateStatus(state.statuses, action.dataType, {[action.msg || action.id]: `${action.msg ? action.id : 'fetched'}`});
                statuses = updateStatus(statuses, action.reloadDataType, {[action.reloadId]: `reload-${new Date()}`});
                return Object.assign({}, state, {
                    statuses: statuses,
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: state[action.dataType] ? Object.assign({}, state[action.dataType][action.id], action.data) : action.data
                    })
                })
            } else if (action.extraParams) {
                let statuses = updateStatus(state.statuses, action.dataType, {[action.extraParams]: `fetched-${new Date()}`}); 
                statuses = updateStatus(statuses, action.reloadDataType, {[action.reloadId]: `reload-${new Date()}`}); 
                return Object.assign({}, state, {
                    statuses: statuses,
                    [action.dataType]: Object.assign({}, state[action.dataType], action.data)
                })
            } else if (action.dataType) {
                let statuses = updateStatus(state.statuses, action.dataType, {all: `fetched-${new Date()}`});
                statuses = updateStatus(statuses, action.reloadDataType, {[action.reloadId]: `reload-${new Date()}`}); 
                return Object.assign({}, state, {
                    statuses: statuses,
                    [action.dataType]: action.data
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
