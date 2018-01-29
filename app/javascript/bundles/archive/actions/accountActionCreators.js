/* eslint-disable import/prefer-default-export */

import Loader from '../../../lib/loader'

import { 
    REQUEST_ACCOUNT,
    RECEIVE_ACCOUNT,
    ACCOUNT_URL,

    LOGIN,
    LOGGED_IN,
    AUTH_ERROR,
    SUBMIT_LOGIN,
    LOGIN_URL,

    LOGOUT,
    SUBMIT_LOGOUT,
    LOGOUT_URL,

    REGISTER,
    REGISTERED,
    SUBMIT_REGISTER,
    REGISTER_URL,

    CHANGE_PASSWORD,
    CHANGED_PASSWORD,
    SUBMIT_CHANGE_PASSWORD,
    CHANGE_PASSWORD_URL,

    ORDER_NEW_PASSWORD,
    ORDERED_NEW_PASSWORD,
    ORDER_NEW_PASSWORD_URL
} from '../constants/archiveConstants';

const requestAccount = () => ({
    type: REQUEST_ACCOUNT,
});

const receiveAccount = (json) => ({
    type: RECEIVE_ACCOUNT,
    firstName: json.first_name,
    lastName: json.last_name,
    email: json.email,
    login: json.login,
});

export function fetchAccount() {
    return dispatch => {
        dispatch(requestAccount())
        Loader.getJson(ACCOUNT_URL, null, dispatch, receiveAccount);
    }
}

const login = () => ({
    type: LOGIN,
})

const loggedIn = (json) => ({
    type: LOGGED_IN,
    firstName: json.first_name,
    lastName: json.last_name,
    email: json.email,
    login: json.login,
})

export function submitLogin(params) {
    return dispatch => {
        dispatch(login())
        Loader.post(LOGIN_URL, params, dispatch, loggedIn, authError);
    }
}

const authError = (json) => ({
        type: AUTH_ERROR,
        error: json.error
})

const logout = () => ({
        type: LOGOUT,
})

export function submitLogout() {
    return dispatch => {
        dispatch(logout())
        Loader.delete(LOGOUT_URL, dispatch, null);
    }
}

const register = () => ({
        type: REGISTER,
})

const registered = (json) => ({
        type: REGISTERED,
        registrationStatus: json.registration_status
})

export function submitRegister(params) {
    return dispatch => {
        dispatch(register())
        Loader.post(REGISTER_URL, params, dispatch, registered);
    }
}

const changePassword = () => ({
        type: CHANGE_PASSWORD,
})

const changedPassword = (json) => ({
        type: CHANGED_PASSWORD,
        changePasswordStatus: json
})

export function submitChangePassword(url, method, params) {
    return dispatch => {
        dispatch(changePassword());
        if(method === 'post') {
            Loader.post(url, params, dispatch, loggedIn, authError);
        } else {
            Loader.put(url, params, dispatch, loggedIn, authError);
        }
    }
}

const orderNewPassword = () => ({
        type: ORDER_NEW_PASSWORD,
})

const orderedNewPassword = (json) => ({
        type: ORDERED_NEW_PASSWORD,
        //orderNewPasswordStatus: json
})

export function submitOrderNewPassword(params) {
    return dispatch => {
        dispatch(orderNewPassword())
        Loader.post(ORDER_NEW_PASSWORD_URL, params, dispatch, orderedNewPassword, authError);
    }
}

