import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaEyeSlash } from 'react-icons/fa';
import classNames from 'classnames';

import { OHD_DOMAIN_PRODUCTION, OHD_DOMAIN_DEVELOPMENT } from 'modules/layout';
import { LinkOrA, usePathBase } from 'modules/routes';
import { SlideShowSearchResults } from 'modules/interview-search';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import missingStill from 'assets/images/missing_still.png';
import ThumbnailBadge from './ThumbnailBadge';
import ThumbnailMetadataContainer from './ThumbnailMetadataContainer';
import searchResultCount from './searchResultCount';

export default function InterviewPreview({
    fulltext,
    statuses,
    interview,
    locale,
    projects,
    setArchiveId,
    setProjectId,
    selectedArchiveIds,
    addRemoveArchiveId,
    interviewSearchResults,
    searchInInterview,
}) {
    const pathBase = usePathBase();
    const [isExpanded, setIsExpanded] = useState(false);
    const project = projects[interview.project_id];
    const projectId = project.identifier;

    const onOHD = [OHD_DOMAIN_PRODUCTION, OHD_DOMAIN_DEVELOPMENT].indexOf(window.location.origin) > -1;
    const showSlideShow = (onOHD && !project.archive_domain) || project.archive_domain === window.location.origin;

    useEffect(() => {
        if ( fulltext && (
            project.archive_domain === window.location.origin
        )) {
            searchInInterview(`${pathBase}/searches/interview`, {fulltext, id: interview.archive_id});
        }
    }, []);

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
                <InnerContent interview={interview} project={project} locale={locale} isExpanded={isExpanded} />
            </LinkOrA>

            {
                showSlideShow && isExpanded && searchResults && resultCount > 0 && (
                    <div className="slider">
                        <div className="archive-search-found-segments">
                            <SlideShowSearchResults
                                interview={interview}
                                searchResults={searchResults}
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
    project,
    locale,
    isExpanded
}) {
    console.log(interview);

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

            <p className="search-result-name">
                {interview.workflow_state === 'unshared' && <FaEyeSlash />}
                {interview.short_title?.[locale] || interview.anonymous_title[locale]}
            </p>

            {!isExpanded && (
                <ThumbnailMetadataContainer interview={interview} project={project} />
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
    setArchiveId: PropTypes.func.isRequired,
    addRemoveArchiveId: PropTypes.func.isRequired,
    searchInInterview: PropTypes.func.isRequired,
};
