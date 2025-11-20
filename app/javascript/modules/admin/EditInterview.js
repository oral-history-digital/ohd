import { useState } from 'react';
import { Helmet } from 'react-helmet';

import { AuthShowContainer } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import EditViewOrRedirect from './EditViewOrRedirect';
import InterviewFormContainer from './InterviewFormContainer';

export default function EditInterview() {
    const [showForm, setShowForm] = useState(true);
    const { t } = useI18n();

    return (
        <EditViewOrRedirect>
            <div className="wrapper-content register">
                <Helmet>
                    <title>{t('edit.interview.new')}</title>
                </Helmet>
                <AuthShowContainer ifLoggedIn>
                    <h1 className="registry-entries-title">
                        {t('edit.interview.new')}
                    </h1>
                    {showForm ? (
                        <InterviewFormContainer
                            submitText="edit.interview.new"
                            withContributions
                            onSubmitCallback={() => setShowForm(false)}
                        />
                    ) : (
                        <div>
                            <p>{t('edit.interview.processed')}</p>
                            <button
                                type="button"
                                className="Button return-to-upload"
                                onClick={() => setShowForm(true)}
                            >
                                {t('edit.interview.return')}
                            </button>
                        </div>
                    )}
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut ifNoProject>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
