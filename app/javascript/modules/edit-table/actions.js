import { SET_SKIP_EMPTY_ROWS, SET_COLUMNS }
    from './action-types';

export const setSkipEmptyRows = skipEmptyRows => ({
    type: SET_SKIP_EMPTY_ROWS,
    payload: skipEmptyRows,
});

export const setColumns = params => ({
    type: SET_COLUMNS,
    payload: params,
});
