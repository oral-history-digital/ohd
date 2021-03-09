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

        const transformedData = data.map(({ id, label, parent }) => ({
            value: id,
            label,
            parent,
            checked: id === selectedRegistryEntryId,
        }));

        // https://typeofnan.dev/an-easy-way-to-build-a-tree-with-object-references/
        const idMapping = transformedData.reduce((acc, el, i) => {
            acc[el.value] = i;
            return acc;
        }, {});

        let root;
        transformedData.forEach(el => {
            // Handle the root element.
            if (el.parent === null && typeof root === 'undefined') {
                root = el;
                return;
            }
            // Use our mapping to locate the parent element in our data array.
            const parentEl = transformedData[idMapping[el.parent]];
            if (parentEl) {
                parentEl.children = [...(parentEl.children || []), el];
            }
        });

        return root;
    }
);
