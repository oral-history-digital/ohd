import useSWRImmutable from 'swr/immutable';
import { useSelector } from 'react-redux';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import { getCurrentProject } from 'modules/data';

export default function usePeople() {
    const project = useSelector(getCurrentProject);
    const pathBase = usePathBase();

    const path = `${pathBase}/people.json?for_projects=${project.id}`;

    const { isLoading, isValidating, data, error } = useSWRImmutable(path, fetcher);

    return { isLoading, isValidating, data: data?.data, error };
}
