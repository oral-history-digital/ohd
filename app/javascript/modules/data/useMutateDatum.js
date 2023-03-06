import useSWRImmutable from 'swr/immutable';
import { useSelector } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';

export default function useMutateDatum(id, scope) {
    const project = useSelector(getCurrentProject);
    const pathBase = usePathBase();

    const path = `${pathBase}/${scope}/${id}.json`;

    const { isLoading, isValidating, data, error } = useSWRImmutable(
        typeof id === 'number' ? path : null, fetcher
    );

    return { isLoading, isValidating, data: data?.data, error };
}
