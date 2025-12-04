export default function sortByReferenceTypeOrder(
    referenceTypes,
    property,
    references
) {
    if (!Array.isArray(referenceTypes)) {
        throw new TypeError('referenceTypes must be Array');
    }

    if (typeof property !== 'string') {
        throw new TypeError('property must be string');
    }

    if (!Array.isArray(references)) {
        throw new TypeError('references must be Array');
    }

    const referenceTypeIds = referenceTypes.map((type) => type.id);

    function compareFunction(a, b) {
        return (
            referenceTypeIds.indexOf(a[property]) -
            referenceTypeIds.indexOf(b[property])
        );
    }

    const sortedReferences = [...references].sort(compareFunction);

    return sortedReferences;
}
