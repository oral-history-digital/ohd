export default function filterReferenceTypes(filter, locations) {
    if (!Array.isArray(locations)) {
        throw new TypeError('locations must be Array');
    }

    const filteredLocations = locations.map(location => {
        const referenceTypes = {};

        filter.forEach((f) => {
          if (f in location.ref_types) {
            referenceTypes[f] = location.ref_types[f];
          }
        })

        return {
            ...location,
            ref_types: referenceTypes,
        };
    });

    return filteredLocations;
}
