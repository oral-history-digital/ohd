import { useTrackPageView } from 'modules/analytics';
import { useI18n } from 'modules/i18n';
import { Helmet } from 'react-helmet';

import RegisterForm from './RegisterForm';

export default function RegisterPage() {
    const { t } = useI18n();

    useTrackPageView();

    return (
        <div className="wrapper-content register">
            <Helmet>
                <title>{t('modules.registration.title')}</title>
            </Helmet>

            <h1 className="Page-main-title">
                {t('modules.registration.title')}
            </h1>

            <RegisterForm />
        </div>
    );
}
