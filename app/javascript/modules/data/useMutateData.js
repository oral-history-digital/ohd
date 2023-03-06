import { useSWRConfig } from 'swr';
import { useSelector } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import { usePathBase } from 'modules/routes';

export default function useMutateData(scope) {
    const project = useSelector(getCurrentProject);
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
