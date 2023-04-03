import { Loader } from 'modules/api';

import {
    LOGIN,
    LOGGED_IN,
    AUTH_ERROR,
    LOGOUT,
    REGISTER,
    REGISTERED,
    CHANGE_PASSWORD,
    CHANGED_PASSWORD,
    ORDER_NEW_PASSWORD,
    ORDERED_NEW_PASSWORD,
} from './action-types';

const login = () => ({
    type: LOGIN,
})

const loggedIn = (json) => ({
    type: LOGGED_IN,
    firstName: json.first_name,
    lastName: json.last_name,
    email: json.email,
    login: json.login,
    admin: json.admin,
})

export function submitLogin(url, params) {
    return dispatch => {
        dispatch(login())
        Loader.post(url, params, dispatch, loggedIn, authError);
    }
}

const authError = json => ({
    type: AUTH_ERROR,
    error: json.error || 'devise.failure.invalid',
    active: json.active,
    email: json.email,
})

const logout = () => ({
    type: LOGOUT,
})

export function submitLogout(url) {
    return dispatch => {
        dispatch(logout())
        Loader.delete(url, dispatch, null);
    }
}

const register = () => ({
    type: REGISTER,
})

const registered = (json) => ({
    type: REGISTERED,
})

export function submitRegister(url, params) {
    return dispatch => {
        dispatch(register())
        Loader.post(url, params, dispatch, registered);
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

export function submitOrderNewPassword(url, params) {
    return dispatch => {
        dispatch(orderNewPassword())
        Loader.post(url, params, dispatch, orderedNewPassword, authError);
    }
}
