import { Helmet } from 'react-helmet';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ErrorBoundary } from 'modules/react-toolbox';
import { ScrollToTop } from 'modules/user-agent';
import { getCollections, getProjects } from 'modules/data';
import { usePathBase, LinkOrA } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { Breadcrumbs } from 'modules/ui';
import CollectionData from './CollectionData';

export default function CollectionCatalogPage() {
    const projects = useSelector(getProjects);
    const collections = useSelector(getCollections);
    const { t, locale } = useI18n();
    const { id } = useParams();
    const pathBase = usePathBase();

    const collection = collections[id];

    if (!collection) {
        return <Navigate to={`${pathBase}/not_found`} replace />;
    }

    const project = projects[collection.project_id];
    const title = collection.name[locale];

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
                        {t('activerecord.models.collection.other')}
                        {title}
                    </Breadcrumbs>

                    <h1 className="search-results-title u-mb">
                        {title}
                    </h1>

                    <dl className="DescriptionList">
                        <dt className="DescriptionList-term">
                            {t('activerecord.models.project.one')}
                        </dt>
                        <dd className="DescriptionList-description">
                            <Link to={`/${locale}/catalog/archives/${project.id}`}>{project.name[locale]}</Link>
                        </dd>

                        {collection.notes[locale] && (<>
                            <dt className="DescriptionList-term">
                                {t('activerecord.attributes.collection.notes')}
                            </dt>
                            <dd className="DescriptionList-description">
                                {collection.notes[locale]}
                            </dd>
                        </>)}

                        {collection.responsibles?.[locale] && (<>
                            <dt className="DescriptionList-term">
                                {t('activerecord.attributes.collection.responsibles')}
                            </dt>
                            <dd className="DescriptionList-description">
                                {collection.responsibles?.[locale]}
                            </dd>
                        </>)}

                        <CollectionData id={id} className="u-mb" />

                        {collection.homepage[locale] && (<>
                            <dt className="DescriptionList-term">
                                {t('modules.catalog.web_page')}
                            </dt>
                            <dd className="DescriptionList-description">
                                <a
                                    href={collection.homepage[locale]}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {collection.homepage[locale]}
                                </a>
                            </dd>
                        </>)}

                        <dt className="DescriptionList-term">
                            {t('modules.catalog.volume')}
                        </dt>
                        <dd className="DescriptionList-description">
                            {collection.num_interviews}
                            {' '}
                            {t('activerecord.models.interview.other')}
                        </dd>
                    </dl>

                    {collection.is_linkable && (
                        <p className="Paragraph u-mb">
                            <LinkOrA
                                project={project}
                                to={`searches/archive?collection_id[]=${collection.id}`}
                            >
                                {t('modules.catalog.go_to_collection')}
                            </LinkOrA>
                        </p>
                    )}
                </div>
            </ErrorBoundary>
        </ScrollToTop>
    );
}
