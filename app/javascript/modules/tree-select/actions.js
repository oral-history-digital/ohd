import { Loader } from 'modules/api';

import { REQUEST_REGISTRY_TREE, RECEIVE_REGISTRY_TREE, ERROR_REGISTRY_TREE } from './action-types';

const requestRegistryTree = () => ({
  type: REQUEST_REGISTRY_TREE,
});

const receiveRegistryTree = (json) => ({
    type: RECEIVE_REGISTRY_TREE,
    payload: {
        treeData: json,
    },
});

const errorRegistryTree = (error) => ({
    type: ERROR_REGISTRY_TREE,
    error,
});

export const fetchRegistryTree = () => {
    return (dispatch, getState) => {
        // TODO: Use local when response is delivered with locale as metadata.
        //const locale = getState().archive.locale;

        const url = `/de/registry_entry_tree.json`;

        dispatch(requestRegistryTree());

        Loader.getJson(url, null, dispatch, receiveRegistryTree);
    };
};
