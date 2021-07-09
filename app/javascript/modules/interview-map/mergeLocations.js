/**
 * Merges locations for segments and for the interviewee which are
 * just concatenated on the server.
 */
export default function mergeLocations(locations) {
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
