export default function filterLocations(locations) {
    const filteredLocations = locations.filter(location =>
        location.ref_types !== '');

    return filteredLocations;
}
