import { saveState } from 'modules/persistence';
import { ENABLE, DISABLE } from './action-types';
import { NAME } from './constants';

export const initialState = {};

const features = (state = initialState, action) => {
    let nextState;
    switch (action.type) {
        case ENABLE:
            nextState = {
                ...state,
                [action.payload.name]: true,
            };
            saveState(NAME, nextState);
            return nextState;
        case DISABLE:
            nextState = {
                ...state,
                [action.payload.name]: false,
            };
            saveState(NAME, nextState);
            return nextState;
        default:
            return state;
    }
};

export default features;
