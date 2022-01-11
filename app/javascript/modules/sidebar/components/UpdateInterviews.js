import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';
import { getLocale, getProjectId } from 'modules/archive';
import { submitData, getProjects } from 'modules/data';

export default function UpdateInterviews({
    params,
    action,
    selectedArchiveIds,
}) {
    const { t } = useI18n();
    const dispatch = useDispatch();
    const locale = useSelector(getLocale);
    const projectId = useSelector(getProjectId);
    const projects = useSelector(getProjects);

    function updateInterviews(params) {
        selectedArchiveIds.forEach(archiveId => {
            const updatedParams = {
                ...params,
                id: archiveId,
            };
            dispatch(submitData({ locale, projectId, projects }, {interview: updatedParams}));
        });
    }

    return (
        <Modal
            title={t(`edit.interviews.${action}.title`)}
            trigger={t(`edit.interviews.${action}.title`)}
            triggerClassName="flyout-sub-tabs-content-ico-link"
        >
            {close => (
                <div>
                    {t(`edit.interviews.${action}.confirm_text`, {archive_ids: selectedArchiveIds.join(', ')})}

                    <button
                        type="button"
                        className="Button any-button"
                        onClick={() => {
                            updateInterviews(params);
                            close();
                        }}
                    >
                        {t('submit')}
                    </button>
                </div>
            )}
        </Modal>
    );
}

UpdateInterviews.propTypes = {
    params: PropTypes.object.isRequired,
    action: PropTypes.string.isRequired,
    selectedArchiveIds: PropTypes.array.isRequired,
};
