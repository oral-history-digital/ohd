import { 
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

    ORDER_NEW_PASSWORD,
    ORDERED_NEW_PASSWORD,
    ORDER_NEW_PASSWORD_URL
} from '../constants/archiveConstants';

const account = (state = {}, action) => {
    switch (action.type) {
        case LOGIN:
            return Object.assign({}, state, {
                isLoggingIn: true,
                error: null,
            })
        case LOGGED_IN:
            return Object.assign({}, state, {
                isLoggingIn: false,
                isLoggedIn: true,
                loggedInAt: Date.now(),
                firstName: action.firstName,
                lastName: action.lastName,
                email: action.email,
                admin: action.admin,
                //login: action.login,
            })
        case AUTH_ERROR:
            return {
                error: action.error,
                active: action.active,
                email: action.email,
            } 
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
        case ORDER_NEW_PASSWORD:
            return Object.assign({}, state, {
                isOrderingNewPassword: true
            })
        case ORDERED_NEW_PASSWORD:
            return Object.assign({}, state, {
                isOrderingNewPassword: false,
                orderNewPasswordStatus: 'ordered_new_password',
                error: null
            })

        default:
            return state;
    }
};

export default account;
