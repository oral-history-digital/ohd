import { useSelector } from 'react-redux';
import queryString from 'query-string';
import useSWRImmutable from 'swr/immutable';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import { getEditView } from 'modules/archive';
import { getMapQuery } from 'modules/search';

export default function useMapLocations() {
    const pathBase = usePathBase();
    const isEditView = useSelector(getEditView);
    const query = useSelector(getMapQuery);

    const params = {
        ...query,
    };
    if (isEditView) {
        params['all'] = true;
    }
    const paramStr = queryString.stringify(params);
    const path = `${pathBase}/searches/map?${paramStr}`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    return { isValidating, locations: data, error };
}
