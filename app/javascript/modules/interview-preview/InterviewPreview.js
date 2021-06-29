import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaEyeSlash } from 'react-icons/fa';
import classNames from 'classnames';

import { SlideShowSearchResults } from 'modules/interview-search';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { usePathBase } from 'modules/routes';
import missingStill from 'assets/images/missing_still.png';
import loadIntervieweeWithAssociations from './loadIntervieweeWithAssociations';
import ThumbnailBadge from './ThumbnailBadge';
import ThumbnailMetadataContainer from './ThumbnailMetadataContainer';
import searchResultCount from './searchResultCount';

export default function InterviewPreview({
    fulltext,
    statuses,
    interview,
    interviewee,
    locale,
    project,
    projectId,
    projects,
    people,
    peopleStatus,
    setArchiveId,
    selectedArchiveIds,
    addRemoveArchiveId,
    interviewSearchResults,
    searchInInterview,
    fetchData,
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const pathBase = usePathBase();

    useEffect(() => {
        if (fulltext) {
            searchInInterview(`${pathBase}/searches/interview`, {fulltext, id: interview.archive_id});
        }
    }, []);

    useEffect(() => {
        loadIntervieweeWithAssociations({ interview, people, peopleStatus, fetchData, locale, projectId, projects });
    });

    const searchResults = interviewSearchResults[interview.archive_id];
    const resultCount = searchResultCount(searchResults);

    if (statuses[interview.archive_id] === 'deleted') {
        return null;
    }

    return (
        <div className={classNames('interview-preview', 'search-result', {
            'detailed': isExpanded,
        })}>
            {
                resultCount > 0 && (
                    <ThumbnailBadge
                        numberOfSearchResults={resultCount}
                        onClick={() => setIsExpanded(prev => !prev)}
                    />
                )
            }
            <Link
                className="search-result-link"
                onClick={() => setArchiveId(interview.archive_id)}
                to={pathBase + '/interviews/' + interview.archive_id}
            >
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
                        {project.fullname_on_landing_page ? interview.title[locale] : interview.anonymous_title[locale]}
                    </p>
                </AuthShowContainer>

                {interviewee?.associations_loaded && !isExpanded && (
                    <ThumbnailMetadataContainer interview={interview} />
                )}
            </Link>

            {
                resultCount > 0 && (
                    <div className="slider">
                        <div className="archive-search-found-segments">
                            <SlideShowSearchResults
                                interview={interview}
                                searchResults={searchResults}
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

InterviewPreview.propTypes = {
    fulltext: PropTypes.string,
    interview: PropTypes.object.isRequired,
    interviewee: PropTypes.object.isRequired,
    interviewSearchResults: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    statuses: PropTypes.object.isRequired,
    selectedArchiveIds: PropTypes.array,
    people: PropTypes.object.isRequired,
    peopleStatus: PropTypes.object.isRequired,
    setArchiveId: PropTypes.func.isRequired,
    addRemoveArchiveId: PropTypes.func.isRequired,
    searchInInterview: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
};
