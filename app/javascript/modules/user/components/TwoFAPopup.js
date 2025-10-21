import { useSelector } from 'react-redux';
import { FaQrcode } from 'react-icons/fa';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';
import { getCurrentUser } from 'modules/data';

export default function TwoFAPopup ({showDialogInitially = true}) {
    const user = useSelector(getCurrentUser);
    const { t } = useI18n();

    return (
        <Modal
            key='after-enable-2fa-popup'
            triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
            title={t('after_enable_2fa.title')}
            showDialogInitially={showDialogInitially}
            hideButton={showDialogInitially}
            trigger={ showDialogInitially ? null :
                <FaQrcode className="Icon Icon--primary" />
            }
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


