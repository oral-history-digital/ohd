/* eslint-disable import/prefer-default-export */

import { 
    OPEN_POPUP,
    CLOSE_POPUP
} from '../constants/archiveConstants';

export const openArchivePopup = (params={}) => {
    params['type'] = OPEN_POPUP;
    return params;
};

export const closeArchivePopup = () => ({
    type: CLOSE_POPUP,
});


