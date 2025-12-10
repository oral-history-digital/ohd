/**
 * Media query functions
 */

export const SCREEN_WIDTH_BELOW_M = 0;
export const SCREEN_WIDTH_ABOVE_M = 1;
export const SCREEN_WIDTH_ABOVE_XL = 2;

const BREAKPOINT_XS = 480;
const BREAKPOINT_S = 520;
const BREAKPOINT_M = 768;
const BREAKPOINT_L = 990;
const BREAKPOINT_XL = 1200;

export function currentScreenWidth() {
    if (window.matchMedia(`(min-width: ${BREAKPOINT_M}px)`).matches) {
        if (window.matchMedia(`(min-width: ${BREAKPOINT_XL}px)`).matches) {
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
