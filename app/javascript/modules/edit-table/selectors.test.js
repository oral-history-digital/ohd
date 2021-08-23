import * as selectors from './selectors';
import { NAME } from './constants';

const state = {
    [NAME]: {
        filter: 'all',
        columns: ['timecode', 'text_orig'],
    },
};

test('getFilter retrieves current filter', () => {
    expect(selectors.getFilter(state)).toEqual(state[NAME].filter);
});

test('getSelectedColumns retrieves selected interview table columns', () => {
    expect(selectors.getSelectedColumns(state)).toEqual(state[NAME].columns);
});
