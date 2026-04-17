import { Loader } from 'modules/api';

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
import { normalizeRegisterErrorMessage } from './utils';

const login = () => ({
    type: LOGIN,
});

const loggedIn = (json) => ({
    type: LOGGED_IN,
    firstName: json.first_name,
    lastName: json.last_name,
    email: json.email,
    login: json.login,
    admin: json.admin,
});

export function submitLogin(url, params) {
    return (dispatch) => {
        dispatch(login());
        Loader.post(url, params, dispatch, loggedIn, authError);
    };
}

const authError = (json) => ({
    type: AUTH_ERROR,
    error: json.error || 'devise.failure.invalid',
    active: json.active,
    email: json.email,
});

const logout = () => ({
    type: LOGOUT,
});

export function submitLogout(url) {
    return (dispatch) => {
        dispatch(logout());
        Loader.delete(url, dispatch, null);
    };
}

const register = () => ({
    type: REGISTER,
});

const registered = () => ({
    type: REGISTERED,
});

const registerError = (json, translate) => ({
    type: REGISTER_ERROR,
    registrationStatus: normalizeRegisterErrorMessage(json, translate),
});

export const clearRegistrationStatus = () => ({
    type: CLEAR_REGISTRATION_STATUS,
});

export function submitRegister(url, params, translate = (message) => message) {
    return (dispatch) => {
        dispatch(register());
        Loader.post(url, params, dispatch, registered, (json) =>
            registerError(json, translate)
        );
    };
}

const changePassword = () => ({
    type: CHANGE_PASSWORD,
});

const changedPassword = (json) => ({
    type: CHANGED_PASSWORD,
    changePasswordStatus: json,
});

export function submitChangePassword(url, method, params) {
    return (dispatch) => {
        dispatch(changePassword());
        if (method === 'post') {
            Loader.post(url, params, dispatch, changedPassword, authError);
        } else {
            Loader.put(url, params, dispatch, changedPassword, authError);
        }
    };
}

const orderNewPassword = () => ({
    type: ORDER_NEW_PASSWORD,
});

const orderedNewPassword = () => ({
    type: ORDERED_NEW_PASSWORD,
});

export function submitOrderNewPassword(url, params) {
    return (dispatch) => {
        dispatch(orderNewPassword());
        Loader.post(url, params, dispatch, orderedNewPassword, authError);
    };
}
