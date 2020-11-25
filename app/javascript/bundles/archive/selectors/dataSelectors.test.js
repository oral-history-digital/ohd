import { getLanguages, getPeople, getStatuses, getPeopleStatus, getCollections,
    getCurrentAccount } from './dataSelectors';

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
        statuses: {
            people: {
                12: 'fetched',
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

test('getStatuses gets statuses object', () => {
    expect(getStatuses(state)).toStrictEqual({
        people: { 12: 'fetched' },
    });
});

test('getPeopleStatuses gets people statuses object', () => {
    expect(getPeopleStatus(state)).toStrictEqual({
        12: 'fetched',
    });
});

test('getCurrentAccount gets account object', () => {
    expect(getCurrentAccount(state)).toStrictEqual({
        id: 45,
    });
});
