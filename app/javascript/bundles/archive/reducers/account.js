import { 
    REQUEST_ACCOUNT,
    RECEIVE_ACCOUNT,

    LOGIN,
    LOGGED_IN,
    AUTH_ERROR,
    SUBMIT_LOGIN,

    LOGOUT,
    SUBMIT_LOGOUT,

    REGISTER,
    REGISTERED,
    SUBMIT_REGISTER,

    CHANGE_PASSWORD,
    CHANGED_PASSWORD,
    SUBMIT_CHANGE_PASSWORD,
} from '../constants/archiveConstants';

const account = (state = {}, action) => {
    switch (action.type) {
        case REQUEST_ACCOUNT:
            return Object.assign({}, state, {
                isFetchingAccount: true,
            })
        case RECEIVE_ACCOUNT:
            return Object.assign({}, state, {
                isFetchingAccount: false,
                firstName: action.firstName,
                lastName: action.lastName,
                email: action.email,
                //login: action.login,
            })
        case LOGIN:
            return Object.assign({}, state, {
                isLoggingIn: true,
            })
        case LOGGED_IN:
            return Object.assign({}, state, {
                isLoggingIn: false,
                isLoggedIn: true,
                firstName: action.firstName,
                lastName: action.lastName,
                email: action.email,
                //login: action.login,
            })
        case AUTH_ERROR:
            return {error: action.error} 
        case LOGOUT:
            return {} 
        case REGISTER:
            return Object.assign({}, state, {
                isRegistering: true
            })
        case REGISTERED:
            return Object.assign({}, state, {
                isRegistering: false,
                registrationStatus: action.registrationStatus
            })
        case CHANGE_PASSWORD:
            return Object.assign({}, state, {
                isChangingPassword: true
            })
        case CHANGED_PASSWORD:
            return Object.assign({}, state, {
                isChangingPassword: false,
                changePasswordStatus: action.changePasswordStatus
            })

        default:
            return state;
    }
};

export default account;
