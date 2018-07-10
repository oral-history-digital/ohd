import { 
    ADD_DATA,
    UPDATE_DATA,
    REMOVE_DATA,
    REQUEST_DATA,
    RECEIVE_DATA,
} from '../constants/archiveConstants';

const initialState = {}

const data = (state = initialState, action) => {
    switch (action.type) {
        //case ADD_DATA:
            //return Object.assign({}, state, {
                //[action.dataType]: Object.assign({}, state[action.dataType], {
                    //[action.id]: action.data
                //}),
            //})
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
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: Object.assign({}, state[action.dataType][action.id], {
                            [action.nestedDataType]: clone,
                            [`${action.dataType}_last_deleted`]: new Date(),
                        })
                    })
                })
            } else {
                clone = state[action.dataType];
                delete clone[action.id];
                return Object.assign({}, state, {
                    [action.dataType]: clone,
                    [`${action.dataType}_last_deleted`]: new Date(),
                })
            }
        case REQUEST_DATA:
            if (action.nestedDataType) {
                return Object.assign({}, state, {
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: Object.assign({}, state[action.dataType][action.id], {
                            [`${action.nestedDataType}_status`]: 'fetching',
                        })
                    })
                })
            } else if (action.id) {
                return Object.assign({}, state, {
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [`${action.dataType}_${action.id}_status`]: 'fetching',
                    })
                })
            } else {
                return Object.assign({}, state, {
                    [`${action.dataType}_status`]: 'fetching',
                })
            }
        case RECEIVE_DATA:
            if (action.nestedId) {
                return Object.assign({}, state, {
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: Object.assign({}, state[action.dataType][action.id], {
                            [action.nestedDataType]: Object.assign({}, state[action.dataType][action.id][action.nestedDataType], {
                                [action.nestedId]: action.data,
                                [`${action.nestedDataType}_${action.nestedId}_status`]: 'fetched',
                            })
                        })
                    })
                })
            } else if (action.nestedDataType) {
                return Object.assign({}, state, {
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [action.id]: Object.assign({}, state[action.dataType][action.id], {
                            [`${action.nestedDataType}_status`]: 'fetched',
                            [action.nestedDataType]: action.data,
                        })
                    })
                })
            } else if (action.id) {
                return Object.assign({}, state, {
                    [action.dataType]: Object.assign({}, state[action.dataType], {
                        [`${action.dataType}_${action.id}_status`]: 'fetched',
                        [action.id]: state[action.dataType] ? Object.assign({}, state[action.dataType][action.id], action.data) : action.data
                    })
                })
            } else {
                return Object.assign({}, state, {
                    [`${action.dataType}_status`]: 'fetched',
                    [action.dataType]: action.data
                })
            }

        default:
            return state;
    }
};

export default data;
