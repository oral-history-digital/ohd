import dotProp from 'dot-prop-immutable';
import * as selectors from './selectors';
import { NAME } from './constants';

const state = {
    [NAME]: {
        isLoading: false,
        error: null,
        data: {
            1: {
                id: 1,
                type: 'UserAnnotation',
                created_at: '2022-08-23T17:00:01.000+02:00',
            },
            2: {
                id: 2,
                type: 'Search',
                created_at: '2022-08-23T17:23:05.000+02:00',
            },
            3: {
                id: 3,
                type: 'InterviewReference',
                created_at: '2022-08-25T10:25:10.000+02:00',
            },
        },
    },
};

test('getWorkbookIsLoading retrieves loading state', () => {
    expect(selectors.getWorkbookIsLoading(state)).toEqual(state[NAME].isLoading);
});

test('getWorkbookData retrieves workbook data', () => {
    expect(selectors.getWorkbookData(state)).toEqual(state[NAME].data);
});

test('getSortedWorkbookData returns sorted workbook items', () => {
    const actual = selectors.getSortedWorkbookData(state);
    const expected = [
        state[NAME].data[3],
        state[NAME].data[2],
        state[NAME].data[1],
    ];
    expect(actual).toEqual(expected);
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

describe('getWorkbookLoaded', () => {
    test('is true if workbook has been loaded', () => {
        expect(selectors.getWorkbookLoaded(state)).toBeTruthy();
    });

    test('is false if workbook has not been loaded', () => {
        const _state = dotProp.set(state, `${NAME}.data`, undefined);
        expect(selectors.getWorkbookLoaded(_state)).toBeFalsy();
    });
});

test('getWorkbookError retrieves workbook error', () => {
    expect(selectors.getWorkbookError(state)).toEqual(state[NAME].error);
});
