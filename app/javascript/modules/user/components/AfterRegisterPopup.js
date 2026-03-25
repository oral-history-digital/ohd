import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getIsRegistered } from '../selectors';

export default function AfterRegisterPopup() {
    const { t } = useI18n();
    const isRegistered = useSelector(getIsRegistered);
    const navigate = useNavigate();

    if (!isRegistered) return null;

    function handleClose(closeModal) {
        // Redirect to the stored return path after user confirms registration
        const rawPath = sessionStorage.getItem('registrationReturnPath');
        sessionStorage.removeItem('registrationReturnPath');

        const returnPath =
            rawPath && rawPath.startsWith('/') && !rawPath.startsWith('//')
                ? rawPath
                : '/';

        closeModal();
        navigate(returnPath);
    }

    return (
        <Modal
            key="after-register-popup"
            triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
            trigger={t('user.registration')}
            showDialogInitially={true}
            hideButton={true}
        >
            {(close) => (
                <>
                    <h2>{t('devise.registrations.signed_up_title')}</h2>
                    <p>{t('devise.registrations.signed_up')}</p>
                    <input
                        type="button"
                        className="Button Button--primaryAction"
                        value={t('ok')}
                        onClick={() => handleClose(close)}
                    />
                </>
            )}
        </Modal>
    );
}
