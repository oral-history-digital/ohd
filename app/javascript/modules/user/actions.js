import { Loader } from 'modules/api';

import {
    AUTH_ERROR,
    CHANGED_PASSWORD,
    CHANGE_PASSWORD,
    LOGGED_IN,
    LOGIN,
    LOGOUT,
    ORDERED_NEW_PASSWORD,
    ORDER_NEW_PASSWORD,
    REGISTER,
    REGISTERED,
} from './action-types';

const login = () => ({
    type: LOGIN,
});

const loginAfterPasswordChange = (json) => {
    return (dispatch) => {
        dispatch(loggedIn(json.user));
        dispatch(changedPassword(json));
    };
};

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

const registered = (json) => ({
    type: REGISTERED,
});

export function submitRegister(url, params) {
    return (dispatch) => {
        dispatch(register());
        Loader.post(url, params, dispatch, registered);
    };
}

const changePassword = () => ({
    type: CHANGE_PASSWORD,
});

const changedPassword = (json) => ({
    type: CHANGED_PASSWORD,
    changePasswordStatus: json,
    redirectUrl: json.redirect_url,
});

export function submitChangePassword(url, method, params) {
    return (dispatch) => {
        dispatch(changePassword());
        if (method === 'post') {
            Loader.post(
                url,
                params,
                dispatch,
                loginAfterPasswordChange,
                authError
            );
        } else {
            Loader.put(
                url,
                params,
                dispatch,
                loginAfterPasswordChange,
                authError
            );
        }
    };
}

const orderNewPassword = () => ({
    type: ORDER_NEW_PASSWORD,
});

const orderedNewPassword = (json) => ({
    type: ORDERED_NEW_PASSWORD,
    //orderNewPasswordStatus: json
});

export function submitOrderNewPassword(url, params) {
    return (dispatch) => {
        dispatch(orderNewPassword());
        Loader.post(url, params, dispatch, orderedNewPassword, authError);
    };
}
