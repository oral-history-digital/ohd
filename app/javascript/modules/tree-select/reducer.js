import { REQUEST_REGISTRY_TREE, RECEIVE_REGISTRY_TREE, ERROR_REGISTRY_TREE } from './action-types';

export const initialState = {
    data: null,
    loading: false,
    error: null,
};

export default function registryTree(state = initialState, action) {
    switch (action.type) {
        case REQUEST_REGISTRY_TREE:
            return {
                ...state,
                data: null,
                loading: true,
                error: null,
            };
        case RECEIVE_REGISTRY_TREE:
            return {
                ...state,
                data: action.payload.treeData,
                loading: false,
            };
        case ERROR_REGISTRY_TREE:
            return {
                ...state,
                data: null,
                loading: false,
                error: 'error',
            };
        default:
            return state;
    }
}
