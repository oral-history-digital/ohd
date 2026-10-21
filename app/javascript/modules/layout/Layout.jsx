import { useEffect } from 'react';

import classNames from 'classnames';
import { getViewMode, useIsEditor } from 'modules/archive';
import {
    Banner,
    bannerHasNotBeenHiddenByUser,
    doNotShowBannerAgainThisSession,
    getBannerActive,
    hideBanner,
} from 'modules/banner';
import { VIEWMODE_WORKFLOW } from 'modules/constants';
import {
    getProjectBrandName,
    useCurrentProject,
    useUmbrellaProject,
} from 'modules/data';
import { useCheckLocaleAgainstProject, useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { useCurrentPage, useSyncLegacyProjectId } from 'modules/routes';
import { Sidebar, getSidebarVisible, toggleSidebar } from 'modules/sidebar';
import { Spinner } from 'modules/spinners';
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
import getFaviconUrl from './getFaviconUrl';

export default function Layout({ children }) {
    const dispatch = useDispatch();
    const { locale } = useI18n();
    const currentPage = useCurrentPage();
    const [searchParams, setSearchParams] = useSearchParams();
    // Page content currently needs details; routing only needs the base project data.
    const { project, projectShortname, isLoading } = useCurrentProject({
        requireDetails: true,
    });
    const scrollPositionBelowThreshold = useScrollBelowThreshold();
    const isEditviewActive = useIsEditor();

    const bannerActive = useSelector(getBannerActive);
    const currentViewMode = useSelector(getViewMode);
    const { project: umbrellaProject } = useUmbrellaProject();
    const sidebarVisible = useSelector(getSidebarVisible);
    const loggedInAt = useSelector(getLoggedInAt);
    const isLoggedIn = useSelector(getIsLoggedIn);

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
    useSyncLegacyProjectId(projectShortname);

    // Clean up any access_token from URL after initial load
    useEffect(() => {
        if (searchParams.has('access_token')) {
            searchParams.delete('access_token');
            setSearchParams(searchParams);
        }
    }, [searchParams, setSearchParams]);

    function handleBannerClose() {
        dispatch(hideBanner());
        doNotShowBannerAgainThisSession();
    }

    let titleBase = getProjectBrandName(umbrellaProject, locale);
    if (project) {
        titleBase = project?.display_name?.[locale] || project?.name?.[locale];
    }

    const faviconUrl = getFaviconUrl(project);

    if (isLoading) {
        return (
            <div className="Layout Layout--loading">
                <main className="Site-content Layout-loadingContent">
                    <Spinner size={200} color="#f1f1f1" withPadding />
                </main>
            </div>
        );
    }

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
                    'is-editview-active': isEditviewActive,
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
                    titleTemplate={titleBase ? `%s | ${titleBase}` : '%s'}
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
