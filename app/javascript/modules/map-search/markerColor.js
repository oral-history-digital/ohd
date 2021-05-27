import { MARKER_COLOR_MULTIPLE_TYPES } from './constants';
import keyBy from 'lodash.keyby';

export default function markerColor(allReferenceTypes, markerReferenceTypes) {
    const typesById = keyBy(allReferenceTypes, type => type.id);

    if (markerReferenceTypes.length === 1) {
        return typesById[markerReferenceTypes[0]].color;
    } else {
        return MARKER_COLOR_MULTIPLE_TYPES;
    }
}
