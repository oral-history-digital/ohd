import dotProp from 'dot-prop-immutable';
import * as selectors from './selectors';
import { NAME } from './constants';

const state = {
    data: {
        accounts: {
            current: {
                id: 3,
            },
        },
    },
    [NAME]: {
        isLoading: false,
        error: null,
        data: {
            1: 'dummy',
        },
        userAccountId: 3,
    },
};

test('getWorkbookIsLoading retrieves loading state', () => {
    expect(selectors.getWorkbookIsLoading(state)).toEqual(state[NAME].isLoading);
});

test('getWorkbookData retrieves workbook data', () => {
    expect(selectors.getWorkbookData(state)).toEqual(state[NAME].data);
});

test('getWorkbookAccountId retrieves workbook account id', () => {
    expect(selectors.getWorkbookAccountId(state)).toEqual(state[NAME].userAccountId);
});

describe('getWorkbookLoaded', () => {
    test('is true if correct workbook has been loaded', () => {
        expect(selectors.getWorkbookLoaded(state)).toBeTruthy();
    });

    test('is false if wrong workbook has been loaded', () => {
        const _state = dotProp.set(state, 'data.accounts.current.id', 1);

        expect(selectors.getWorkbookLoaded(_state)).toBeFalsy();
    });
});

test('getWorkbookError retrieves workbook error', () => {
    expect(selectors.getWorkbookError(state)).toEqual(state[NAME].error);
});
