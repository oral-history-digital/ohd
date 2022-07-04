import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';

import { defaultTitle } from 'modules/interview-helpers';
import { getCurrentInterview } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { UserContentFormContainer } from 'modules/workbook';
import { Modal } from 'modules/ui';

export default function RememberSegmentButton({
    segment,
}) {
    const { t, locale } = useI18n();
    const interview = useSelector(getCurrentInterview);

    return (
        <Modal
            title={t('save_user_annotation')}
            trigger={<FaStar className="Icon Icon--unobtrusive" />}
            triggerClassName="Button--hover Segment-hiddenButton"
        >
            {closeModal => (
                <UserContentFormContainer
                    title={defaultTitle(interview, locale)}
                    description=''
                    properties={{
                        time: segment.time,
                        tape_nbr: segment.tape_nbr,
                        segmentIndex: segment.id,
                        interview_archive_id: interview.archive_id
                    }}
                    reference_id={segment.id}
                    reference_type="Segment"
                    media_id={segment.media_id}
                    segment={segment}
                    type="UserAnnotation"
                    workflow_state="private"
                    onSubmit={closeModal}
                    onCancel={closeModal}
                />
            )}
        </Modal>
    );
}

RememberSegmentButton.propTypes = {
    segment: PropTypes.object.isRequired,
};
