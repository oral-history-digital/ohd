import {
    AUTH_ERROR,
    CHANGED_PASSWORD,
    CHANGE_PASSWORD,
    CLEAR_REGISTRATION_STATUS,
    LOGGED_IN,
    LOGIN,
    LOGOUT,
    ORDERED_NEW_PASSWORD,
    ORDER_NEW_PASSWORD,
    REGISTER,
    REGISTERED,
    REGISTER_ERROR,
} from './action-types';

const user = (state = { isLoggedIn: false }, action) => {
    switch (action.type) {
        case LOGIN:
            return Object.assign({}, state, {
                isLoggingIn: true,
                error: null,
            });
        case LOGGED_IN:
            return Object.assign({}, state, {
                isLoggingIn: false,
                isLoggedIn: true,
                isLoggedOut: false,
                loggedInAt: Date.now(),
                firstName: action.firstName,
                lastName: action.lastName,
                email: action.email,
            });
        case AUTH_ERROR:
            return {
                error: action.error,
                active: action.active,
                email: action.email,
            };
        case LOGOUT:
            return Object.assign({}, state, {
                isLoggedIn: false,
                isLoggedOut: true,
                loggedInAt: false,
                firstName: false,
                lastName: false,
                email: false,
            });
        case REGISTER:
            return Object.assign({}, state, {
                isRegistering: true,
                registrationStatus: null,
                registered: false,
            });
        case REGISTERED:
            return Object.assign({}, state, {
                isRegistering: false,
                registered: true,
                registrationStatus: null,
            });
        case REGISTER_ERROR:
            return Object.assign({}, state, {
                isRegistering: false,
                registered: false,
                registrationStatus: action.registrationStatus,
            });
        case CLEAR_REGISTRATION_STATUS:
            return Object.assign({}, state, {
                registrationStatus: null,
            });
        case CHANGE_PASSWORD:
            return Object.assign({}, state, {
                isChangingPassword: true,
            });
        case CHANGED_PASSWORD:
            return Object.assign({}, state, {
                isChangingPassword: false,
                changePasswordStatus: action.changePasswordStatus,
            });
        case ORDER_NEW_PASSWORD:
            return Object.assign({}, state, {
                isOrderingNewPassword: true,
            });
        case ORDERED_NEW_PASSWORD:
            return Object.assign({}, state, {
                isOrderingNewPassword: false,
                orderNewPasswordStatus: 'ordered_new_password',
                error: null,
            });

        default:
            return state;
    }
};

export default user;
