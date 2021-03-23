import { createSelector } from 'reselect';

import { NAME } from './constants';

const getState = state => state[NAME];

const getData = state => getState(state).data;

export const getDataAvailable = state => getData(state) !== null;

const getRegistryEntryId = (_, props) => props.data?.registry_entry_id;

export const getTree = createSelector(
    [getDataAvailable, getData, getRegistryEntryId],
    (dataAvailable, data, selectedRegistryEntryId) => {
        if (!dataAvailable) {
            return null;
        }

        const preparedData = prepareEntriesForComponent(data, selectedRegistryEntryId);
        const root = buildTree(preparedData);
        sortChildrenRecursively(root.children);
        disableTopCategories(root);
        return root;
    }
);

function prepareEntriesForComponent(data, selectedRegistryEntryId) {
    return data.map(({ id, label, parent }) => ({
        value: id,
        label,
        parent,
        checked: id === selectedRegistryEntryId,
        disabled: false,
    }));
}

function buildTree(data) {
    // https://typeofnan.dev/an-easy-way-to-build-a-tree-with-object-references/
    const idMapping = data.reduce((acc, el, i) => {
        acc[el.value] = i;
        return acc;
    }, {});

    let root;
    data.forEach(el => {
        // Handle the root element.
        if (el.parent === null && typeof root === 'undefined') {
            root = el;
            return;
        }
        // Use our mapping to locate the parent element in our data array.
        const parentEl = data[idMapping[el.parent]];
        if (parentEl) {
            parentEl.children = [...(parentEl.children || []), el];
        }
    });

    return root;
}

function sortChildrenRecursively(children) {
    children.sort((a, b) => {
        const aLower = a.label.toLowerCase();
        const bLower = b.label.toLowerCase();
        return aLower.localeCompare(bLower);
    });
    children.forEach(child => {
        if (child.children) {
            sortChildrenRecursively(child.children);
        }
    })
}

function disableTopCategories(root) {
    root.children.forEach(child => {
        child.disabled = true;
    });
}
