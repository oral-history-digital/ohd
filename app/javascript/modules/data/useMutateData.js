import { useSWRConfig } from 'swr';
import { useSelector } from 'react-redux';

import { usePathBase } from 'modules/routes';

export default function useMutateData(scope) {
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return function mutateData(updateDocument) {
        const path = `${pathBase}/${scope}.json`;

        if (typeof updateDocument === 'function') {
            mutate(path, updateDocument, { revalidate: false });
        } else {
            mutate(path);
        }
    }
}
