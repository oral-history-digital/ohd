import * as selectors from './selectors';
import { NAME } from './constants';

const state = {
    [NAME]: {
        skipEmptyRows: false,
        columns: ['timecode', 'text_orig'],
    },
};

test('getSkipEmptyRows retrieves skipEmptyRows status', () => {
    expect(selectors.getSkipEmptyRows(state)).toEqual(state[NAME].skipEmptyRows);
});

test('getSelectedColumns retrieves selected interview table columns', () => {
    expect(selectors.getSelectedColumns(state)).toEqual(state[NAME].columns);
});
