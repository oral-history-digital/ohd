import { useState } from 'react';

import classNames from 'classnames';
import keyBy from 'lodash.keyby';
import { AuthorizedContent } from 'modules/auth';
import { useProjectDetail } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { SlideShowSearchResults } from 'modules/interview-search';
import { useInterviewSearch } from 'modules/interview-search';
import { LinkOrA } from 'modules/routes';
import { useArchiveSearch } from 'modules/search';
import { Checkbox, Modal } from 'modules/ui';
import { WorkbookItemForm, useWorkbook } from 'modules/workbook';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { FaRegStar, FaStar } from 'react-icons/fa';

import InterviewPreviewInner from './InterviewPreviewInner';
import ThumbnailBadge from './ThumbnailBadge';

/**
 * Shows an interview card using its project's display details from Redux.
 *
 * @param {Object} props - Preview properties.
 * @param {Object} props.statuses - Interview request statuses by archive ID.
 * @param {Object} props.interview - Interview summary.
 * @param {boolean} props.isLoggedIn - Whether bookmarking is available.
 * @param {Function} props.setArchiveId - Selects the interview for navigation.
 * @param {string[]} props.selectedArchiveIds - Interviews selected for export.
 * @param {Function} props.addRemoveArchiveId - Toggles export selection.
 * @returns {?React.ReactElement} Preview card, or null for a deleted interview.
 */
export default function InterviewPreview({
    statuses,
    interview,
    isLoggedIn,
    setArchiveId,
    selectedArchiveIds,
    addRemoveArchiveId,
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { t, locale } = useI18n();
    const { project } = useProjectDetail(interview.project_id);
    const { fulltext } = useArchiveSearch();
    const { savedInterviews } = useWorkbook();

    const params = { fulltext };
    const paramStr = queryString.stringify(params, { skipNull: true });
    const linkPath = `interviews/${interview.archive_id}?${paramStr}`;

    const {
        isLoading,
        numResults,
        data: searchResults,
    } = useInterviewSearch(interview.archive_id, fulltext, project);

    const doSetArchiveId = () => setArchiveId(interview.archive_id);

    if (statuses[interview.archive_id] === 'deleted') {
        return null;
    }

    const itemsByInterview = keyBy(savedInterviews, 'media_id');
    const isInWorkbook =
        itemsByInterview && interview.archive_id in itemsByInterview;

    return (
        <div
            className={classNames('InterviewCard', {
                'is-expanded': isExpanded,
            })}
        >
            <ThumbnailBadge
                loading={isLoading}
                numSearchResults={numResults}
                onClick={() => setIsExpanded((prev) => !prev)}
            />
            {isLoggedIn && project && (
                <Modal
                    title={
                        isInWorkbook
                            ? ''
                            : t('save_interview_reference_tooltip')
                    }
                    trigger={isInWorkbook ? <FaStar /> : <FaRegStar />}
                    triggerClassName={classNames('InterviewCard-star', {
                        'is-active': isInWorkbook,
                    })}
                    disabled={isInWorkbook}
                >
                    {(closeModal) => (
                        <WorkbookItemForm
                            project={project}
                            interview={interview}
                            description=""
                            properties={{ title: interview.title }}
                            reference_id={interview.id}
                            reference_type="Interview"
                            media_id={interview.archive_id}
                            type="InterviewReference"
                            submitLabel={t('modules.workbook.bookmark')}
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
            )}
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

            {isExpanded && project && searchResults && numResults > 0 && (
                <div className="slider">
                    <div className="archive-search-found-segments">
                        <SlideShowSearchResults
                            interview={interview}
                            searchResults={searchResults}
                            project={project}
                        />
                    </div>
                </div>
            )}

            <AuthorizedContent object={interview} action="update">
                <div>
                    <Checkbox
                        className="export-checkbox"
                        checked={
                            selectedArchiveIds.indexOf(interview.archive_id) > 0
                        }
                        onChange={() => {
                            addRemoveArchiveId(interview.archive_id);
                        }}
                    />
                </div>
            </AuthorizedContent>
        </div>
    );
}

InterviewPreview.propTypes = {
    interview: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    statuses: PropTypes.object.isRequired,
    selectedArchiveIds: PropTypes.array,
    setArchiveId: PropTypes.func.isRequired,
    addRemoveArchiveId: PropTypes.func.isRequired,
};
