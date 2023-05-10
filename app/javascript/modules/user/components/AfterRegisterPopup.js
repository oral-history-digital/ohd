import { useSelector } from 'react-redux';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';
import { getIsRegistered } from '../selectors';

export default function AfterRegisterPopup ({
}) {
    const { t, locale } = useI18n();
    const isRegistered = useSelector(getIsRegistered);

    if (!isRegistered) return null;

    return (
        <Modal
            triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
            trigger={t('user.registration')}
            showDialogInitially={true}
            hideButton={true}
        >
            { close => (
                <>
                    <h2>{t('devise.registrations.signed_up_title')}</h2>
                    <p>
                        {t('devise.registrations.signed_up')}
                    </p>
                    <input
                        type="button"
                        className="Button Button--primaryAction"
                        value={'OK'}
                        onClick={close}
                    />
                </>
            )}
        </Modal>
    )
}
