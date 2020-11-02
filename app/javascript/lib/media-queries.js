/**
 * Media query functions
 */

export const SCREEN_WIDTH_NARROW = 0;
export const SCREEN_WIDTH_MEDIUM = 1;
export const SCREEN_WIDTH_WIDE   = 2;

export function currentScreenWidth() {
  if (window.matchMedia('(min-width: 768px)').matches) {
    if (window.matchMedia('(min-width: 1200px)').matches) {
      return SCREEN_WIDTH_WIDE;
    } else {
      return SCREEN_WIDTH_MEDIUM;
    }
  } else {
    return SCREEN_WIDTH_NARROW;
  }
}

export function isMobile() {
  return currentScreenWidth() === SCREEN_WIDTH_NARROW;
}
