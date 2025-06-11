import { useSWRConfig } from 'swr';

import { usePathBase } from 'modules/routes';

export default function useMutatePDFMaterials(archiveId) {
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return function mutatePDFMaterials(updateDocument) {
        const path = `${pathBase}/interviews/${archiveId}/pdfs.json`;

        if (typeof updateDocument === 'function') {
            mutate(path, updateDocument, { revalidate: false });
        } else {
            mutate(path);
        }
    }
}
