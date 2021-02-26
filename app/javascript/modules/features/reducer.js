import { TREE_SELECT_NAME } from 'modules/tree-select';
import { ENABLE, DISABLE } from './action-types';

export const initialState = {
    [TREE_SELECT_NAME]: false,
};

const features = (state = initialState, action) => {
    switch (action.type) {
    case ENABLE:
        return {
            ...state,
            [action.payload.name]: true,
        };
    case DISABLE:
        return {
            ...state,
            [action.payload.name]: false,
        };
    default:
        return state;
    }
};

export default features;
