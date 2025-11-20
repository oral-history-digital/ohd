import useSWRImmutable from 'swr/immutable';

import { useI18n } from 'modules/i18n';
import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';

export default function useCollectionData(id) {
    const { locale } = useI18n();
    const pathBase = usePathBase();
    const path = `${pathBase}/catalog/collections/${id}?lang=${locale}`;
    const { isValidating, isLoading, data, error } = useSWRImmutable(
        path,
        fetcher
    );

    return {
        collectionData: data,
        error,
        isValidating,
        isLoading,
    };
}
