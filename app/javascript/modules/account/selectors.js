import { NAME } from './constants';

const getState = state => state[NAME];

export const getIsLoggedIn = state => getState(state).isLoggedIn;

export const getIsLoggedOut = state => getState(state).isLoggedOut;

export const getIsLoggingIn = state => getState(state).isLoggingIn;

export const getFirstName = state => getState(state).firstName;

export const getLastName = state => getState(state).lastName;

export const getEmail = state => getState(state).email;

export const getAdmin = state => getState(state).admin;

export const getLoggedInAt = state => getState(state).loggedInAt;

export const getLoginError = state => getState(state).error;

export const getRegistrationStatus = state => getState(state).registrationStatus;

export const getOrderNewPasswordStatus = state => getState(state).orderNewPasswordStatus;
