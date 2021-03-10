import React from 'react';

import AuthShowContainer from 'modules/auth/AuthShowContainer';
import EditProjectDisplayAttributesContainer from './EditProjectDisplayAttributesContainer';
import LogosContainer from './LogosContainer';
import SponsorLogosContainer from './SponsorLogosContainer';

import { useI18n } from 'modules/i18n';

export default function EditProjectDisplay() {
    const { t } = useI18n();

    return (
        <div className='wrapper-content register'>
            <AuthShowContainer ifLoggedIn={true}>
                <h1 className='registry-entries-title'>{t(`edit.project.display`)}</h1>
                <EditProjectDisplayAttributesContainer />
                <h2 className='registry-entries-title'>{t(`edit.logo.admin`)}</h2>
                <LogosContainer />
                <h2 className='registry-entries-title'>{t(`edit.sponsor_logo.admin`)}</h2>
                <SponsorLogosContainer />
            </AuthShowContainer>
            <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                {t('devise.failure.unauthenticated')}
            </AuthShowContainer>
        </div>
    );
}
