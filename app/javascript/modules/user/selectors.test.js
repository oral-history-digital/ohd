import { NAME } from './constants';
import * as selectors from './selectors';

const state = {
    [NAME]: {
       isLoggedIn: true,
       isLoggedOut: false,
       isLoggingIn: false,
       firstName: 'Alice',
       lastName: 'Henderson',
       email: 'alice@example.com',
       admin: true,
       loggedInAt: 1607584846364,
       error: null,
       registrationStatus: 'registered',
       orderNewPasswordStatus: 'ordered_new_password',
    },
};

test('getAccount retrieves whole user', () => {
    expect(selectors.getAccount(state)).toEqual(state[NAME]);
});

test('getIsLoggedIn retrieves login status', () => {
    expect(selectors.getIsLoggedIn(state)).toEqual(state[NAME].isLoggedIn);
});

test('getIsLoggedOut retrieves login status', () => {
    expect(selectors.getIsLoggedOut(state)).toEqual(state[NAME].isLoggedOut);
});

test('getIsLoggingIn retrieves wether just loggin in', () => {
    expect(selectors.getIsLoggingIn(state)).toEqual(state[NAME].isLoggingIn);
});

test('getFirstName retrieves first name of logged in person', () => {
    expect(selectors.getFirstName(state)).toEqual(state[NAME].firstName);
});

test('getLastName retrieves last name of logged in person', () => {
    expect(selectors.getLastName(state)).toEqual(state[NAME].lastName);
});

test('getEmail retrieves email of logged in person', () => {
    expect(selectors.getEmail(state)).toEqual(state[NAME].email);
});

test('getAdmin retrieves wether user is admin user', () => {
    expect(selectors.getAdmin(state)).toEqual(state[NAME].admin);
});

test('getLoggedInAt retrieves login time', () => {
    expect(selectors.getLoggedInAt(state)).toEqual(state[NAME].loggedInAt);
});

test('getLoginError retrieves login error', () => {
    expect(selectors.getLoginError(state)).toEqual(state[NAME].error);
});

test('getRegistrationStatus retrieves registration status text', () => {
    expect(selectors.getRegistrationStatus(state)).toEqual(state[NAME].registrationStatus);
});

test('getOrderNewPasswordStatus retrieves status for new password', () => {
    expect(selectors.getOrderNewPasswordStatus(state)).toEqual(state[NAME].orderNewPasswordStatus);
});
