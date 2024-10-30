export default function filterReferenceTypes(filter, locations) {
    if (!Array.isArray(locations)) {
        throw new TypeError('locations must be Array');
    }

    const filteredLocations = locations.map(location => {
        const referenceTypes = location.ref_types
            .split(',')
            .filter(type => filter.includes(type))
            .join(',');

        return {
            ...location,
            ref_types: referenceTypes,
        };
    });

    return filteredLocations;
}
