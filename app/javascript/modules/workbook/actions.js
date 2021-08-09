import { CALL_API } from 'modules/api';

import {
    FETCH_WORKBOOK_STARTED,
    FETCH_WORKBOOK_SUCCEEDED,
    FETCH_WORKBOOK_FAILED,
} from './action-types';

export function fetchWorkbook(pathBase) {
    return {
        [CALL_API]: {
            types: [FETCH_WORKBOOK_STARTED, FETCH_WORKBOOK_SUCCEEDED, FETCH_WORKBOOK_FAILED],
            endpoint: `${pathBase}/user_contents`,
        },
    };
}
