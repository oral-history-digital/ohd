import { DISABLE, ENABLE } from './action-types';

export const enable = (name) => ({
    type: ENABLE,
    payload: { name },
});

export const disable = (name) => ({
    type: DISABLE,
    payload: { name },
});
