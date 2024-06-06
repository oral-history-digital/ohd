import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

import { ErrorBoundary } from 'modules/react-toolbox';
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
            <ErrorBoundary>
                {
                    registrationStatus ?
                        <div className='errors'>{registrationStatus}</div> :
                        <ChangePasswordFormContainer />
                }
            </ErrorBoundary>
        </div>
    );
}
