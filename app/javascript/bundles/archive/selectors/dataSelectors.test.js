import { getLanguages, getPeople, getCollections, getCurrentAccount } from './dataSelectors';

const state = {
    data: {
        accounts: {
            current: {
                id: 45,
            },
        },
        collections: {
            1: {
                id: 1,
                type: 'Collection',
            },
        },
        people: {
            4: {
                id: 4,
                type: 'Person',
            },
        },
        languages: {
            2: {
                id: 2,
                type: 'Language',
            },
        },
    },
};

test('getLanguages gets languages object', () => {
    expect(getLanguages(state)).toStrictEqual({
        2: { id: 2, type: 'Language' },
    });
});

test('getCollections gets collections object', () => {
    expect(getCollections(state)).toStrictEqual({
        1: { id: 1, type: 'Collection' },
    });
});

test('getPeople gets people object', () => {
    expect(getPeople(state)).toStrictEqual({
        4: { id: 4, type: 'Person' },
    });
});

test('getCurrentAccount gets account object', () => {
    expect(getCurrentAccount(state)).toStrictEqual({
        id: 45,
    });
});
