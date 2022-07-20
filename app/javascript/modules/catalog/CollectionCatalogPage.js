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

export default function CollectionCatalogPage() {
    const projects = useSelector(getProjects);
    const collections = useSelector(getCollections);
    const { t, locale } = useI18n();
    const { id } = useParams();
    const pathBase = usePathBase();

    const collection = collections[id];

    if (!collection) {
        return (
            <Navigate to={`${pathBase}/not_found`} replace />
        );
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
                    <p className="Paragraph u-mb">
                        {t('activerecord.models.project.one')}
                        {' '}
                        <Link to={`/${locale}/catalog/archives/${project.id}`}>{project.name[locale]}</Link>
                    </p>

                    <p className="Paragraph u-mb">
                        {collection.notes[locale]}
                    </p>

                    <p className="Paragraph u-mb">
                        {t('modules.catalog.web_page')}
                        {': '}
                        <a
                            href={collection.homepage[locale]}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {collection.homepage[locale]}
                        </a>
                    </p>

                    <p className="Paragraph u-mb">
                        {t('modules.catalog.volume')}
                        {': '}
                        <LinkOrA project={project} to={`searches/archive?collection_id[]=${collection.id}`}>
                            {collection.num_interviews}
                            {' '}
                            {t('activerecord.models.interview.other')}
                        </LinkOrA>
                    </p>
                </div>
            </ErrorBoundary>
        </ScrollToTop>
    );
}
