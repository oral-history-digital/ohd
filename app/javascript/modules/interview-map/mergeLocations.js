export default function mergeLocations(locations) {
    if (!Array.isArray(locations)) {
        throw new TypeError('locations must be Array');
    }

    const mergedLocations = locations.reduce((acc, location) => {
        if (location.id in acc) {
            const storedLocation = acc[location.id];
            storedLocation.ref_types = `${storedLocation.ref_types},${location.ref_types}`;
        } else {
            acc[location.id] = {
                ...location, // Clone because state is mutated above.
            };
        }
        return acc;
    }, {});

    return Object.values(mergedLocations);
}
