export default function addFilterInformation(filter, referenceTypes) {
    if (!Array.isArray(filter)) {
        throw new TypeError('filter must be Array');
    }
    if (!Array.isArray(referenceTypes)) {
        throw new TypeError('referenceTypes must be Array');
    }

    const transformedTypes = referenceTypes.map((type) => ({
        ...type,
        filterIsSet: filter.includes(type.id.toString()),
    }));

    return transformedTypes;
}
