import { SET_FILTER, SET_COLUMNS }
    from './action-types';

export const setFilter = filter => ({
    type: SET_FILTER,
    payload: filter,
});

export const setColumns = columns => ({
    type: SET_COLUMNS,
    payload: columns,
});
