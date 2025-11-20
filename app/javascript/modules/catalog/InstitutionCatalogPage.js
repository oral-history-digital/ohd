import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useTrackPageView } from 'modules/analytics';
import { ErrorBoundary } from 'modules/react-toolbox';
import { ScrollToTop } from 'modules/user-agent';
import { getInstitutions, Fetch } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Breadcrumbs } from 'modules/ui';
import InstitutionCatalog from './InstitutionCatalog';

export default function InstitutionCatalogPage() {
    const allInstitutions = useSelector(getInstitutions);
    const { t, locale } = useI18n();
    const id = Number(useParams().id);
    useTrackPageView();

    const institution = allInstitutions[id];

    const title = institution?.name[locale];

    let parentInstitution;
    if (institution?.parent_id) {
        parentInstitution = allInstitutions[institution.parent_id];
    }

    const cityParts = [institution?.zip, institution?.city];

    const addressParts = [
        institution?.street,
        cityParts.filter((part) => part?.length > 0).join(' '),
        institution?.country,
    ];

    const address = addressParts.filter((part) => part?.length > 0).join(', ');

    return (
        <ScrollToTop>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <ErrorBoundary>
                <Fetch
                    fetchParams={['institutions', id]}
                    testDataType="institutions"
                    testIdOrDesc={id}
                >
                    <div className="wrapper-content interviews">
                        <Breadcrumbs className="u-mb">
                            <Link to={`/${locale}/catalog`}>
                                {t('modules.catalog.title')}
                            </Link>
                            {t('activerecord.models.institution.other')}
                            {title}
                        </Breadcrumbs>

                        <h1 className="search-results-title u-mb">{title}</h1>

                        <dl className="DescriptionList">
                            {parentInstitution && (
                                <>
                                    <dt className="DescriptionList-term">
                                        {t(
                                            'modules.catalog.part_of_institution'
                                        )}
                                    </dt>
                                    <dd className="DescriptionList-description">
                                        <Link
                                            to={`/${locale}/catalog/institutions/${parentInstitution.id}`}
                                        >
                                            {parentInstitution.name[locale]}
                                        </Link>
                                    </dd>
                                </>
                            )}

                            {institution?.description[locale] && (
                                <>
                                    <dt className="DescriptionList-term">
                                        {t('modules.catalog.description')}
                                    </dt>
                                    <dd className="DescriptionList-description">
                                        {institution?.description[locale]}
                                    </dd>
                                </>
                            )}

                            {address && (
                                <>
                                    <dt className="DescriptionList-term">
                                        {t('modules.catalog.address')}
                                    </dt>
                                    <dd className="DescriptionList-description">
                                        {address}
                                    </dd>
                                </>
                            )}

                            {institution?.website && (
                                <>
                                    <dt className="DescriptionList-term">
                                        {t('modules.catalog.web_page')}
                                    </dt>
                                    <dd className="DescriptionList-description">
                                        <a
                                            href={institution?.website}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {institution?.website}
                                        </a>
                                    </dd>
                                </>
                            )}

                            <dt className="DescriptionList-term">
                                {t('modules.catalog.volume')}
                            </dt>
                            <dd className="DescriptionList-description">
                                {institution?.num_interviews}{' '}
                                {t('activerecord.models.interview.other')}
                            </dd>
                        </dl>

                        {institution?.num_projects > 0 && (
                            <InstitutionCatalog id={Number.parseInt(id)} />
                        )}
                    </div>
                </Fetch>
            </ErrorBoundary>
        </ScrollToTop>
    );
}
