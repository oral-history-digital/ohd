import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';
import { getLocale, getProjectId } from 'modules/archive';
import { submitData, getCurrentProject } from 'modules/data';

export default function UpdateInterviews({
    params,
    action,
    selectedArchiveIds,
}) {
    const { t } = useI18n();
    const dispatch = useDispatch();
    const locale = useSelector(getLocale);
    const projectId = useSelector(getProjectId);
    const project = useSelector(getCurrentProject);

    function updateInterviews(params) {
        selectedArchiveIds.forEach((archiveId) => {
            const updatedParams = {
                ...params,
                id: archiveId,
            };
            dispatch(
                submitData(
                    { locale, projectId, project },
                    { interview: updatedParams }
                )
            );
        });
    }

    return (
        <Modal
            title={t(`edit.interviews.${action}.title`)}
            trigger={t(`edit.interviews.${action}.title`)}
            triggerClassName="flyout-sub-tabs-content-ico-link"
        >
            {(close) => (
                <form className="Form">
                    {t(`edit.interviews.${action}.confirm_text`, {
                        archive_ids: selectedArchiveIds.join(', '),
                    })}

                    <div className="Form-footer u-mt">
                        <button
                            type="button"
                            className="Button Button--primaryAction"
                            onClick={() => {
                                updateInterviews(params);
                                close();
                            }}
                        >
                            {t('submit')}
                        </button>
                        <button
                            type="button"
                            className="Button Button--secondaryAction"
                            onClick={close}
                        >
                            {t('cancel')}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
}

UpdateInterviews.propTypes = {
    params: PropTypes.object.isRequired,
    action: PropTypes.string.isRequired,
    selectedArchiveIds: PropTypes.array.isRequired,
};
