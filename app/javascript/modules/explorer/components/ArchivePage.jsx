import { useTrackPageView } from 'modules/analytics';
import { useLoadCompleteProject } from 'modules/data';
import { useI18n, useProjectTranslation } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { LinkOrA } from 'modules/routes';
import { ScrollToTop } from 'modules/user-agent';
import { sanitizeHtml } from 'modules/utils';
import { Helmet } from 'react-helmet';
import { FaChevronRight } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';

import CollectionList from './CollectionList';

// TODO: This component is legacy code from the old catalog component before redesign.
// It should be revised, especially regarding how data is loaded

export function ArchivePage() {
    const { t, locale } = useI18n();
    const id = Number(useParams().id);
    const project = useLoadCompleteProject(id);
    useTrackPageView();
    const projectTranslation = useProjectTranslation(project);

    if (!project) {
        return (
            <ScrollToTop>
                <ErrorBoundary>
                    <div className="wrapper-content interviews" />
                </ErrorBoundary>
            </ScrollToTop>
        );
    }

    const title = project.name?.[locale] || '';

    return (
        <ScrollToTop>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <ErrorBoundary>
                <div className="wrapper-content interviews">
                    <h1 className="search-results-title u-mb">{title}</h1>

                    <p className="Paragraph u-mb">
                        <LinkOrA
                            project={project}
                            to=""
                            className="ProminentLink"
                        >
                            <FaChevronRight className="ProminentLink-icon u-mr-tiny" />
                            {t('modules.catalog.go_to_archive')}
                        </LinkOrA>
                    </p>

                    <dl className="DescriptionList">
                        <div className="DescriptionList-group">
                            <dt className="DescriptionList-term">
                                {project.institution_projects?.length === 1
                                    ? t('activerecord.models.institution.one')
                                    : t(
                                          'activerecord.models.institution.other'
                                      )}
                            </dt>
                            <dd className="DescriptionList-description">
                                <ul className="UnorderedList">
                                    {Object.values(
                                        project.institution_projects || {}
                                    )?.map((ip) => (
                                        <li key={ip.institution_id}>
                                            <Link
                                                to={`/${locale}/catalog/institutions/${ip.institution_id}`}
                                            >
                                                {ip.name[locale]}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </div>
                    </dl>

                    {projectTranslation?.introduction && (
                        <div className="DescriptionList-group">
                            <dt className="DescriptionList-term">
                                {t('modules.catalog.description')}
                            </dt>
                            <dd
                                className="DescriptionList-description"
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(
                                        projectTranslation?.introduction,
                                        'RICH_TEXT'
                                    ),
                                }}
                            />
                        </div>
                    )}

                    {project.cooperation_partner && (
                        <div className="DescriptionList-group">
                            <dt className="DescriptionList-term">
                                {t(
                                    'activerecord.attributes.project.cooperation_partner'
                                )}
                            </dt>
                            <dd className="DescriptionList-description">
                                {project.cooperation_partner}
                            </dd>
                        </div>
                    )}

                    {project.leader && (
                        <div className="DescriptionList-group">
                            <dt className="DescriptionList-term">
                                {t('activerecord.attributes.project.leader')}
                            </dt>
                            <dd className="DescriptionList-description">
                                {project.leader}
                            </dd>
                        </div>
                    )}

                    {project.manager && (
                        <div className="DescriptionList-group">
                            <dt className="DescriptionList-term">
                                {t('activerecord.attributes.project.manager')}
                            </dt>
                            <dd className="DescriptionList-description">
                                {project.manager}
                            </dd>
                        </div>
                    )}

                    {project.domain && (
                        <div className="DescriptionList-group">
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
                        </div>
                    )}

                    {project.pseudo_funder_names?.length > 0 && (
                        <div className="DescriptionList-group">
                            <dt className="DescriptionList-term">
                                {t(
                                    'activerecord.attributes.project.pseudo_funder_names'
                                )}
                            </dt>
                            <dd className="DescriptionList-description">
                                <ul className="UnorderedList">
                                    {project.pseudo_funder_names?.map(
                                        (name) => (
                                            <li key={name}>{name}</li>
                                        )
                                    )}
                                </ul>
                            </dd>
                        </div>
                    )}

                    {project.archive_domain && (
                        <div className="DescriptionList-group">
                            <dt className="DescriptionList-term">
                                {t(
                                    'activerecord.attributes.project.archive_domain'
                                )}
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
                        </div>
                    )}
                    <div className="DescriptionList-group">
                        <dt className="DescriptionList-term">
                            {t('modules.catalog.volume')}
                        </dt>
                        <dd className="DescriptionList-description">
                            {project.num_interviews}{' '}
                            {project.num_interviews === 1
                                ? t('activerecord.models.interview.one')
                                : t('activerecord.models.interview.other')}
                        </dd>
                    </div>

                    {project.publication_date && (
                        <div className="DescriptionList-group">
                            <dt className="DescriptionList-term">
                                {t('modules.catalog.publication_date')}
                            </dt>
                            <dd className="DescriptionList-description">
                                {project.publication_date}
                            </dd>
                        </div>
                    )}

                    {project?.subjects?.length > 0 && (
                        <div className="DescriptionList-group">
                            <dt className="DescriptionList-term">
                                {t('modules.catalog.subjects')}
                            </dt>
                            <dd className="DescriptionList-description">
                                {project?.subjects.map((s, i) => (
                                    <span key={`subject-${i}`}>
                                        {s.descriptor[locale]}
                                        {i < project?.subjects?.length - 1 &&
                                            ', '}
                                    </span>
                                ))}
                            </dd>
                        </div>
                    )}

                    {project?.levels_of_indexing?.length > 0 && (
                        <div className="DescriptionList-group">
                            <dt className="DescriptionList-term">
                                {t('modules.catalog.level_of_indexing')}
                            </dt>
                            <dd className="DescriptionList-description">
                                {project?.levels_of_indexing.map((s, i) => (
                                    <span key={`loi-${i}`}>
                                        {`${s.count} ${s.descriptor[locale]}`}
                                        {i <
                                            project?.levels_of_indexing
                                                ?.length -
                                                1 && ', '}
                                    </span>
                                ))}
                            </dd>
                        </div>
                    )}

                    <CollectionList archive={project} />
                </div>
            </ErrorBoundary>
        </ScrollToTop>
    );
}

export default ArchivePage;
