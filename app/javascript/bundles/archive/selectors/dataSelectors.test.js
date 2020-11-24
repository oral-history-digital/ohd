import { getCurrentAccount } from './dataSelectors';

const state = {
    data: {
        accounts: {
            current: {
                id: 45,
            },
        },
    },
};

test('getCurrentAccount gets account object from state', () => {
    expect(getCurrentAccount(state)).toStrictEqual({
        id: 45,
    });
});
