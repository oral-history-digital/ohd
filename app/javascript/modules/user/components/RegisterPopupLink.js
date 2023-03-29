import { useSelector } from 'react-redux';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';
import { getRegistrationStatus } from '../selectors';
import { getOHDProject } from 'modules/data';
import RegisterFormContainer from './RegisterFormContainer';
import findExternalLink from '../findExternalLink';

export default function RegisterPopupLink ({
}) {
    const { t, locale } = useI18n();

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
