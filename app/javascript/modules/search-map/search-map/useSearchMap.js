import { useSelector } from 'react-redux';
import flow from 'lodash.flow';
import curry from 'lodash.curry';

import {
    useMapReferenceTypes,
    referenceTypesToColorMap,
    transformIntoMarkers,
} from 'modules/map';
import { getMapFilter } from '../selectors';
import useMapLocations from '../useMapLocations';
import filterReferenceTypes from './filterReferenceTypes';
import filterLocations from './filterLocations';
import sortMarkers from './sortMarkers';

export default function useSearchMap() {
    const filter = useSelector(getMapFilter);

    const { referenceTypes, error: referenceTypesError } =
        useMapReferenceTypes();
    const { locations, error: locationsError } = useMapLocations();

    let markers = [];
    if (referenceTypes && locations && filter) {
        const colorMap = referenceTypesToColorMap(referenceTypes);

        const transformData = flow(
            curry(filterReferenceTypes)(filter),
            filterLocations,
            curry(transformIntoMarkers)(colorMap),
            sortMarkers
        );
        markers = transformData(locations);
    }

    return {
        isLoading: !(referenceTypes && locations),
        markers,
        error: locationsError,
    };
}
