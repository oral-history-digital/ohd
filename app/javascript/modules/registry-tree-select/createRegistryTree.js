export default function createRegistryTree(data, selectedRegistryEntryId) {
    console.assert(data !== undefined && data !== null, 'data cannot be null or undefined:', data);

    if (!data) {
        return null;
    }

    const preparedData = prepareEntriesForComponent(data, selectedRegistryEntryId);
    const filteredData = filterEntriesWithOutLabels(preparedData);
    const root = buildTree(filteredData);
    sortCategories(root);
    disableTopCategories(root);
    return root;
}

function prepareEntriesForComponent(data, selectedRegistryEntryId) {
    return data.map(({ id, label, parent }) => ({
        value: id,
        label,
        parent,
        checked: id === selectedRegistryEntryId,
        disabled: false,
    }));
}

function filterEntriesWithOutLabels(entries) {
    return entries.filter(entry => entry.label?.length > 0);
}

export function buildTree(entries) {
    const root = findRootEntry(entries);
    enrichEntriesWithChildren(entries, root);
    return root;
}

function findRootEntry(entries) {
    const result = entries.find((entry) => entry.parent === null);
    if (!result) {
        throw new TypeError(`Registry tree does not contain root element.`);
    }
    return result;
}

function enrichEntriesWithChildren(entries, rootEntry) {
    const indexById = createIndexByIdMapping(entries);
    entries.forEach(addEntryToChildrenOfItsParents);

    function addEntryToChildrenOfItsParents(entry) {
        const parentEntry = entries[indexById[entry.parent]];
        console.assert(parentEntry || entry === rootEntry,
            `Parent ${entry.parent} of registry entry ${entry.value} (${entry.label}) does not exist.`)
        if (parentEntry) {
            parentEntry.children = [...(parentEntry.children || []), entry];
        }
    }
}

// https://typeofnan.dev/an-easy-way-to-build-a-tree-with-object-references/
function createIndexByIdMapping(entries) {
    const result = entries.reduce((acc, el, i) => {
        acc[el.value] = i;
        return acc;
    }, {});
    return result;
}

function sortCategories(root) {
    root.children && sortChildrenRecursively(root.children);
}

function sortChildrenRecursively(children) {
    children
        .sort(childrenComparator)
        .forEach(child => {
            if (child.children) {
                sortChildrenRecursively(child.children);
            }
        });
}

function childrenComparator(a, b) {
    const aLower = a.label.toLowerCase();
    const bLower = b.label.toLowerCase();
    return aLower.localeCompare(bLower);
}

function disableTopCategories(root) {
    root.children?.forEach(child => {
        child.disabled = true;
    });
}
