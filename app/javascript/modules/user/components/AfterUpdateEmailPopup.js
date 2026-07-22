import { getCurrentUser } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { useSelector } from 'react-redux';

export default function AfterUpdateEmailPopup() {
    const { t } = useI18n();
    const currentUser = useSelector(getCurrentUser);

    if (!currentUser?.unconfirmed_email) return null;

    return (
        <Modal
            key="after-update-email-popup"
            triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
            showDialogInitially={true}
            hideButton={true}
        >
            {(close) => (
                <div>
                    <p>{t('devise.registrations.update_email')}</p>
                    <input
                        type="button"
                        className="Button Button--primaryAction"
                        value={t('ok')}
                        onClick={close}
                    />
                </div>
            )}
        </Modal>
    );
}
