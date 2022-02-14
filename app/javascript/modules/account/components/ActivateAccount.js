import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

import { useI18n } from 'modules/i18n';
import { getRegistrationStatus } from '../selectors';
import ChangePasswordFormContainer from './ChangePasswordFormContainer';

export default function ActivateAccount() {
    const registrationStatus = useSelector(getRegistrationStatus);
    const { t } = useI18n();

    return (
        <div className='wrapper-content register'>
            <Helmet>
                <title>{t('devise.passwords.forgot')}</title>
            </Helmet>
            {
                registrationStatus ?
                    <div className='errors'>{registrationStatus}</div> :
                    <ChangePasswordFormContainer />
            }
        </div>
    );
}
