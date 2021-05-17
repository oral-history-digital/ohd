import typeToColor from './typeToColor';

export default function markerColor(referenceTypes) {
    if (referenceTypes.length === 1) {
        return typeToColor(referenceTypes[0]);
    } else if (referenceTypes.length === 2) {
        return 'grey';
    } else {
        return 'black';
    }
}
