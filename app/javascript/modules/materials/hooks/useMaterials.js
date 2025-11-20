import useSWRImmutable from 'swr/immutable';

import { fetcher } from 'modules/api';
import { useIsEditor } from 'modules/archive';
import { usePathBase } from 'modules/routes';

export default function useMaterials(archiveId) {
    const pathBase = usePathBase();
    const isEditor = useIsEditor();

    const path = `${pathBase}/interviews/${archiveId}/materials.json`;

    const { isLoading, isValidating, data, error } = useSWRImmutable(
        path,
        fetcher
    );

    const formattedData = data
        ? filteredData(Object.values(data.data), isEditor)
        : [];

    return { isLoading, isValidating, data: formattedData, error };
}

function filteredData(materials, isEditor) {
    if (isEditor) {
        return materials;
    } else {
        return materials.filter(
            (material) => material.workflow_state === 'public'
        );
    }
}
