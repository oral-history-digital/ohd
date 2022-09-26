import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import useCatalogStats from './useCatalogStats';

export default function StartpageIntroduction({
    className,
}) {
    const { t } = useI18n();
    const { data: stats, error, isLoading } = useCatalogStats();

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <article className={className}>
            <p className="u-mt-none u-mb-none">
                {t('modules.site_startpage.introduction')}
                {' '}
                {t('modules.site_startpage.stats', {
                    numProjects: stats?.num_projects,
                    numCollections: stats?.num_collections,
                    numInterviews: stats?.num_interviews,
                    numInstitutions: stats?.num_institutions,
                })}
            </p>
            <p className="u-mt-none u-mb-none u-color-ui">
                {t('modules.site_startpage.under_construction')}
            </p>
            <p className="u-mt u-mb-none">
                <a
                    href="https://wikis.fu-berlin.de/x/0oDGT"
                    target="_blank"
                    rel="noreferrer"
                >
                    {t('modules.site_startpage.instructions')}
                </a>
            </p>
        </article>
    );
}

StartpageIntroduction.propTypes = {
    className: PropTypes.string,
};
