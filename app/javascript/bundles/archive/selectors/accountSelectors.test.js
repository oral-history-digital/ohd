import * as selectors from './accountSelectors';

const state = {
    account: {
       isLoggedIn: true,
       isLoggedOut: false,
       isLoggingIn: false,
       firstName: 'Alice',
       lastName: 'Henderson',
       email: 'alice@example.com',
       admin: true,
       loggedInAt: 1607584846364,
       error: null,
    },
};

test('getIsLoggedIn retrieves login status', () => {
    expect(selectors.getIsLoggedIn(state)).toEqual(state.account.isLoggedIn);
});

test('getIsLoggedOut retrieves login status', () => {
    expect(selectors.getIsLoggedOut(state)).toEqual(state.account.isLoggedOut);
});

test('getIsLoggingIn retrieves wether just loggin in', () => {
    expect(selectors.getIsLoggingIn(state)).toEqual(state.account.isLoggingIn);
});

test('getFirstName retrieves first name of logged in person', () => {
    expect(selectors.getFirstName(state)).toEqual(state.account.firstName);
});

test('getLastName retrieves last name of logged in person', () => {
    expect(selectors.getLastName(state)).toEqual(state.account.lastName);
});

test('getEmail retrieves email of logged in person', () => {
    expect(selectors.getEmail(state)).toEqual(state.account.email);
});

test('getAdmin retrieves wether user is admin user', () => {
    expect(selectors.getAdmin(state)).toEqual(state.account.admin);
});

test('getLoggedInAt retrieves login time', () => {
    expect(selectors.getLoggedInAt(state)).toEqual(state.account.loggedInAt);
});

test('getLoginError retrieves login error', () => {
    expect(selectors.getLoginError(state)).toEqual(state.account.error);
});
