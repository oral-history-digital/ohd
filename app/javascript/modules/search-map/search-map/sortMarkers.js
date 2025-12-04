export default function sortMarkers(markers) {
    // Markers with more references should be first so that
    // they don't mask smaller markers on the Leaflet marker pane.
    const sortedMarkers = markers.sort(
        (markerA, markerB) => markerB.numReferences - markerA.numReferences
    );
    return sortedMarkers;
}
