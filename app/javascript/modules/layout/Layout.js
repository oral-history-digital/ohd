import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';

import { ErrorBoundary } from 'modules/react-toolbox';
import { ResizeWatcherContainer } from 'modules/user-agent';
import { Sidebar } from 'modules/sidebar';
import { useProject } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import FetchAccountContainer from './FetchAccountContainer';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import MessagesContainer from './MessagesContainer';
import BurgerButton from './BurgerButton';
import BackToTopButton from './BackToTopButton';
import Warning from './Warning';
import { warningShouldBeShown, doNotShowWarningAgain } from './warningFunctions';
import { AfterRegisterPopup, AfterConfirmationPopup, AfterRequestProjectAccessPopup,
    CorrectUserDataPopup, AfterResetPassword, ConfirmNewZwarTosPopup } from 'modules/user';
import useCheckLocaleAgainstProject from './useCheckLocaleAgainstProject';
import { useLoadCompleteProject } from 'modules/data';

export default function Layout({
    scrollPositionBelowThreshold,
    sidebarVisible,
    children,
    toggleSidebar,
    loggedInAt,
}) {
    const [warningVisible, setWarningVisible] = useState(warningShouldBeShown());
    const { project, projectId } = useProject();
    const { locale } = useI18n();
    const [searchParams, setSearchParams] = useSearchParams();

    useLoadCompleteProject(project.id);
    useCheckLocaleAgainstProject();

    useEffect(() => { removeAccessTokenParam(); }, [project]);

    function removeAccessTokenParam() {
        if (searchParams.has('access_token')) {
            searchParams.delete('access_token');
            setSearchParams(searchParams);
        }
    }

    function handleWarningClose() {
        setWarningVisible(false);
        doNotShowWarningAgain();
    }

    let titleBase = 'Oral-History.Digital';
    if (project) {
        titleBase = project?.display_name?.[locale] || project?.name?.[locale];
    }

    return (
        <ResizeWatcherContainer>
            <div className={classNames('Layout', {
                'sidebar-is-visible': sidebarVisible,
                'is-sticky': scrollPositionBelowThreshold,
            })}>
                <FetchAccountContainer />
                <AfterRegisterPopup />
                <AfterConfirmationPopup />
                <AfterRequestProjectAccessPopup />
                <CorrectUserDataPopup />
                <AfterResetPassword />
                <ConfirmNewZwarTosPopup />
                <Helmet
                    defaultTitle={titleBase}
                    titleTemplate={`%s | ${titleBase}`}
                >
                    <html lang={locale} />
                </Helmet>

                <div className={classNames('Layout-page', 'Site')}>
                    <SiteHeader />

                    <MessagesContainer
                        loggedInAt={loggedInAt}
                        notifications={[]}
                    />

                    <main className="Site-content">
                        {children}
                    </main>

                    <SiteFooter />
                </div>

                <ErrorBoundary>
                    <Sidebar className="Layout-sidebar" />
                </ErrorBoundary>

                <BurgerButton
                    className="Layout-sidebarToggle"
                    open={sidebarVisible}
                    onClick={() => toggleSidebar(sidebarVisible)}
                />

                <BackToTopButton
                    visible={scrollPositionBelowThreshold}
                    fullscreen={!sidebarVisible}
                />

                {warningVisible && <Warning onClose={handleWarningClose}/>}
            </div>
        </ResizeWatcherContainer>
    );
}

Layout.propTypes = {
    scrollPositionBelowThreshold: PropTypes.bool.isRequired,
    loggedInAt: PropTypes.number,
    sidebarVisible: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    toggleSidebar: PropTypes.func.isRequired,
};
