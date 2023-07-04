import { Helmet } from 'react-helmet';

import { AuthShowContainer } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import EditViewOrRedirect from './EditViewOrRedirect';
import UploadsForm from './UploadsForm';

export default function UploadsPage() {
    const { t } = useI18n();

    return (
        <EditViewOrRedirect>
            <div className='wrapper-content register'>
                <Helmet>
                    <title>{t(`edit.upload.upload`)}</title>
                </Helmet>
                <AuthShowContainer ifLoggedIn>
                    <h1 className="registry-entries-title">
                        {t(`edit.upload.upload`)}
                    </h1>
                    <UploadsForm />
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut ifNoProject>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
