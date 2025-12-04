/* global railsMode */
import { useEffect } from 'react';

import classNames from 'classnames';
import {
    Banner,
    bannerHasNotBeenHiddenByUser,
    doNotShowBannerAgainThisSession,
} from 'modules/banner';
import { OHD_DOMAINS } from 'modules/constants';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { useProject } from 'modules/routes';
import { Sidebar } from 'modules/sidebar';
import {
    AfterConfirmationPopup,
    AfterRegisterPopup,
    AfterRequestProjectAccessPopup,
    AfterResetPassword,
    ConfirmNewZwarTosPopup,
    CorrectUserDataPopup,
} from 'modules/user';
import { ResizeWatcherContainer } from 'modules/user-agent';
import { isMobile } from 'modules/user-agent';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';

import BackToTopButton from './BackToTopButton';
import BurgerButton from './BurgerButton';
import FetchAccountContainer from './FetchAccountContainer';
import MessagesContainer from './MessagesContainer';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';
import useCheckLocaleAgainstProject from './useCheckLocaleAgainstProject';

export default function Layout({
    scrollPositionBelowThreshold,
    sidebarVisible,
    children,
    toggleSidebar,
    loggedInAt,
    projectsStatus,
    bannerActive,
    hideBanner,
    fetchData,
}) {
    const { project } = useProject();
    const { locale } = useI18n();
    const [searchParams, setSearchParams] = useSearchParams();

    useCheckLocaleAgainstProject();

    const ohdDomain = OHD_DOMAINS[railsMode];

    // load current project if not already loaded
    useEffect(() => {
        const ohd = { shortname: 'ohd', archive_domain: ohdDomain };

        function removeAccessTokenParam() {
            if (searchParams.has('access_token')) {
                searchParams.delete('access_token');
                setSearchParams(searchParams);
            }
        }

        if (!projectsStatus[project.id]) {
            fetchData({ locale: 'de', project: ohd }, 'projects', project.id);
        }
        removeAccessTokenParam();
    }, [
        project,
        projectsStatus,
        fetchData,
        ohdDomain,
        searchParams,
        setSearchParams,
    ]);

    function handleBannerClose() {
        hideBanner();
        doNotShowBannerAgainThisSession();
    }

    let titleBase = 'Oral-History.Digital';
    if (project) {
        titleBase = project?.display_name?.[locale] || project?.name?.[locale];
    }

    const faviconUrl = project?.shortname
        ? `/favicons/favicon-${project?.shortname}.ico`
        : '/favicon.ico';

    return (
        <ResizeWatcherContainer>
            <div
                className={classNames('Layout', {
                    'sidebar-is-visible': sidebarVisible,
                    'is-sticky': scrollPositionBelowThreshold,
                    'is-mobile': isMobile(),
                })}
            >
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
                    <link rel="icon" type="image/x-icon" href={faviconUrl} />
                </Helmet>

                <div className={classNames('Layout-page', 'Site')}>
                    <SiteHeader />

                    <MessagesContainer
                        loggedInAt={loggedInAt}
                        notifications={[]}
                    />

                    <main className="Site-content">{children}</main>

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

                {bannerActive && bannerHasNotBeenHiddenByUser() && (
                    <Banner onClose={handleBannerClose} />
                )}
            </div>
        </ResizeWatcherContainer>
    );
}

Layout.propTypes = {
    scrollPositionBelowThreshold: PropTypes.bool.isRequired,
    loggedInAt: PropTypes.number,
    projectsStatus: PropTypes.object,
    sidebarVisible: PropTypes.bool,
    bannerActive: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    toggleSidebar: PropTypes.func.isRequired,
    hideBanner: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
};
