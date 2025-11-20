import { useSWRConfig } from 'swr';

import { usePathBase } from 'modules/routes';

export default function useMutateEventTypes() {
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return function mutatePeople(updateDocument) {
        const path = `${pathBase}/event_types.json`;

        if (typeof updateDocument === 'function') {
            mutate(path, updateDocument, { revalidate: false });
        } else {
            mutate(path);
        }
    };
}
