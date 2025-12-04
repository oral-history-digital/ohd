import { fetcher } from 'modules/api';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

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
