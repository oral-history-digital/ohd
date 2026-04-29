import { SCREEN_M, SCREEN_XL } from 'modules/constants';

export const SCREEN_WIDTH_BELOW_M = 0;
export const SCREEN_WIDTH_ABOVE_M = 1;
export const SCREEN_WIDTH_ABOVE_XL = 2;

export function currentScreenWidth() {
    if (window.matchMedia(`(min-width: ${SCREEN_M}px)`).matches) {
        if (window.matchMedia(`(min-width: ${SCREEN_XL}px)`).matches) {
            return SCREEN_WIDTH_ABOVE_XL;
        } else {
            return SCREEN_WIDTH_ABOVE_M;
        }
    } else {
        return SCREEN_WIDTH_BELOW_M;
    }
}

export function isMobile() {
    return currentScreenWidth() === SCREEN_WIDTH_BELOW_M;
}
