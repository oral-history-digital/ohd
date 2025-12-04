import { NAME } from './constants';

export const getBanner = (state) => {
    return state[NAME];
};

export const getBannerActive = (state) => getBanner(state).active;
