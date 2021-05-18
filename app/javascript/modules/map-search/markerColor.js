import typeToColor from './typeToColor';
import { MARKER_COLOR_TWO_TYPES, MARKER_COLOR_THREE_AND_MORE_TYPES } from './constants';

export default function markerColor(allReferenceTypes, markerReferenceTypes) {
    if (markerReferenceTypes.length === 1) {
        return typeToColor(allReferenceTypes, markerReferenceTypes[0]);
    } else if (markerReferenceTypes.length === 2) {
        return MARKER_COLOR_TWO_TYPES;
    } else {
        return MARKER_COLOR_THREE_AND_MORE_TYPES;
    }
}
