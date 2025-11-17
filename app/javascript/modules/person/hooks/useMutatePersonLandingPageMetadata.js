import { useSWRConfig } from 'swr';

import { usePathBase } from 'modules/routes';

export default function useMutatePersonLandingPageMetadata() {
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();

    return function mutatePersonLandingPageMetadata(id) {
        const path = `${pathBase}/people/${id}/landing_page_metadata.json`;
        mutate(path);
    }
}
