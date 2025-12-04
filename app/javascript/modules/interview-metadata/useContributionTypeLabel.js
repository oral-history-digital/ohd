import { getContributionTypesForCurrentProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useSelector } from 'react-redux';

export default function useContributionTypeLabel(contributionType) {
    const { t, locale } = useI18n();
    const allTypes = useSelector(getContributionTypesForCurrentProject);

    const type = Object.values(allTypes || {}).find(
        (type) => type.code === contributionType
    );
    const label = type?.label?.[locale];

    return label ? label : t(`contributions.${contributionType}`);
}
