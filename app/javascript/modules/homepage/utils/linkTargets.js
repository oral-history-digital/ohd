/**
 * Some targets like the login page cannot be reached via React Router
 * so we need to check for those targets
 */

const EXTERNAL_TARGETS = ['/users/sign_in'];
const DISABLED_WHEN_LOGGED_IN_TARGETS = ['/users/sign_in', '/register'];

export const isExternalTarget = (target) => EXTERNAL_TARGETS.includes(target);

export const isDisabledWhenLoggedIn = (target, isLoggedIn) =>
    DISABLED_WHEN_LOGGED_IN_TARGETS.includes(target) && isLoggedIn;
