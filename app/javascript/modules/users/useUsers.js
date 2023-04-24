import useSWRImmutable from 'swr/immutable';

import { usePathBase } from 'modules/routes';

export default function useUsers(page, filter, workflowStateFilter) {
    const pathBase = usePathBase();

    const path = `${pathBase}/users.json?page=${page}&q=${filter}&workflow_state=${workflowStateFilter}`;
    const { isLoading, isValidating, data, error } = useSWRImmutable(path);

    return { isLoading, isValidating, data: data, error };
}
