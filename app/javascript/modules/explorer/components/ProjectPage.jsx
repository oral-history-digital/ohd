import { useTrackPageView } from 'modules/analytics';
import { useIsEditor } from 'modules/archive';
import { useGetProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { LinkButton, SmartImage } from 'modules/ui';
import { ScrollToTop } from 'modules/user-agent';
import { Helmet } from 'react-helmet';
import { FaArrowRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

import { getProjectUrl } from '../utils';
import CollectionList from './CollectionList';
import {
    Citation,
    GenericDetail,
    GenericPeople,
    IndexingLevels,
    Institutions,
    InterviewLanguages,
    InterviewStats,
    MediaTypes,
    ProjectDomain,
    PublicationDate,
    RichtextDetail,
    Subjects,
    Website,
    XmlLinks,
    YearRange,
} from './details';

export function ProjectPage() {
    const { t, locale } = useI18n();
    const id = Number(useParams().id);
    const { project } = useGetProject({ id, lite: true });
    const isEditviewActive = useIsEditor();
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

    const toProjectButton = (
        <LinkButton
            buttonText={t('explorer.view_project_page')}
            variant="contained"
            to={projectUrl}
            isExternal={isExternalProjectLink}
            target={isExternalProjectLink ? '_blank' : '_self'}
            endIcon={<FaArrowRight />}
        />
    );

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
                                {toProjectButton}

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
                                <GenericPeople
                                    people={project.cooperation_partners}
                                    labelKey="activerecord.attributes.project.cooperation_partner"
                                    groupClassName="DescriptionList-group--cooperation-partner"
                                />
                                <GenericPeople
                                    people={project.leaders}
                                    labelKey="activerecord.attributes.project.leader"
                                    groupClassName="DescriptionList-group--leader"
                                />
                                <GenericPeople
                                    people={project.managers}
                                    labelKey="activerecord.attributes.project.manager"
                                    groupClassName="DescriptionList-group--manager"
                                />
                                <GenericPeople
                                    people={project.funders}
                                    labelKey="activerecord.attributes.project.funder"
                                    groupClassName="DescriptionList-group--funders"
                                />
                                <PublicationDate
                                    publicationDate={project.publication_date}
                                />
                                {isEditviewActive && (
                                    <GenericDetail
                                        labelKey="activerecord.attributes.project.shortname"
                                        value={project.shortname}
                                    />
                                )}
                                <Citation
                                    type="project"
                                    institutions={project.institutions}
                                    projectName={title}
                                    projectId={project.id}
                                />{' '}
                                {!project.is_catalog && (
                                    <GenericDetail
                                        labelKey="explorer.export_formats.label"
                                        value={t(
                                            'explorer.export_formats.description'
                                        )}
                                    />
                                )}
                                <XmlLinks
                                    projectShortname={project.shortname}
                                />
                                <div className="u-mv-large">
                                    {toProjectButton}
                                </div>
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

                    <CollectionList project={project} />
                </div>
            </ErrorBoundary>
        </ScrollToTop>
    );
}

export default ProjectPage;
