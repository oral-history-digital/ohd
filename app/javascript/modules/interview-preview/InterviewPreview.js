import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import queryString from 'query-string';
import keyBy from 'lodash.keyby';
import { FaStar, FaRegStar } from 'react-icons/fa';

import { LinkOrA } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { Modal, Checkbox } from 'modules/ui';
import { WorkbookItemForm, useWorkbook } from 'modules/workbook';
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
    const { t, locale } = useI18n();
    const project = projects[interview.project_id];
    const projectId = project.shortname;
    const { fulltext } = useArchiveSearch();
    const { savedInterviews } = useWorkbook();

    const params = { fulltext };
    const paramStr = queryString.stringify(params, { skipNull: true });
    const linkPath = `interviews/${interview.archive_id}?${paramStr}`;

    const { isLoading, numResults, data: searchResults } =
        useInterviewSearch(interview.archive_id, fulltext, project);

    const doSetArchiveId = () => setArchiveId(interview.archive_id);

    if (statuses[interview.archive_id] === 'deleted') {
        return null;
    }

    const itemsByInterview = keyBy(savedInterviews, 'media_id');
    const isInWorkbook = itemsByInterview && interview.archive_id in itemsByInterview;

    return (
        <div className={classNames('InterviewCard', { 'is-expanded': isExpanded })}>
            <ThumbnailBadge
                loading={isLoading}
                numSearchResults={numResults}
                onClick={() => setIsExpanded(prev => !prev)}
            />
            <Modal
                title={isInWorkbook ? '' : t('save_interview_reference_tooltip')}
                trigger={isInWorkbook ? <FaStar /> : <FaRegStar />}
                triggerClassName={classNames('InterviewCard-star', {
                    'is-active': isInWorkbook,
                })}
                disabled={isInWorkbook}
            >
                {closeModal => (
                    <WorkbookItemForm
                        project={project}
                        interview={interview}
                        description=""
                        properties={{title: interview.title}}
                        reference_id={interview.id}
                        reference_type='Interview'
                        media_id={interview.archive_id}
                        type='InterviewReference'
                        submitLabel={t('modules.workbook.bookmark')}
                        onSubmit={closeModal}
                        onCancel={closeModal}
                    />
                )}
            </Modal>
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

            {isExpanded && searchResults && numResults > 0 && (
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
            )}

            <AuthorizedContent object={interview} action='update'>
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
