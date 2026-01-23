import { useTrackPageView } from 'modules/analytics';
import { Fetch, getCollections, getProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { LinkOrA } from 'modules/routes';
import { Breadcrumbs } from 'modules/ui';
import { ScrollToTop } from 'modules/user-agent';
import { Helmet } from 'react-helmet';
import { FaChevronRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import CollectionData from './CollectionData';

export default function CollectionCatalogPage() {
    const projects = useSelector(getProjects);
    const collections = useSelector(getCollections);
    const { t, locale } = useI18n();
    const { id } = useParams();
    useTrackPageView();

    const collection = collections[id];
    const project = projects[collection?.project_id];

    return (
        <Fetch
            fetchParams={['collections', id]}
            testDataType="collections"
            testIdOrDesc={id}
        >
            <ScrollToTop>
                <Helmet>
                    <title>{collection?.name[locale]}</title>
                </Helmet>
                <ErrorBoundary>
                    <div className="wrapper-content interviews">
                        <Breadcrumbs className="u-mb">
                            <Link to={`/${locale}/catalog`}>
                                {t('modules.catalog.title')}
                            </Link>
                            {t('activerecord.models.collection.other')}
                            {collection?.name[locale]}
                        </Breadcrumbs>

                        <h1 className="search-results-title u-mb">
                            {collection?.name[locale]}
                        </h1>

                        {collection?.is_linkable && (
                            <p className="Paragraph u-mb">
                                <LinkOrA
                                    project={project}
                                    to={'searches/archive'}
                                    params={`collection_id[]=${collection?.id}`}
                                    className="ProminentLink"
                                >
                                    <FaChevronRight className="ProminentLink-icon u-mr-tiny" />
                                    {t('modules.catalog.go_to_collection')}
                                </LinkOrA>
                            </p>
                        )}

                        <dl className="DescriptionList">
                            <div className="DescriptionList-group">
                                <dt className="DescriptionList-term">
                                    {t('activerecord.models.project.one')}
                                </dt>
                                <dd className="DescriptionList-description">
                                    <Link
                                        to={`/${locale}/catalog/archives/${project?.id}`}
                                    >
                                        {project?.name[locale]}
                                    </Link>
                                </dd>
                            </div>

                            {collection?.notes[locale] && (
                                <div className="DescriptionList-group">
                                    <dt className="DescriptionList-term">
                                        {t(
                                            'activerecord.attributes.collection.notes'
                                        )}
                                    </dt>
                                    <dd
                                        dangerouslySetInnerHTML={{
                                            __html: collection?.notes[locale],
                                        }}
                                        className="DescriptionList-description"
                                    />
                                </div>
                            )}

                            {collection?.responsibles?.[locale] && (
                                <div className="DescriptionList-group">
                                    <dt className="DescriptionList-term">
                                        {t(
                                            'activerecord.attributes.collection.responsibles'
                                        )}
                                    </dt>
                                    <dd className="DescriptionList-description">
                                        {collection?.responsibles?.[locale]}
                                    </dd>
                                </div>
                            )}

                            <CollectionData id={id} className="u-mb" />

                            {collection?.homepage[locale] && (
                                <div className="DescriptionList-group">
                                    <dt className="DescriptionList-term">
                                        {t('modules.catalog.web_page')}
                                    </dt>
                                    <dd className="DescriptionList-description">
                                        <a
                                            href={collection?.homepage[locale]}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {collection?.homepage[locale]}
                                        </a>
                                    </dd>
                                </div>
                            )}
                            <div className="DescriptionList-group">
                                <dt className="DescriptionList-term">
                                    {t('modules.catalog.volume')}
                                </dt>
                                <dd className="DescriptionList-description">
                                    {collection?.num_interviews}{' '}
                                    {t('activerecord.models.interview.other')}
                                </dd>
                            </div>
                            <div className="DescriptionList-group">
                                <dt className="DescriptionList-term">
                                    {t('modules.catalog.subjects')}
                                </dt>
                                <dd className="DescriptionList-description">
                                    {collection?.subjects.map((s, i) => (
                                        <span key={`subject-${i}`}>
                                            {s.descriptor[locale]}
                                            {i <
                                                collection?.subjects.length -
                                                    1 && ', '}
                                        </span>
                                    ))}
                                </dd>
                            </div>
                            <div className="DescriptionList-group">
                                <dt className="DescriptionList-term">
                                    {t('modules.catalog.level_of_indexing')}
                                </dt>
                                <dd className="DescriptionList-description">
                                    {collection?.levels_of_indexing.map(
                                        (s, i) => (
                                            <span key={`loi-${i}`}>
                                                {`${s.count} ${s.descriptor[locale]}`}
                                                {i <
                                                    collection
                                                        ?.levels_of_indexing
                                                        .length -
                                                        1 && ', '}
                                            </span>
                                        )
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </ErrorBoundary>
            </ScrollToTop>
        </Fetch>
    );
}
