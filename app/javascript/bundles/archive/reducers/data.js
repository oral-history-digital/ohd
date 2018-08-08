import { 
    ADD_DATA,
    UPDATE_DATA,
    REMOVE_DATA,
    REQUEST_DATA,
    RECEIVE_DATA,
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
    }
}

const data = (state = initialState, action) => {
    switch (action.type) {
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
            let clone;
            if (action.nestedId) {
                clone = state[action.dataType][action.id][action.nestedDataType];
                delete clone[action.nestedId];
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.nestedDataType, {last_deleted: new Date()}), 
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
                    statuses: updateStatus(state.statuses, action.dataType, {last_deleted: new Date()}), 
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
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.nestedDataType, {[action.nestedId]: `fetched-${new Date()}`}), 
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
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.nestedDataType, {[action.nestedId]: `fetched-${new Date()}`}), 
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: Object.assign({}, state[action.dataType][action.id], {
                            [action.nestedDataType]: Object.assign({}, state[action.dataType][action.id][action.nestedDataType], {
                                [action.nestedId]: action.data,
                            })
                        })
                    })
                })
            } else if (action.nestedDataType) {
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.nestedDataType, {[`for_${action.dataType}_${action.id}`]: `fetched-${new Date()}`}), 
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: Object.assign({}, state[action.dataType][action.id], {
                            [action.nestedDataType]: Object.assign({}, state[action.dataType][action.id][action.nestedDataType], action.data)
                        })
                    })
                })
            } else if (action.id) {
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.dataType, {[action.id]: `fetched-${new Date()}`}), 
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: state[action.dataType] ? Object.assign({}, state[action.dataType][action.id], action.data) : action.data
                    })
                })
            } else if (action.extraParams) {
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.dataType, {[action.extraParams]: `fetched-${new Date()}`}), 
                    [action.dataType]: Object.assign({}, state[action.dataType], action.data)
                })
            } else if (action.dataType) {
                return Object.assign({}, state, {
                    statuses: updateStatus(state.statuses, action.dataType, {all: `fetched-${new Date()}`}), 
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
    return Object.assign({}, statuses, {
        [dataType]: Object.assign({}, statuses[dataType], messageObject)
    })
}

export default data;
