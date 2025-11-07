/* global railsMode */
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

import { ErrorBoundary } from 'modules/react-toolbox';
import { ResizeWatcherContainer } from 'modules/user-agent';
import { Sidebar } from 'modules/sidebar';
import { useProject } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { getPlayerSize } from 'modules/media-player';
import FetchAccountContainer from './FetchAccountContainer';
//import MessagesContainer from './MessagesContainer';
import BurgerButton from './BurgerButton';
import BackToTopButton from './BackToTopButton';
import {
    Banner,
    bannerHasNotBeenHiddenByUser,
    doNotShowBannerAgainThisSession,
} from 'modules/banner';
import {
    AfterRegisterPopup,
    AfterConfirmationPopup,
    AfterRequestProjectAccessPopup,
    CorrectUserDataPopup,
    AfterResetPassword,
    ConfirmNewZwarTosPopup,
} from 'modules/user';
import { OHD_DOMAINS } from 'modules/constants';
import { isMobile } from 'modules/user-agent';

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
    const playerSize = useSelector(getPlayerSize);
    const { project } = useProject();
    const { locale } = useI18n();

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
            <div>
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
                    { false &&
                    <SiteHeader />
                    }

                    { false &&
                    <MessagesContainer
                        loggedInAt={loggedInAt}
                        notifications={[]}
                    />
                    }

                    <main className="Site-content">{children}</main>

                    { false &&
                    <SiteFooter />
                    }
                </div>

                    { false &&
                <ErrorBoundary>
                    <Sidebar className="Layout-sidebar" />
                </ErrorBoundary>
                    }

                <BurgerButton
                    className="Layout-sidebarToggle"
                    open={sidebarVisible}
                    onClick={() => toggleSidebar(sidebarVisible)}
                />

                <BackToTopButton
                    visible={scrollPositionBelowThreshold}
                    fullscreen={!sidebarVisible}
                />

                { bannerActive && bannerHasNotBeenHiddenByUser() && (
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
