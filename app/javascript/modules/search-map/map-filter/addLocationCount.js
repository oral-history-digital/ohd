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
            locationCount: locationCountFor(locations, type.id),
        };
    });

    return transformedTypes;
}

function locationCountFor(locations, referenceTypeId) {
    const key = referenceTypeId === 'S' ? 'segment' : referenceTypeId;
    let numLocations = 0;

    locations.forEach(location => {
        if (Object.hasOwn(location.ref_types, key)) {
            numLocations += 1;
        }
    });

    return numLocations;
}
