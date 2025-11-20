import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';
import { getLocale, submitSelectedArchiveIds } from 'modules/archive';
import { usePathBase } from 'modules/routes';

export default function SubmitInterviewIds({
    action,
    selectedArchiveIds,
    confirmText,
    filename,
    format,
}) {
    const { t } = useI18n();
    const dispatch = useDispatch();
    const locale = useSelector(getLocale);
    const pathBase = usePathBase();

    return (
        <Modal
            title={t(`edit.interviews.${action}.title`)}
            trigger={t(`edit.interviews.${action}.title`)}
            triggerClassName="flyout-sub-tabs-content-ico-link"
        >
            {(close) => (
                <div>
                    {confirmText ||
                        t(`edit.interviews.${action}.confirm_text`, {
                            archive_ids: selectedArchiveIds.join(', '),
                        })}

                    <button
                        type="button"
                        className="Button any-button"
                        onClick={() => {
                            dispatch(
                                submitSelectedArchiveIds(
                                    selectedArchiveIds,
                                    action,
                                    pathBase,
                                    filename,
                                    format
                                )
                            );
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

SubmitInterviewIds.propTypes = {
    action: PropTypes.string.isRequired,
    selectedArchiveIds: PropTypes.array.isRequired,
};
