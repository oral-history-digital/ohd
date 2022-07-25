import { Helmet } from 'react-helmet';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ErrorBoundary } from 'modules/react-toolbox';
import { ScrollToTop } from 'modules/user-agent';
import { getInstitutions } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Breadcrumbs } from 'modules/ui';
import { usePathBase } from 'modules/routes';
import InstitutionCatalog from './InstitutionCatalog';

export default function InstitutionCatalogPage() {
    const allInstitutions = useSelector(getInstitutions);
    const { t, locale } = useI18n();
    const { id } = useParams();
    const pathBase = usePathBase();

    const institution = allInstitutions[id];

    if (!institution) {
        return (
            <Navigate to={`${pathBase}/not_found`} replace />
        );
    }

    const title = institution.name[locale];

    let parentInstitution;
    if (institution.parent_id) {
        parentInstitution = allInstitutions[institution.parent_id];
    }

    return (
        <ScrollToTop>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <ErrorBoundary>
                <div className="wrapper-content interviews">
                    <Breadcrumbs className="u-mb">
                        <Link to={`/${locale}/catalog`}>
                            {t('modules.catalog.title')}
                        </Link>
                        {t('activerecord.models.institution.other')}
                        {title}
                    </Breadcrumbs>

                    <h1 className="search-results-title u-mb">
                        {title}
                    </h1>
                    {parentInstitution && (
                        <p className="Paragraph u-mb">
                            {t('modules.catalog.part_of_institution')}
                            {' '}
                            <Link to={`/${locale}/catalog/institutions/${parentInstitution.id}`}
                            >
                                {parentInstitution.name[locale]}
                            </Link>
                        </p>
                    )}

                    <p className="Paragraph u-mb">
                        {institution.description[locale]}
                    </p>

                    <p className="Paragraph u-mb">
                        {t('modules.catalog.web_page')}
                        {': '}
                        <a
                            href={institution.website}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {institution.website}
                        </a>
                    </p>

                    <p className="Paragraph u-mb">
                        {`${t('modules.catalog.volume')}: ${institution.num_interviews}`}
                        {' '}
                        {t('activerecord.models.interview.other')}
                    </p>

                    <div>
                        <InstitutionCatalog id={Number.parseInt(id)} />
                    </div>
                </div>
            </ErrorBoundary>
        </ScrollToTop>
    );
}
