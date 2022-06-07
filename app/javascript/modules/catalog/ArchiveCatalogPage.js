import { Helmet } from 'react-helmet';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ErrorBoundary } from 'modules/react-toolbox';
import { ScrollToTop } from 'modules/user-agent';
import { getProjects, getInstitutions } from 'modules/data';
import { usePathBase, LinkOrA } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { Breadcrumbs } from 'modules/ui';
import ArchiveCatalog from './ArchiveCatalog';

export default function ArchiveCatalogPage() {
    const projects = useSelector(getProjects);
    const allInstitutions = useSelector(getInstitutions);
    const { t, locale } = useI18n();
    const { id } = useParams();
    const pathBase = usePathBase();

    const project = projects[id];

    if (!project) {
        return (
            <Navigate to={`${pathBase}/not_found`} replace />
        );
    }

    const title = project.name[locale];

    const institutions = Object.values(project.institution_projects)
        .map(ip => allInstitutions[ip.institution_id]);

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
                        {t('activerecord.models.project.other')}
                        {title}
                    </Breadcrumbs>

                    <h1 className="search-results-title u-mb">
                        {title}
                    </h1>
                    <p className="Paragraph u-mb">
                        {institutions.length === 1 ?
                            t('activerecord.models.institution.one') :
                            t('activerecord.models.institution.other')
                        }
                        {' '}
                        {institutions.map((institution, index) => (
                            <>
                                <Link
                                    key={institution.id}
                                    to={`/${locale}/catalog/institutions/${institution.id}`}
                                >
                                    {institution.name[locale]}
                                </Link>
                                {index < (institutions.length - 1) && ', '}
                            </>
                        ))}
                    </p>

                    <p className="Paragraph u-mb">
                        {t('modules.catalog.volume')}
                        {': '}
                        <LinkOrA project={project} to="">
                            {project.num_interviews}
                            {' '}
                            {t('activerecord.models.interview.other')}
                        </LinkOrA>
                    </p>
                    <p className="Paragraph u-mb">
                        <a
                            href={project.archive_domain}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {project.archive_domain}
                        </a>
                    </p>

                    <ArchiveCatalog id={Number.parseInt(id)} />
                </div>
            </ErrorBoundary>
        </ScrollToTop>
    );
}
