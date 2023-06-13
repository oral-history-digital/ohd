import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Checkbox } from 'modules/ui';
import queryString from 'query-string';

import { OHD_DOMAINS } from 'modules/constants';
import { LinkOrA } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { SlideShowSearchResults } from 'modules/interview-search';
import { AuthorizedContent } from 'modules/auth';
import { useArchiveSearch } from 'modules/search';
import { useInterviewSearch } from 'modules/interview-search';
import ThumbnailBadge from './ThumbnailBadge';
import InterviewPreviewInner from './InterviewPreviewInner';

export default function InterviewPreview({
    statuses,
    interview,
    projects,
    setArchiveId,
    selectedArchiveIds,
    addRemoveArchiveId,
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { locale } = useI18n();
    const project = projects[interview.project_id];
    const projectId = project.identifier;
    const { fulltext } = useArchiveSearch();

    const params = { fulltext };
    const paramStr = queryString.stringify(params, { skipNull: true });
    const linkPath = `interviews/${interview.archive_id}?${paramStr}`;

    /* TODO: Only load search results in certain cases.
      project.archive_domain === window.location.origin ||
      !project.archive_domain ||
      project.archive_domain === ''
    */

    const { isLoading, numResults, data: searchResults } =
        useInterviewSearch(interview.archive_id, fulltext);

    const onOHD = OHD_DOMAINS[railsMode] === window.location.origin;
    const showSlideShow = (onOHD && (!project.archive_domain || project.archive_domain === '')) || project.archive_domain === window.location.origin;

    const doSetArchiveId = () => setArchiveId(interview.archive_id);

    if (statuses[interview.archive_id] === 'deleted') {
        return null;
    }

    return (
        <div className={classNames('InterviewCard', { 'is-expanded': isExpanded })}>
            <ThumbnailBadge
                loading={isLoading}
                numSearchResults={numResults}
                onClick={() => setIsExpanded(prev => !prev)}
            />
            <LinkOrA
                project={project}
                to={linkPath}
                onLinkClick={doSetArchiveId}
                className="InterviewCard-link"
            >
                <InterviewPreviewInner
                    interview={interview}
                    project={project}
                    locale={locale}
                    isExpanded={isExpanded}
                />
            </LinkOrA>

            {
                showSlideShow && isExpanded && searchResults && numResults > 0 && (
                    <div className="slider">
                        <div className="archive-search-found-segments">
                            <SlideShowSearchResults
                                interview={interview}
                                searchResults={searchResults}
                                projectId={projectId}
                                project={project}
                            />
                        </div>
                    </div>
                )
            }

            <AuthorizedContent object={{ type: 'Interview', interview_id: interview.id }} action='update'>
                <div>
                    <Checkbox
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
    interview: PropTypes.object.isRequired,
    projects: PropTypes.object.isRequired,
    statuses: PropTypes.object.isRequired,
    selectedArchiveIds: PropTypes.array,
    setArchiveId: PropTypes.func.isRequired,
    addRemoveArchiveId: PropTypes.func.isRequired,
};
