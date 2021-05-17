export default function markerColor(referenceTypes) {
    if (referenceTypes.length === 1) {
        return 'darkred';
    } else if (referenceTypes.length === 2) {
        return 'grey';
    } else {
        return 'black';
    }
}
