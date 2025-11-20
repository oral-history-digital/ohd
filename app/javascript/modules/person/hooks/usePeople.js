import useSWRImmutable from 'swr/immutable';

import { fetcher } from 'modules/api';
import { usePathBase, useProject } from 'modules/routes';

export default function usePeople() {
    const { project } = useProject();
    const pathBase = usePathBase();

    const path = `${pathBase}/people.json?for_projects=${project.id}`;

    const { isLoading, isValidating, data, error } = useSWRImmutable(
        path,
        fetcher
    );

    return { isLoading, isValidating, data: data?.data, error };
}
