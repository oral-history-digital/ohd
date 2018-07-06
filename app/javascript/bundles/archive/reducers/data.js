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
            return Object.assign({}, state, {
                [action.dataType]: Object.assign({}, state[action.dataType], {
                    [action.id]: Object.assign({}, state[action.dataType][action.id], action.data)
                }),
            })
        case REMOVE_DATA:
            return Object.assign({}, state, {
                [action.dataType]: Object.assign({}, state[action.dataType], {
                    [action.id]: null
                })
            })
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
            if (action.nestedDataType) {
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
