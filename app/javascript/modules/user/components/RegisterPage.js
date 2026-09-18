import { useTrackPageView } from 'modules/analytics';
import { getProjectBrandName, getUmbrellaProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

import RegisterForm from './RegisterForm';

export default function RegisterPage() {
    const { t, locale } = useI18n();
    const umbrellaProject = useSelector(getUmbrellaProject);
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
