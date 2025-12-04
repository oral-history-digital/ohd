import curry from 'lodash.curry';
import flow from 'lodash.flow';
import { useMapReferenceTypes } from 'modules/map';
import { useSelector } from 'react-redux';

import { getMapFilter } from '../selectors';
import useMapLocations from '../useMapLocations';
import addFilterInformation from './addFilterInformation';
import addLocationCount from './addLocationCount';

export default function useSearchMap() {
    const filter = useSelector(getMapFilter);

    const { referenceTypes, error: referenceTypesError } =
        useMapReferenceTypes();
    const { locations, error: locationsError } = useMapLocations();

    let locationTypes = [];
    if (referenceTypes && locations && filter) {
        const transformData = flow(
            curry(addFilterInformation)(filter),
            curry(addLocationCount)(locations)
        );
        locationTypes = transformData(referenceTypes);
    }

    return {
        isLoading: !(referenceTypes && locations),
        locationTypes,
        locationsError,
    };
}
