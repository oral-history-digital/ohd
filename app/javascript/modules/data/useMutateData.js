import { useSWRConfig } from 'swr';

import { usePathBase } from 'modules/routes';

export default function useMutateData(scope, dataPath) {
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return function mutateData(updateDocument) {
        const path = dataPath || `${pathBase}/${scope}.json`;

        if (typeof updateDocument === 'function') {
            mutate(path, updateDocument, { revalidate: false });
        } else {
            mutate(path);
        }
    }
}
