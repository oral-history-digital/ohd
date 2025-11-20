import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

import { ErrorBoundary } from 'modules/react-toolbox';
import { useI18n } from 'modules/i18n';
import OrderNewPasswordFormContainer from './OrderNewPasswordFormContainer';

export default function OrderNewPassword({ orderNewPasswordStatus, error }) {
    const { t } = useI18n();

    return (
        <div className="wrapper-content register">
            <Helmet>
                <title>{t('devise.passwords.forgot')}</title>
            </Helmet>
            <ErrorBoundary>
                {orderNewPasswordStatus ? (
                    <div className="text">{t(orderNewPasswordStatus)}</div>
                ) : (
                    <div>
                        <h1 className="forgot-password-header">
                            {t('devise.passwords.forgot')}
                        </h1>
                        <p className="forgot-passord-text">
                            {t('devise.passwords.send_instructions')}
                        </p>
                        {error && (
                            <div
                                className="errors"
                                dangerouslySetInnerHTML={{ __html: t(error) }}
                            />
                        )}
                        <OrderNewPasswordFormContainer />
                    </div>
                )}
            </ErrorBoundary>
        </div>
    );
}

OrderNewPassword.propTypes = {
    orderNewPasswordStatus: PropTypes.string,
    error: PropTypes.string,
};
