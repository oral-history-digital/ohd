import { NAME } from './constants';

export const getSidebar = state => state[NAME];

export const getSidebarVisible = state => getSidebar(state).visible;

export const getSidebarIndex = state => getSidebar(state).index;
