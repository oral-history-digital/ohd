export { NAME as POPUP_NAME } from './constants';

export { openArchivePopup, closeArchivePopup } from './actions';

export { default as popupReducer } from './reducer';

export { getPopupShow } from './selectors';

export { default as Modal } from './components/Modal';
export { default as ArchivePopupContainer } from './components/ArchivePopupContainer';
export { default as ArchivePopupButton } from './components/ArchivePopupButton';
