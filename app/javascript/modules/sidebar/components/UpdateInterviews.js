import { submitData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Modal } from 'modules/ui';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

/**
 * Confirms and applies the same update to each selected interview through the current route.
 * Authorization is supplied by the surrounding interview action controls.
 *
 * @param {Object} props - Bulk update settings.
 * @param {Object} props.params - Fields to update on each interview.
 * @param {string} props.action - Translation key for the confirmation text.
 * @param {string[]} props.selectedArchiveIds - Public interview identifiers.
 * @returns {React.ReactElement} Bulk update confirmation dialog.
 */
export default function UpdateInterviews({
    params,
    action,
    selectedArchiveIds,
}) {
    const { t } = useI18n();
    const dispatch = useDispatch();
    const pathBase = usePathBase();

    /**
     * Dispatches a separate update for each public interview identifier.
     *
     * @param {Object} params - Fields to update; left unchanged for subsequent saves.
     */
    function updateInterviews(params) {
        selectedArchiveIds.forEach((archiveId) => {
            const updatedParams = {
                ...params,
                id: archiveId,
            };
            dispatch(submitData({ pathBase }, { interview: updatedParams }));
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
