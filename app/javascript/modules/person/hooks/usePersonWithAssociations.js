import useSWRImmutable from 'swr/immutable';

import { useProjectAccessStatus } from 'modules/auth';
import { fetcher } from 'modules/api';
import { usePathBase, useProject } from 'modules/routes';

export default function usePersonWithAssociations(id) {
    const { project } = useProject();
    const pathBase = usePathBase();
    const { projectAccessGranted } = useProjectAccessStatus(project);

    const path = projectAccessGranted ?
        `${pathBase}/people/${id}.json?with_associations=true` :
        `${pathBase}/people/${id}/landing_page_metadata.json`;

    const { isLoading, isValidating, data, error } = useSWRImmutable(
        typeof id === 'number' ? path : null, fetcher
    );

    return { isLoading, isValidating, data: data?.data, error };
}
