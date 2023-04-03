import { useSelector } from 'react-redux';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';
import { getIsRegistered } from '../selectors';
import RequestProjectAccessFormContainer from './RequestProjectAccessFormContainer';
import { getCurrentUser, getCurrentProject } from 'modules/data';

export default function AfterRegisterPopup ({
}) {
    const { t, locale } = useI18n();
    const currentUser = useSelector(getCurrentUser);
    const currentProject = useSelector(getCurrentProject);
    const isRegistered = useSelector(getIsRegistered);

    const confirmed = currentUser && Date.parse(currentUser.confirmed_at);

    const recentlyConfirmed = currentUser?.confirmed_at + 5000 > Date.now() &&
        //currentUser?.pre_registration_location === location.href &&
        !currentProject.is_ohd;

    debugger;
    return (
        <>
            <Modal
                triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
                trigger={t('user.registration')}
                showDialogInitially={recentlyConfirmed || isRegistered}
                hideButton={true}
                key={recentlyConfirmed || isRegistered}
            >
                { 
                    recentlyConfirmed ? (
                        close => (
                            <RequestProjectAccessFormContainer
                                onSubmit={close}
                                onCancel={close}
                            />
                        )
                    ) : ( null )
                }
                {
                    isRegistered ? (
                        <>
                            <h2>{t('devise.registrations.signed_up_title')}</h2>
                            <p>
                                {t('devise.registrations.signed_up')}
                            </p>
                        </>
                    ) : ( null )
                }
            </Modal>
        </>
    )
}
