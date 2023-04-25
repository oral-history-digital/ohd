import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import useContributionsForPerson from './useContributionsForPerson';

export default function PersonContributions({
    personId
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();

    const { contributions, error, isLoading } =
        useContributionsForPerson(personId);

    if (error) {
        return (
            <p>{t('modules.admin.person_details.contributions.error')}: {error.message}</p>
        );
    }

    if (isLoading) {
        return <Spinner />;
    }

    if (contributions.length === 0) {
        return null;
    }

    return (
        <div>
            <h4 className="u-line-height u-mt u-mb-none">
                {t('modules.admin.person_details.contributions.title')}
            </h4>
            <ul className="u-line-height u-mt-none u-mb-none">
                {
                    contributions.map(contribution => (
                        <li
                            key={contribution.id}
                            className="u-line-height"
                        >
                            {contribution.label} {t('modules.admin.person_details.contributions.at')}
                            {' '}
                            <Link
                                to={`${pathBase}/interviews/${contribution.interview_id}`}
                            >
                                {contribution.interview_title} ({contribution.interview_id})
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

PersonContributions.propTypes = {
    personId: PropTypes.number.isRequired,
};
