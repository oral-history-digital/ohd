import { OHD_DOMAINS } from 'modules/constants';
import { getCurrentUser } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { FaKey } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import PasskeyRegistration from './PasskeyRegistration';
import Passkeys from './Passkeys';

export default function TwoFAPopup({ showDialogInitially = true }) {
    const user = useSelector(getCurrentUser);
    const { t, locale } = useI18n();

    if (!user) return null;

    const passkeysURL = `${OHD_DOMAINS[railsMode]}/${locale}/passkeys`;

    return (
        <Modal
            key="passkeys-popup"
            triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
            title={t('passkey.title')}
            showDialogInitially={showDialogInitially}
            hideButton={showDialogInitially}
            trigger={
                showDialogInitially ? null : (
                    <FaKey className="Icon Icon--primary" />
                )
            }
        >
            {(close) => (
                <iframe
                    src={passkeysURL}
                    style={{ width: '100%', height: '60vh' }}
                    scrolling="no"
                    frameBorder="0"
                    allow={`publickey-credentials-create ${OHD_DOMAINS[railsMode]};
                        publickey-credentials-get ${OHD_DOMAINS[railsMode]}`}
                ></iframe>
            )}
        </Modal>
    );
}
