import useSWRImmutable from 'swr/immutable';

import { usePathBase } from 'modules/routes';

export default function useUsers(page, filter, workflowStateFilter, localeFilter, manualSorting) {
    const pathBase = usePathBase();

    let dataPath = `${pathBase}/users.json?page=${page}`;
    if (filter) {
        dataPath += `&filter=${filter}`;
    }
    if (workflowStateFilter) {
        dataPath += `&workflow_state=${workflowStateFilter}`;
    }
    if (localeFilter) {
        dataPath += `&default_locale=${localeFilter}`;
    }
    if (manualSorting?.[0]) {
        dataPath += `&order=${manualSorting[0].id}&direction=${manualSorting[0].desc ? 'desc' : 'asc'}`;
    }

    const { isLoading, isValidating, data, error } = useSWRImmutable(dataPath);

    return { isLoading, isValidating, data: data, error, dataPath };
}
