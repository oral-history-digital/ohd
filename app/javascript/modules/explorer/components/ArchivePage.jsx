import { useTrackPageView } from 'modules/analytics';
import { useGetProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { LinkButton, SmartImage } from 'modules/ui';
import { ScrollToTop } from 'modules/user-agent';
import { Helmet } from 'react-helmet';
import { FaChevronRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

import { getProjectUrl } from '../utils';
import CollectionList from './CollectionList';
import {
    CooperationPartner,
    IndexingLevels,
    Institutions,
    InterviewLanguages,
    InterviewStats,
    Leader,
    Manager,
    MediaTypes,
    ProjectDomain,
    PseudoFunderNames,
    PublicationDate,
    RichtextDetail,
    Subjects,
    Website,
    YearRange,
} from './details';

export function ArchivePage() {
    const { t, locale } = useI18n();
    const id = Number(useParams().id);
    const { project } = useGetProject(id, { lite: true });
    useTrackPageView();

    if (!project) {
        return (
            <ScrollToTop>
                <ErrorBoundary>
                    <div className="wrapper-content ProjectDetails" />
                </ErrorBoundary>
            </ScrollToTop>
        );
    }

    const title = project.display_name || project.name || '';

    const { url: projectUrl, isExternalUrl: isExternalProjectLink } =
        getProjectUrl(project, locale);

    return (
        <ScrollToTop>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <ErrorBoundary>
                <div className="wrapper-content ProjectDetails">
                    <h1 className="Page-main-title ProjectDetails-title u-mb">
                        {title}
                    </h1>
                    <div className="ProjectDetails-layout">
                        <div className="ProjectDetails-main">
                            <div className="ProjectDetails-actions">
                                <LinkButton
                                    buttonText={t('explorer.view_archive_page')}
                                    variant="text"
                                    to={projectUrl}
                                    isExternal={isExternalProjectLink}
                                    target={
                                        isExternalProjectLink
                                            ? '_blank'
                                            : '_self'
                                    }
                                    startIcon={
                                        <FaChevronRight className="ProminentLink-icon u-mr-tiny" />
                                    }
                                    size="lg"
                                    className="u-pl-none"
                                />

                                {project.logo?.url && (
                                    <SmartImage
                                        src={project.logo.url}
                                        alt={project.logo.alt || title}
                                        className="ProjectDetails-logo ProjectDetails-logo--inline"
                                    />
                                )}
                            </div>

                            <dl className="DescriptionList">
                                <Institutions
                                    institutions={project.institutions}
                                />
                                <RichtextDetail
                                    richtext={project.introduction}
                                    labelKey="modules.catalog.description"
                                />
                                <Website
                                    url={project.domain}
                                    labelKey="activerecord.attributes.project.domain"
                                />
                                <ProjectDomain
                                    domain={project.archive_domain}
                                />
                                <PublicationDate
                                    publicationDate={project.publication_date}
                                />

                                <InterviewStats counts={project.interviews} />
                                <MediaTypes mediaTypes={project?.media_types} />
                                <YearRange
                                    years={project.birth_year_range}
                                    labelKey="modules.catalog.birthyears"
                                />
                                <YearRange
                                    years={project.interview_year_range}
                                    labelKey="modules.catalog.period"
                                />
                                <InterviewLanguages
                                    languages={project.languages_interviews}
                                />
                                <IndexingLevels
                                    levels={project.levels_of_indexing}
                                />
                                <Subjects subjects={project.subjects} />
                                <CooperationPartner
                                    cooperationPartner={
                                        project.cooperation_partner
                                    }
                                />
                                <Leader leader={project.leader} />
                                <Manager manager={project.manager} />
                                <PseudoFunderNames
                                    pseudoFunderNames={
                                        project.pseudo_funder_names
                                    }
                                />
                            </dl>
                        </div>

                        {project.logo?.url && (
                            <div className="ProjectDetails-sidebar">
                                <SmartImage
                                    src={project.logo.url}
                                    alt={project.logo.alt || title}
                                    className="ProjectDetails-logo ProjectDetails-logo--sidebar"
                                />
                            </div>
                        )}
                    </div>

                    <CollectionList archive={project} />
                </div>
            </ErrorBoundary>
        </ScrollToTop>
    );
}

export default ArchivePage;
