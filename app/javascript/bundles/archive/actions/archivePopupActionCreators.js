/* eslint-disable import/prefer-default-export */

import { 
    OPEN_POPUP,
    CLOSE_POPUP
} from '../constants/archiveConstants';

//export const openArchivePopup = (title, content, className, closeOnOverlayClick, buttons ) => ({
export const openArchivePopup = (params={}) => {
    params['type'] = OPEN_POPUP;
    return params;
    //type: OPEN_POPUP,
    //show: true,
    //title: title,
    //content: content,
    //className: className,
    //closeOnOverlayClick: closeOnOverlayClick,
    //buttons: buttons
};

export const closeArchivePopup = () => ({
    type: CLOSE_POPUP,
});


