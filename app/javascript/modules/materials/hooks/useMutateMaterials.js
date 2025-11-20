import { useSWRConfig } from 'swr';

import { usePathBase } from 'modules/routes';

export default function useMutateMaterials(archiveId) {
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return function mutateMaterials(updateDocument) {
        const path = `${pathBase}/interviews/${archiveId}/materials.json`;

        if (typeof updateDocument === 'function') {
            mutate(path, updateDocument, { revalidate: false });
        } else {
            mutate(path);
        }
    };
}
