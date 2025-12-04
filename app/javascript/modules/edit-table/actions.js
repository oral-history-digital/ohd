import { setCookie } from 'modules/persistence';

import { SET_COLUMNS, SET_FILTER } from './action-types';

export const setFilter = (filter) => ({
    type: SET_FILTER,
    payload: filter,
});

const setColumns = (columns) => ({
    type: SET_COLUMNS,
    payload: columns,
});
export const setColumnsWithCookie = (columns) => (dispatch) => {
    dispatch(setColumns(columns));
    setCookie('editTableColumns', JSON.stringify(columns), 3);
};
