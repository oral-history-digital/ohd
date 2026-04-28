/* global railsMode */
import { useEffect } from 'react';

import classNames from 'classnames';
import { getProjectId, getViewMode, setProjectId } from 'modules/archive';
import {
    Banner,
    bannerHasNotBeenHiddenByUser,
    doNotShowBannerAgainThisSession,
    getBannerActive,
    hideBanner,
} from 'modules/banner';
import { OHD_DOMAINS, VIEWMODE_WORKFLOW } from 'modules/constants';
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
    const routeProjectId = useSelector(getProjectId);
    const currentViewMode = useSelector(getViewMode);
    const sidebarVisible = useSelector(getSidebarVisible);
    const loggedInAt = useSelector(getLoggedInAt);
    const isLoggedIn = useSelector(getIsLoggedIn);

    const { project } = useProject();
    const currentPage = useCurrentPage();
    const { locale } = useI18n();
    const [searchParams, setSearchParams] = useSearchParams();
    const isHomepage = currentPage.pageType === 'site_startpage';
    const isInterviewPage = currentPage.pageType === 'interview_detail';
    const isPeopleAdminPage =
        currentPage.pageType === 'project_admin_page' &&
        currentPage.pathname.endsWith('/people');
    const isWideLayout =
        (currentPage.pageType === 'search_archive' &&
            currentViewMode === VIEWMODE_WORKFLOW) ||
        isPeopleAdminPage;

    useCheckLocaleAgainstProject();
    useFetchAccount();

    // Keep Redux projectId aligned with the route-resolved project.
    // This ensures selectors like getCurrentProject/getMapSections use
    // the same project that useProject() resolves from the URL/domain.
    // TODO: eventually we should unify this logic inside useProject()
    // and get rid of the separate projectId in Redux.
    useEffect(() => {
        const resolvedProjectId = project?.shortname;

        if (!resolvedProjectId || resolvedProjectId === routeProjectId) {
            return;
        }

        dispatch(setProjectId(resolvedProjectId));
    }, [dispatch, project?.shortname, routeProjectId]);

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

        // Temporary compatibility bridge during SWR/Redux transition:
        // prefer resolved Redux project id, fallback to route project shortname
        // so we can hydrate Redux even before `useProject()` resolves.
        const effectiveProjectId = project?.id || routeProjectId;

        if (!effectiveProjectId) {
            removeAccessTokenParam();
            return;
        }

        if (!projectsStatus[effectiveProjectId]) {
            dispatch(
                fetchData(
                    { locale: 'de', project: ohd },
                    'projects',
                    effectiveProjectId
                )
            );
        }
        removeAccessTokenParam();
    }, [
        dispatch,
        project,
        routeProjectId,
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
                    'is-homepage': isHomepage,
                    'is-interview-page': isInterviewPage,
                    'is-wide-layout': isWideLayout,
                    'is-sticky':
                        isInterviewPage && scrollPositionBelowThreshold,
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
