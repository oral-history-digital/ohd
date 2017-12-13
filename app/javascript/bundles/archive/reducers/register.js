import {
    REQUEST_REGISTER_CONTENT,
    RECEIVE_REGISTER_CONTENT
} from '../constants/archiveConstants';

const initialState = {
    isFetchingRegisterContent: false,
    registerContent: {}
}

const register = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_REGISTER_CONTENT:
            return Object.assign({}, state, {
                isFetchingRegisterContent: true
            })
        case RECEIVE_REGISTER_CONTENT:
            return Object.assign({}, state, {
                isFetchingRegisterContent: false,
                registerContent: action.registerContent,
            })

        default:
            return state;
    }
};

export default register;

