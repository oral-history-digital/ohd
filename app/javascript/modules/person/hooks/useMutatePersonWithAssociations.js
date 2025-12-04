import { usePathBase } from 'modules/routes';
import { useSWRConfig } from 'swr';

export default function useMutatePersonWithAssociations() {
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return function mutatePersonData(id, updateDocument) {
        const path = `${pathBase}/people/${id}.json?with_associations=true`;

        if (typeof updateDocument === 'function') {
            mutate(path, updateDocument, { revalidate: false });
        } else {
            mutate(path);
        }
    };
}
