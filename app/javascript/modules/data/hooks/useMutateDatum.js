import { usePathBase } from 'modules/routes';
import { useSWRConfig } from 'swr';

export default function useMutateDatum() {
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return function mutateData(id, scope, updateDocument) {
        const path = `${pathBase}/${scope}/${id}.json`;

        if (typeof updateDocument === 'function') {
            mutate(path, updateDocument, { revalidate: false });
        } else {
            mutate(path);
        }
    };
}
