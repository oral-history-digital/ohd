import { fetcher } from 'modules/api';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import useSWRImmutable from 'swr/immutable';

function compareContributions(a, b) {
    const idResult = a.interview_id.localeCompare(b.interview_id);

    if (idResult !== 0) {
        return idResult;
    }

    return a.label.localeCompare(b.label);
}

export default function useContributionsForPerson(id) {
    const { locale } = useI18n();
    const pathBase = usePathBase();

    const path = `${pathBase}/people/${id}/contributions?locale=${locale}`;
    const { isLoading, isValidating, data, error } = useSWRImmutable(
        path,
        fetcher
    );

    let contributions = [];

    if (data) {
        contributions = data;
        contributions.sort(compareContributions);
    }

    return {
        isLoading,
        isValidating,
        contributions,
        error,
    };
}
