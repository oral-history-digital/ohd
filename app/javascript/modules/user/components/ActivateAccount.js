import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { sanitizeHtml } from 'modules/utils';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

import { getRegistrationStatus } from '../selectors';
import ChangePasswordFormContainer from './ChangePasswordFormContainer';

export default function ActivateAccount() {
    const registrationStatus = useSelector(getRegistrationStatus);
    const { t } = useI18n();

    return (
        <div className="wrapper-content register">
            <Helmet>
                <title>{t('devise.passwords.forgot')}</title>
            </Helmet>
            <ErrorBoundary>
                {registrationStatus ? (
                    <div className="errors">
                        {sanitizeHtml(registrationStatus, 'PLAIN_TEXT')}
                    </div>
                ) : (
                    <ChangePasswordFormContainer />
                )}
            </ErrorBoundary>
        </div>
    );
}
