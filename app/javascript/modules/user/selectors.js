import { NAME } from './constants';

export const getAccount = state => state[NAME];

export const getIsLoggedIn = state => getAccount(state).isLoggedIn;

export const getIsLoggedOut = state => getAccount(state).isLoggedOut;

export const getIsLoggingIn = state => getAccount(state).isLoggingIn;

export const getCheckedOhdSession = state => getAccount(state).checkedOhdSession;

export const getFirstName = state => getAccount(state).firstName;

export const getLastName = state => getAccount(state).lastName;

export const getEmail = state => getAccount(state).email;

export const getAdmin = state => getAccount(state).admin;

export const getLoggedInAt = state => getAccount(state).loggedInAt;

export const getLoginError = state => getAccount(state).error;

export const getRegistrationStatus = state => getAccount(state).registrationStatus;

export const getIsRegistered = state => getAccount(state).registered;

export const getOrderNewPasswordStatus = state => getAccount(state).orderNewPasswordStatus;

export const getChangePasswordStatus = state => getAccount(state).changePasswordStatus;
