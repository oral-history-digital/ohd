import { useSWRConfig } from 'swr';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';

export default function useMutateDatum() {
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return function mutatePersonData(id, scope, updateDocument) {
        const path = `${pathBase}/${scope}/${id}.json`;

        if (typeof updateDocument === 'function') {
            mutate(path, updateDocument, { revalidate: false });
        } else {
            mutate(path);
        }
    }
}
