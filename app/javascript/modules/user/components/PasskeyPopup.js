import { getCurrentUser } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { FaKey } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import PasskeyRegistration from './PasskeyRegistration';
import Passkeys from './Passkeys';

export default function TwoFAPopup({ showDialogInitially = true }) {
    const user = useSelector(getCurrentUser);
    const { t } = useI18n();

    if (!user) return null;

    return (
        <Modal
            key="passkeys-popup"
            triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
            title={t('passkeys.title')}
            showDialogInitially={showDialogInitially}
            hideButton={showDialogInitially}
            trigger={
                showDialogInitially ? null : (
                    <FaKey className="Icon Icon--primary" />
                )
            }
        >
            {(close) => (
                <>
                    <p>{`${t('passkeys.title')}`}</p>
                    <PasskeyRegistration />
                    <Passkeys user={user} />
                </>
            )}
        </Modal>
    );
}
