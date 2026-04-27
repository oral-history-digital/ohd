import { useI18n } from 'modules/i18n';
import { sanitizeInternalReturnPath } from 'modules/query-string';
import { Modal } from 'modules/ui';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getIsRegistered } from '../selectors';

export default function AfterRegisterPopup() {
    const { t } = useI18n();
    const isRegistered = useSelector(getIsRegistered);
    const navigate = useNavigate();

    if (!isRegistered) return null;

    function handleClose() {
        // Redirect to the stored return path after user confirms registration
        const rawPath = sessionStorage.getItem('registrationReturnPath');
        sessionStorage.removeItem('registrationReturnPath');

        const returnPath = sanitizeInternalReturnPath(rawPath);

        navigate(returnPath);
    }

    return (
        <Modal
            key="after-register-popup"
            triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
            trigger={t('user.registration')}
            showDialogInitially={true}
            hideButton={true}
            onClose={handleClose}
        >
            {(close) => (
                <>
                    <h2>{t('devise.registrations.signed_up_title')}</h2>
                    <p>{t('devise.registrations.signed_up')}</p>
                    <input
                        type="button"
                        className="Button Button--primaryAction"
                        value={t('ok')}
                        onClick={close}
                    />
                </>
            )}
        </Modal>
    );
}
