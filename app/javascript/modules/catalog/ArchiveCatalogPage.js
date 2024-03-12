import { Helmet } from 'react-helmet';
import { useParams, Navigate } from 'react-router-dom';
import { FaChevronRight} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useTrackPageView } from 'modules/analytics';
import { ErrorBoundary } from 'modules/react-toolbox';
import { ScrollToTop } from 'modules/user-agent';
import { getPublicProjects, getInstitutions } from 'modules/data';
import { usePathBase, LinkOrA } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { Breadcrumbs } from 'modules/ui';
import ArchiveCatalog from './ArchiveCatalog';

export default function ArchiveCatalogPage() {
    const projects = useSelector(getPublicProjects);
    const allInstitutions = useSelector(getInstitutions);
    const { t, locale } = useI18n();
    const id = Number(useParams().id);
    const pathBase = usePathBase();
    useTrackPageView();

    const project = projects.find(p => p.id === id);

    if (!project) {
        return (
            <Navigate to={`${pathBase}/not_found`} replace />
        );
    }

    const title = project.name[locale];

    const institutions = Object.values(project.institution_projects)
        .map(ip => allInstitutions[ip.institution_id]);

    const projectTranslation = project.translations_attributes.find(trans =>
        trans.locale === locale);

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
                        <LinkOrA project={project} to="" className="ProminentLink">
                            <FaChevronRight className="ProminentLink-icon u-mr-tiny" />
                            {t('modules.catalog.go_to_archive')}
                        </LinkOrA>
                    </p>

                    <dl className="DescriptionList">
                        <dt className="DescriptionList-term">
                            {institutions.length === 1 ?
                                t('activerecord.models.institution.one') :
                                t('activerecord.models.institution.other')
                            }
                        </dt>
                        <dd className="DescriptionList-description">
                            <ul className="UnorderedList">
                                {institutions.map(institution => (
                                    <li key={institution.id}>
                                        <Link to={`/${locale}/catalog/institutions/${institution.id}`}>
                                            {institution.name[locale]}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </dd>
                    </dl>

                    {projectTranslation?.introduction && (<>
                        <dt className="DescriptionList-term">
                            {t('modules.catalog.description')}
                        </dt>
                        <dd
                            className="DescriptionList-description"
                            dangerouslySetInnerHTML={{__html: projectTranslation?.introduction}}
                        />
                    </>)}

                    {project.cooperation_partner && (<>
                        <dt className="DescriptionList-term">
                            {t('activerecord.attributes.project.cooperation_partner')}
                        </dt>
                        <dd className="DescriptionList-description">
                            {project.cooperation_partner}
                        </dd>
                    </>)}

                    {project.leader && (<>
                        <dt className="DescriptionList-term">
                            {t('activerecord.attributes.project.leader')}
                        </dt>
                        <dd className="DescriptionList-description">
                            {project.leader}
                        </dd>
                    </>)}

                    {project.manager && (<>
                        <dt className="DescriptionList-term">
                            {t('activerecord.attributes.project.manager')}
                        </dt>
                        <dd className="DescriptionList-description">
                            {project.manager}
                        </dd>
                    </>)}

                    {project.domain && (<>
                        <dt className="DescriptionList-term">
                            {t('activerecord.attributes.project.domain')}
                        </dt>
                        <dd className="DescriptionList-description">
                            <a
                                href={project.domain}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {project.domain}
                            </a>
                        </dd>
                    </>)}

                    {project.pseudo_funder_names?.length > 0 && (<>
                        <dt className="DescriptionList-term">
                            {t('activerecord.attributes.project.pseudo_funder_names')}
                        </dt>
                        <dd className="DescriptionList-description">
                            <ul className="UnorderedList">
                                {project.pseudo_funder_names.map(name =>
                                    <li key={name}>{name}</li>
                                )}
                            </ul>
                        </dd>
                    </>)}

                    {project.archive_domain && (<>
                        <dt className="DescriptionList-term">
                            {t('activerecord.attributes.project.archive_domain')}
                        </dt>
                        <dd className="DescriptionList-description">
                            <a
                                href={project.archive_domain}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {project.archive_domain}
                            </a>
                        </dd>
                    </>)}

                    <dt className="DescriptionList-term">
                        {t('modules.catalog.volume')}
                    </dt>
                    <dd className="DescriptionList-description">
                        {project.num_interviews}
                        {' '}
                        {project.num_interviews === 1 ?
                            t('activerecord.models.interview.one') :
                            t('activerecord.models.interview.other')
                        }
                    </dd>

                    <ArchiveCatalog id={Number.parseInt(id)} />
                </div>
            </ErrorBoundary>
        </ScrollToTop>
    );
}
