/**
 * Returns true if in XS oder S resolution
 * Style is set with media queries in utils.scss
 */

export default function isMobile() {
  return window.getComputedStyle(document.body, ':after').getPropertyValue('content').includes('S');
};
