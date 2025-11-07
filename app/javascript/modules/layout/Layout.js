/* global railsMode */
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

import { ResizeWatcherContainer } from 'modules/user-agent';
import { useProject } from 'modules/routes';
import { useI18n } from 'modules/i18n';
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

export default function Layout({
    scrollPositionBelowThreshold,
    sidebarVisible,
    toggleSidebar,
    bannerActive,
    hideBanner,
}) {
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
    sidebarVisible: PropTypes.bool,
    bannerActive: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    hideBanner: PropTypes.func.isRequired,
};
