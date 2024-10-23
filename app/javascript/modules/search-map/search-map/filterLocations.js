export default function filterLocations(locations) {
    const filteredLocations = locations.filter(location =>
        Object.keys(location.ref_types).length > 0);

    return filteredLocations;
}
