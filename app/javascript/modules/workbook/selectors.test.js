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
