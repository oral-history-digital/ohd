import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import mapInterview from './mappers/mapInterview';
import rowComparator from './rowComparator';

export default function useCollectionData(collectionId) {
    const pathBase = usePathBase();
    const path = `${pathBase}/catalog/collections/${collectionId}`;
    const { locale } = useI18n();

    const { isValidating, isLoading, data, error } = useSWRImmutable(path,
        fetcher);

    const interviews = useMemo(
        () => {
            if (!data) {
                return [];
            }

            const interviewRows = data
                .map(interview => mapInterview(locale, interview))
                .sort(rowComparator);

            return interviewRows;
        },
        [collectionId, data, locale]
    );

    return {
        interviews,
        error,
        isValidating,
        isLoading,
    };
}
