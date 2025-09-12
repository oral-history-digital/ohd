import { BREAKPOINTS } from '../constants';

export function getScreenSize() {
    const width = window.innerWidth;

    if (width < BREAKPOINTS.xs) return 'xs';
    if (width < BREAKPOINTS.s) return 's';
    if (width < BREAKPOINTS.m) return 'm';
    if (width < BREAKPOINTS.l) return 'l';
    return 'xl';
}
