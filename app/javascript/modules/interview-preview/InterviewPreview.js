import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaEyeSlash } from 'react-icons/fa';
import classNames from 'classnames';

import { OHD_DOMAIN_PRODUCTION, OHD_DOMAIN_DEVELOPMENT } from 'modules/layout';
import { LinkOrA } from 'modules/routes';
import { SlideShowSearchResults } from 'modules/interview-search';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import missingStill from 'assets/images/missing_still.png';
import loadIntervieweeWithAssociations from './loadIntervieweeWithAssociations';
import ThumbnailBadge from './ThumbnailBadge';
import ThumbnailMetadataContainer from './ThumbnailMetadataContainer';
import searchResultCount from './searchResultCount';

export default function InterviewPreview({
    fulltext,
    statuses,
    interview,
    locale,
    projects,
    peopleStatus,
    setArchiveId,
    setProjectId,
    selectedArchiveIds,
    addRemoveArchiveId,
    interviewSearchResults,
    searchInInterview,
    fetchData,
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const project = projects[interview.project_id];
    const projectId = project.identifier;

    const onOHD = [OHD_DOMAIN_PRODUCTION, OHD_DOMAIN_DEVELOPMENT].indexOf(window.location.origin) > -1;
    const showSlideShow = (onOHD && !project.archive_domain) || project.archive_domain === window.location.origin;

    const intervieweeContribution = Object.values(interview.contributions)
        .find(c => c.contribution_type === 'interviewee');
    const interviewee = project.people[intervieweeContribution?.person_id];

    useEffect(() => {
        if ( fulltext && (
            project.archive_domain === window.location.origin
        )) {
            searchInInterview(`${hrefOrPathBase}/searches/interview`, {fulltext, id: interview.archive_id});
        }
    }, []);

    useEffect(() => {
        loadIntervieweeWithAssociations({ interview, peopleStatus, fetchData, locale, projectId, projects });
    });

    const doSetArchiveId = () => setArchiveId(interview.archive_id);

    const searchResults = interviewSearchResults[interview.archive_id];
    const resultCount = searchResultCount(searchResults);

    if (statuses[interview.archive_id] === 'deleted') {
        return null;
    }

    return (
        <div className={classNames('search-result', { 'detailed': isExpanded })}>
            {
                searchResults && resultCount > 0 && (
                    <ThumbnailBadge
                        numberOfSearchResults={resultCount}
                        onClick={() => setIsExpanded(prev => !prev)}
                    />
                )
            }

            <LinkOrA
                project={project}
                to={`interviews/${interview.archive_id}`}
                onLinkClick={doSetArchiveId}
                className="search-result-link"
            >
                <InnerContent interview={interview} project={project} locale={locale} interviewee={interviewee} isExpanded={isExpanded} />
            </LinkOrA> :

            {
                showSlideShow && isExpanded && searchResults && resultCount > 0 && (
                    <div className="slider">
                        <div className="archive-search-found-segments">
                            <SlideShowSearchResults
                                interview={interview}
                                searchResults={searchResults}
                                hrefOrPath={hrefOrPath}
                                projectId={projectId}
                            />
                        </div>
                    </div>
                )
            }

            <AuthorizedContent object={{ type: 'Interview', interview_id: interview.id }} action='update'>
                <div>
                    <input
                        type='checkbox'
                        className='export-checkbox'
                        checked={selectedArchiveIds.indexOf(interview.archive_id) > 0}
                        onChange={() => {addRemoveArchiveId(interview.archive_id)}}
                    />
                </div>
            </AuthorizedContent>
        </div>
    );
}

function InnerContent({
    interview,
    interviewee,
    project,
    locale,
    isExpanded
}) {
    return (
        <>
            <div className="search-result-img aspect-ratio">
                <img
                    className="aspect-ratio__inner"
                    src={interview.still_url || 'missing_still'}
                    onError={ (e) => { e.target.src = missingStill; }}
                    alt=""
                />
            </div>

            <AuthShowContainer ifLoggedIn>
                <p className="search-result-name">
                    {interview.workflow_state === 'unshared' && <FaEyeSlash />}
                    {interview.short_title && interview.short_title[locale]}
                </p>
            </AuthShowContainer>
            <AuthShowContainer ifLoggedOut ifNoProject>
                <p className="search-result-name">
                    {interview.workflow_state === 'unshared' && <FaEyeSlash />}
                    {(project && project.fullname_on_landing_page) ? interview.title[locale] : interview.anonymous_title[locale]}
                </p>
            </AuthShowContainer>

            {interviewee?.associations_loaded && !isExpanded && (
                <ThumbnailMetadataContainer interview={interview} interviewee={interviewee} project={project} />
            )}
        </>
    );
};
InterviewPreview.propTypes = {
    fulltext: PropTypes.string,
    interview: PropTypes.object.isRequired,
    interviewSearchResults: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    projects: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    statuses: PropTypes.object.isRequired,
    selectedArchiveIds: PropTypes.array,
    peopleStatus: PropTypes.object.isRequired,
    setArchiveId: PropTypes.func.isRequired,
    addRemoveArchiveId: PropTypes.func.isRequired,
    searchInInterview: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
};
