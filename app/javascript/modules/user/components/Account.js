import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { OHD_DOMAINS } from 'modules/layout';
import { AuthShowContainer } from 'modules/auth';
import { ErrorBoundary } from 'modules/react-toolbox';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { isMobile } from 'modules/user-agent';
import ProjectAccessAlert from './ProjectAccessAlert';
import RegisterPopupLink from './RegisterPopupLink';
import EditViewButtonContainer from './EditViewButtonContainer';
import LoginForm from './LoginForm';

export default function Account ({
    user,
    error,
    isLoggedIn,
    archiveId,
    project,
    projectId,
    projects,
    firstName,
    lastName,
    submitLogout,
    hideSidebar,
    clearStateData,
    editViewCookie,
}) {

    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    const handleLinkClick = () => {
        if (isMobile()) {
            hideSidebar();
        }
    }

    const errorMsg = () => {
        if (error) {
            return <div className='error' dangerouslySetInnerHTML={{__html: t(error)}}/>;
        } else {
            return null;
        }
    }

    return (
        <ErrorBoundary small>
            <h3 className="SidebarTabs-title">
                { t(isLoggedIn ? 'account_page' : 'login_page') }
            </h3>

            <div className={'flyout-login-container'}>
                <AuthShowContainer ifLoggedIn={true} ifNoProject={true}>
                    <div className='info'>
                        {`${t('logged_in_as')} ${firstName} ${lastName}`}
                    </div>
                    <EditViewButtonContainer />
                    <button
                        type="button"
                        className='Button Button--fullWidth Button--secondaryAction u-mt-small'
                        onClick={() => {
                            // clear non-public data
                            if (archiveId) {
                                clearStateData('interviews', archiveId, 'title');
                                clearStateData('interviews', archiveId, 'short_title');
                                clearStateData('interviews', archiveId, 'description');
                                clearStateData('interviews', archiveId, 'observations');
                                clearStateData('interviews', archiveId, 'photos');
                                clearStateData('interviews', archiveId, 'segments');
                                clearStateData('statuses', 'people');
                                Object.keys(projects).map(pid => {
                                    clearStateData('projects', pid, 'people');
                                })
                            }
                            clearStateData('users');
                            clearStateData('users');
                            submitLogout(`${pathBase}/users/sign_out`);
                        }}
                    >
                        {t('logout')}
                    </button>
                </AuthShowContainer>
                <AuthShowContainer ifNoProject={!!project}>
                    <ProjectAccessAlert />
                </AuthShowContainer>

                {errorMsg()}

                <AuthShowContainer ifLoggedOut={true}>
                    <p>
                        {/* do not show t('registration_needed') in campscapes. TODO: generalize this*/}
                        {
                            (error || projectId === 'campscapes') ? '' :
                                t(`modules.registration.registration_needed_${project.is_ohd ? 'ohd' : 'archive'}`)
                        }
                    </p>
                    { 
                        (['za', 'mog', 'cd', 'campscapes'].indexOf(projectId) !== -1) ?
                            <LoginForm /> :
                            <button
                                type="button"
                                className='Button Button--fullWidth Button--secondaryAction u-mt-small'
                                onClick={() => {
                                    location = `${OHD_DOMAINS[railsMode]}/${locale}/users/sign_in?path=${location.pathname}&project=${projectId}`;
                                }}
                            >
                                {t('login')}
                            </button>
                    }
                    <RegisterPopupLink />
                    <div
                        className="order-new-password-link"
                        onClick={handleLinkClick}
                    >
                        <Link
                            className="Link"
                            to={pathBase + '/users/password/new'}
                        >
                            {t('forget_password')}
                        </Link>
                    </div>
                </AuthShowContainer>
            </div>
        </ErrorBoundary>
    )
}
