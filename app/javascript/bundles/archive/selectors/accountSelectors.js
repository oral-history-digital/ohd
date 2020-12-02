const getAccount = state => state.account;

export const getIsLoggedIn = state => getAccount(state).isLoggedIn;
