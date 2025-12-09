import { usePathBase } from 'modules/routes';
import { useSWRConfig } from 'swr';

export default function useMutateWorkbook() {
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return function mutateWorkbook(updateDocument, id) {
        const path =
            typeof id === 'undefined'
                ? `${pathBase}/user_contents`
                : `${pathBase}/user_contents/${id}`;

        if (typeof updateDocument === 'function') {
            mutate(path, updateDocument, { revalidate: false });
        } else {
            mutate(path);
        }
    };
}
