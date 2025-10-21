import { useSelector } from 'react-redux';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';
import { getCurrentUser } from 'modules/data';

export default function AfterEnable2FAPopup ({
}) {
    const user = useSelector(getCurrentUser);
    const { t } = useI18n();

    //const recentlyEnabled2FA = true;
    const recentlyEnabled2FA = user &&
        new Date(user.changed_to_otp_at).getTime() + 60000 > Date.now();

    if (!user || !recentlyEnabled2FA) return null;

    return (
        <Modal
            key='after-enable-2fa-popup'
            triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
            title={t('after_enable_2fa.title')}
            showDialogInitially={true}
            hideButton={true}
        >
            { close => (
                <>
                    <p>{`${t('after_enable_2fa.text')}`}</p>
                    <p>
                        <img
                            src={`data:image/svg+xml;utf8,${encodeURIComponent(user.otp_qrcode)}`}
                            className="u-mr-auto u-ml-auto u-mb-2 u-block u-width-half"
                        />
                    </p>
                </>
            )}
        </Modal>
    )
}

