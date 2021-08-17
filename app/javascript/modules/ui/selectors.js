import { NAME } from './constants';

export const getPopup = state => state[NAME];

export const getPopupShow = state => getPopup(state).show;
