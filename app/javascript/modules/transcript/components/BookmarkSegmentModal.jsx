import classNames from 'classnames';
import { getCurrentInterview } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { WorkbookItemForm, useWorkbook } from 'modules/workbook';
import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function BookmarkSegmentModal({
    segment,
    trigger,
    triggerClassName,
}) {
    const { t } = useI18n();
    const interview = useSelector(getCurrentInterview);
    const { savedSegments } = useWorkbook();

    const hasBookmarks = (savedSegments || []).some(
        (annotation) =>
            annotation.reference_id === segment.id &&
            annotation.reference_type === 'Segment'
    );

    // Default to star trigger if not provided
    const defaultTrigger = <FaStar className="Icon Icon--unobtrusive" />;
    const defaultTriggerClassName = classNames('Button--hover', {
        'Segment-hiddenButton': !hasBookmarks,
    });

    return (
        <Modal
            title={t('save_user_annotation')}
            trigger={trigger || defaultTrigger}
            triggerClassName={triggerClassName || defaultTriggerClassName}
        >
            {(closeModal) => (
                <WorkbookItemForm
                    interview={interview}
                    description=""
                    properties={{
                        time: segment.time,
                        tape_nbr: segment.tape_nbr,
                        segmentIndex: segment.id,
                        interview_archive_id: interview.archive_id,
                    }}
                    reference_id={segment.id}
                    reference_type="Segment"
                    media_id={interview.archive_id}
                    segment={segment}
                    type="UserAnnotation"
                    workflow_state="private"
                    submitLabel={t('modules.workbook.bookmark')}
                    onSubmit={closeModal}
                    onCancel={closeModal}
                />
            )}
        </Modal>
    );
}

BookmarkSegmentModal.propTypes = {
    segment: PropTypes.object.isRequired,
    trigger: PropTypes.node,
    triggerClassName: PropTypes.string,
};
