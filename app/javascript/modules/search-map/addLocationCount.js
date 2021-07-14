export default function addLocationCount(locations, referenceTypes) {
    if (!Array.isArray(locations)) {
        throw new TypeError('locations must be Array');
    }
    if (!Array.isArray(referenceTypes)) {
        throw new TypeError('referenceTypes must be Array');
    }

    const transformedTypes = referenceTypes.map(type => {
        return {
            ...type,
            locationCount: 5,
        };
    });

    return transformedTypes;
}
