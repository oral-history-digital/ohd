import { useTrackPageView } from 'modules/analytics';
import { getProjectBrandName, useUmbrellaProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Helmet } from 'react-helmet';

import RegisterForm from './RegisterForm';

export default function RegisterPage() {
    const { t, locale } = useI18n();
    const { project: umbrellaProject } = useUmbrellaProject();
    const title = t('modules.registration.title', {
        umbrella_project_name: getProjectBrandName(umbrellaProject, locale),
    });

    useTrackPageView();

    return (
        <div className="wrapper-content register">
            <Helmet>
                <title>{title}</title>
            </Helmet>

            <h1 className="Page-main-title">{title}</h1>

            <RegisterForm />
        </div>
    );
}
