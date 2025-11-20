import curry from 'lodash.curry';
import flow from 'lodash.flow';
import {
    referenceTypesToColorMap,
    transformIntoMarkers,
    useMapReferenceTypes,
} from 'modules/map';
import { useSelector } from 'react-redux';

import { getMapFilter } from '../selectors';
import useMapLocations from '../useMapLocations';
import filterLocations from './filterLocations';
import filterReferenceTypes from './filterReferenceTypes';
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
