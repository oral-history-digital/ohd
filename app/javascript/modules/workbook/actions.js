import { CALL_API } from 'modules/api';

import {
    FETCH_WORKBOOK_STARTED,
    FETCH_WORKBOOK_SUCCEEDED,
    FETCH_WORKBOOK_FAILED,
    DELETE_WORKBOOK_STARTED,
    DELETE_WORKBOOK_SUCCEEDED,
    DELETE_WORKBOOK_FAILED,
} from './action-types';

export function fetchWorkbook(pathBase) {
    return {
        [CALL_API]: {
            types: [FETCH_WORKBOOK_STARTED, FETCH_WORKBOOK_SUCCEEDED, FETCH_WORKBOOK_FAILED],
            endpoint: `${pathBase}/user_contents`,
        },
    };
}

export function deleteWorkbook(pathBase, id) {
    return {
        [CALL_API]: {
            types: [DELETE_WORKBOOK_STARTED, DELETE_WORKBOOK_SUCCEEDED, DELETE_WORKBOOK_FAILED],
            method: 'DELETE',
            endpoint: `${pathBase}/user_contents/${id}`,
        },
    };
}
