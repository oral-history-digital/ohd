const getAccount = state => state.account;

export const getIsLoggedIn = state => getAccount(state).isLoggedIn;

export const getIsLoggedOut = state => getAccount(state).isLoggedOut;

export const getIsLoggingIn = state => getAccount(state).isLoggingIn;

export const getFirstName = state => getAccount(state).firstName;

export const getLastName = state => getAccount(state).lastName;

export const getEmail = state => getAccount(state).email;

export const getAdmin = state => getAccount(state).admin;

export const getLoggedInAt = state => getAccount(state).loggedInAt;

export const getLoginError = state => getAccount(state).error;
