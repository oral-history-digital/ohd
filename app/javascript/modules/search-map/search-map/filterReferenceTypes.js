export default function filterReferenceTypes(filter, locations) {
    if (!Array.isArray(locations)) {
        throw new TypeError('locations must be Array');
    }

    const filteredLocations = locations.map(location => {
        const referenceTypes = {};
        filter.forEach((f) => {
          if (f === 'S') {
            referenceTypes.segment = location.ref_types.segment;
          } else {
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
