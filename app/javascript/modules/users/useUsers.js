import useSWRImmutable from 'swr/immutable';

import { usePathBase } from 'modules/routes';

export default function useUsers(page, filter, workflowStateFilter) {
    const pathBase = usePathBase();

    const dataPath = `${pathBase}/users.json?page=${page}&q=${filter}&workflow_state=${workflowStateFilter}`;
    const { isLoading, isValidating, data, error } = useSWRImmutable(dataPath);

    return { isLoading, isValidating, data: data, error, dataPath };
}
