import useSWRImmutable from 'swr/immutable';

import { usePathBase } from 'modules/routes';
import fetchMapReferenceTypes from './fetchMapReferenceTypes';

export default function useMapReferenceTypes() {
    const pathBase = usePathBase();

    const { isValidating, data, error } = useSWRImmutable(
        fetchMapReferenceTypes.name,
        () => fetchMapReferenceTypes(pathBase)
    );

    return {
        isLoading: isValidating,
        mapReferenceTypes: data,
        error,
    };
}
