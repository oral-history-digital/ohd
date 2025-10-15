import { useSWRConfig } from 'swr';

import { usePathBase } from 'modules/routes';

export default function useInvalidateAllPersonData() {
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return function invalidateAllPersonData() {
        mutate(
            key => typeof key === 'string' && key.startsWith(`${pathBase}/people`),
            undefined,
            { revalidate: true }
        );
    };
}
