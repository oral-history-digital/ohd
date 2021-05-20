import typeToColor from './typeToColor';
import { MARKER_COLOR_MULTIPLE_TYPES } from './constants';

export default function markerColor(allReferenceTypes, markerReferenceTypes) {
    if (markerReferenceTypes.length === 1) {
        return typeToColor(allReferenceTypes, markerReferenceTypes[0]);
    } else {
        return MARKER_COLOR_MULTIPLE_TYPES;
    }
}
