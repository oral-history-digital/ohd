import { useRef } from 'react';

import { OHD_DOMAINS } from 'modules/constants';
import { getCurrentUser } from 'modules/data';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { FaKey } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { useIframeMessage } from '../useIframeMessage';

export default function TwoFAPopup({ showDialogInitially = true }) {
    const user = useSelector(getCurrentUser);
    const { t, locale } = useI18n();
    const closeModalRef = useRef(null);

    useIframeMessage((data) => {
        if (
            data.type === 'closeModal' &&
            data.source === 'passkeyRegistration'
        ) {
            closeModalRef.current?.();
        }
    });

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
            {(close) => {
                closeModalRef.current = close;

                return (
                    <>
                        <HelpText code="mfa" />
                        <iframe
                            src={passkeysURL}
                            style={{ width: '100%', height: '60vh' }}
                            scrolling="no"
                            frameBorder="0"
                            allow={`publickey-credentials-create ${OHD_DOMAINS[railsMode]};
                                publickey-credentials-get ${OHD_DOMAINS[railsMode]}`}
                        />
                    </>
                );
            }}
        </Modal>
    );
}
