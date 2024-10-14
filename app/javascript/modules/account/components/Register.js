import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { ErrorBoundary } from 'modules/react-toolbox';
import { useI18n } from 'modules/i18n';
import { ScrollToTop } from 'modules/user-agent';
import RegisterFormContainer from './RegisterFormContainer';
import findExternalLink from '../findExternalLink';

export default function Register({
    project,
    registrationStatus,
}) {
    const { t, locale } = useI18n();

    const conditionsLink = findExternalLink(project, 'conditions');
    const privacyLink = findExternalLink(project, 'privacy_protection');

    return (
        <ScrollToTop>
            <Helmet>
                <title>{t('devise.registrations.link')}</title>
            </Helmet>
            <div className='wrapper-content register'>
                <ErrorBoundary>
                    {
                        registrationStatus ? (
                            <p
                                className='status'
                                dangerouslySetInnerHTML={{__html: registrationStatus}}
                            />
                        ) : (
                            <div>
                                <h1>
                                    {t('devise.registrations.link')}
                                </h1>
                                <p>
                                    {t('user_registration.temporarily_closed')}
                                </p>
                            </div>
                        )
                    }
                </ErrorBoundary>
            </div>
        </ScrollToTop>
    );
}

Register.propTypes = {
    project: PropTypes.object.isRequired,
    registrationStatus: PropTypes.string,
};
