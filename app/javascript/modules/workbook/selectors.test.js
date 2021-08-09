import * as selectors from './selectors';
import { NAME } from './constants';

const state = {
    [NAME]: {
        isLoading: false,
        error: null,
        data: {
            1: 'dummy',
        },
    },
};

test('getWorkbookIsLoading retrieves loading state', () => {
    expect(selectors.getWorkbookIsLoading(state)).toEqual(state[NAME].isLoading);
});

test('getWorkbookData retrieves workbook data', () => {
    expect(selectors.getWorkbookData(state)).toEqual(state[NAME].data);
});

test('getWorkbookError retrieves workbook error', () => {
    expect(selectors.getWorkbookError(state)).toEqual(state[NAME].error);
});
