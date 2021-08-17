import { OPEN_POPUP, CLOSE_POPUP }  from './action-types';

export const openArchivePopup = (params={}) => {
    params['type'] = OPEN_POPUP;
    return params;
};

export const closeArchivePopup = () => ({
    type: CLOSE_POPUP,
});
