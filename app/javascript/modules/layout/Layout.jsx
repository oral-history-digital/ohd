/* global railsMode */
import { useEffect } from 'react';

import classNames from 'classnames';
import {
    Banner,
    bannerHasNotBeenHiddenByUser,
    doNotShowBannerAgainThisSession,
    getBannerActive,
    hideBanner,
} from 'modules/banner';
import { OHD_DOMAINS } from 'modules/constants';
import { fetchData, getProjectsStatus } from 'modules/data';
import { useCheckLocaleAgainstProject, useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { useCurrentPage, useProject } from 'modules/routes';
import { Sidebar, getSidebarVisible, toggleSidebar } from 'modules/sidebar';
import {
    AfterConfirmationPopup,
    AfterEnable2FAPopup,
    AfterEnablePasskeyPopup,
    AfterRegisterPopup,
    AfterRequestProjectAccessPopup,
    ConfirmNewZwarTosPopup,
    CorrectUserDataPopup,
    getIsLoggedIn,
    getLoggedInAt,
    useFetchAccount,
} from 'modules/user';
import {
    ResizeWatcher,
    isMobile,
    useScrollBelowThreshold,
} from 'modules/user-agent';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import {
    BackToTopButton,
    BurgerButton,
    Messages,
    SiteFooter,
    SiteHeader,
} from './components';

export default function Layout({ children }) {
    const dispatch = useDispatch();
    const scrollPositionBelowThreshold = useScrollBelowThreshold();
    const bannerActive = useSelector(getBannerActive);
    const projectsStatus = useSelector(getProjectsStatus);
    const sidebarVisible = useSelector(getSidebarVisible);
    const loggedInAt = useSelector(getLoggedInAt);
    const isLoggedIn = useSelector(getIsLoggedIn);

    const { project } = useProject();
    const currentPage = useCurrentPage();
    const { locale } = useI18n();
    const [searchParams, setSearchParams] = useSearchParams();
    const isInterviewPage = currentPage.pageType === 'interview_detail';

    useCheckLocaleAgainstProject();
    useFetchAccount();

    const ohdDomain = OHD_DOMAINS[railsMode];

    // Load current project if not already loaded
    useEffect(() => {
        const ohd = { shortname: 'ohd', archive_domain: ohdDomain };

        function removeAccessTokenParam() {
            if (searchParams.has('access_token')) {
                searchParams.delete('access_token');
                setSearchParams(searchParams);
            }
        }

        if (!project?.id) {
            removeAccessTokenParam();
            return;
        }

        if (!projectsStatus[project.id]) {
            dispatch(
                fetchData(
                    { locale: 'de', project: ohd },
                    'projects',
                    project.id
                )
            );
        }
        removeAccessTokenParam();
    }, [
        dispatch,
        project,
        projectsStatus,
        ohdDomain,
        searchParams,
        setSearchParams,
    ]);

    function handleBannerClose() {
        dispatch(hideBanner());
        doNotShowBannerAgainThisSession();
    }

    let titleBase = 'Oral-History.Digital';
    if (project) {
        titleBase = project?.display_name?.[locale] || project?.name?.[locale];
    }

    const faviconUrl = project?.shortname
        ? `/favicons/favicon-${project?.shortname}.ico`
        : '/favicon.ico';

    if (!project) return null;

    return (
        <ResizeWatcher>
            <div
                className={classNames('Layout', {
                    'is-logged-in': isLoggedIn,
                    'sidebar-is-visible': sidebarVisible,
                    'is-interview-page': isInterviewPage,
                    'is-sticky': scrollPositionBelowThreshold,
                    'is-mobile': isMobile(),
                })}
            >
                <AfterRegisterPopup />
                <AfterConfirmationPopup />
                <AfterRequestProjectAccessPopup />
                <CorrectUserDataPopup />
                <AfterEnable2FAPopup />
                <AfterEnablePasskeyPopup />
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

                    <Messages loggedInAt={loggedInAt} notifications={[]} />

                    <main className="Site-content">{children}</main>

                    <SiteFooter />
                </div>

                <ErrorBoundary>
                    <Sidebar className="Layout-sidebar" />
                </ErrorBoundary>

                <BurgerButton
                    className="Layout-sidebarToggle"
                    open={sidebarVisible}
                    onClick={() => dispatch(toggleSidebar(sidebarVisible))}
                />

                <BackToTopButton
                    visible={scrollPositionBelowThreshold}
                    fullscreen={!sidebarVisible}
                />

                {bannerActive && bannerHasNotBeenHiddenByUser() && (
                    <Banner onClose={handleBannerClose} />
                )}
            </div>
        </ResizeWatcher>
    );
}

Layout.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
};
