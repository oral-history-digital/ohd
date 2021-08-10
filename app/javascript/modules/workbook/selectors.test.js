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
            1: {
                id: 1,
                type: 'UserAnnotation',
            },
            2: {
                id: 2,
                type: 'Search',
            },
            3: {
                id: 3,
                type: 'InterviewReference',
            },
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

test('getWorkbookAnnotations retrieves user annotations', () => {
    expect(selectors.getWorkbookAnnotations(state)).toEqual([state[NAME].data[1]]);
});

test('getWorkbookSearches retrieves saved searches', () => {
    expect(selectors.getWorkbookSearches(state)).toEqual([state[NAME].data[2]]);
});

test('getWorkbookInterviews retrieves saved interviews', () => {
    expect(selectors.getWorkbookInterviews(state)).toEqual([state[NAME].data[3]]);
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
