import { usePathBase } from 'modules/routes';
import useSWR from 'swr';

export default function useUsers(
    page,
    filter,
    workflowStateFilter,
    localeFilter,
    projectFilter,
    roleFilter,
    sorting
) {
    const pathBase = usePathBase();

    let dataPath = `${pathBase}/users.json?page=${page}`;
    if (filter) {
        dataPath += `&q=${filter}`;
    }
    if (workflowStateFilter) {
        dataPath += `&workflow_state=${workflowStateFilter}`;
    }
    if (localeFilter) {
        dataPath += `&default_locale=${localeFilter}`;
    }
    if (projectFilter) {
        dataPath += `&project=${projectFilter}`;
    }
    if (roleFilter) {
        dataPath += `&role=${roleFilter}`;
    }
    if (sorting?.[0]) {
        dataPath += `&order=${sorting[0].id}&direction=${sorting[0].desc ? 'desc' : 'asc'}`;
    }

    const { isLoading, isValidating, data, error } = useSWR(dataPath);

    return { isLoading, isValidating, data: data, error, dataPath };
}
