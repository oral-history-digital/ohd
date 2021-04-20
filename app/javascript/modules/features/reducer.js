import { saveState } from 'modules/persistence';
import { TREE_SELECT_NAME } from 'modules/tree-select';
import { ENABLE, DISABLE } from './action-types';
import { NAME } from './constants';

export const initialState = {
    [TREE_SELECT_NAME]: true,
};

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
