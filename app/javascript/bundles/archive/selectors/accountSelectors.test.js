import { getIsLoggedIn } from './accountSelectors';

const state = {
    account: {
       isLoggedIn: true,
    },
};

test('getIsLoggedIn retrieves login status', () => {
    expect(getIsLoggedIn(state)).toEqual(state.account.isLoggedIn);
});
