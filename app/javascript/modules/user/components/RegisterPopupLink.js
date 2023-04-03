import { useSelector } from 'react-redux';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';
import RegisterFormContainer from './RegisterFormContainer';

export default function RegisterPopupLink ({
}) {
    const { t } = useI18n();

    return (
        <>
            <Modal
                title={t('user.registration')}
                triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
                trigger={t('user.registration')}
            >
                {close => (
                    <RegisterFormContainer
                        onSubmit={close}
                        onCancel={close}
                    />
                )}
            </Modal>
        </>
    )
}
