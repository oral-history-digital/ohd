import { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';

import { ErrorBoundary } from 'modules/react-toolbox';
import { ResizeWatcherContainer } from 'modules/user-agent';
import { Sidebar } from 'modules/sidebar';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import MessagesContainer from './MessagesContainer';
import BurgerButton from './BurgerButton';
import BackToTopButton from './BackToTopButton';
import { pathBase } from 'modules/routes';
import { useHistory, useLocation } from 'react-router';

export default function WrapperPage({
    scrollPositionBelowThreshold,
    sidebarVisible,
    children,
    toggleSidebar,
    locale,
    project,
    projectId,
    projects,
    accountsStatus,
    account,
    isLoggedIn,
    isLoggedOut,
    loggedInAt,
    collectionsStatus,
    projectsStatus,
    languagesStatus,
    setLocale,
    fetchData,
    deleteData,
}) {
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        fitLocale();
        loadStuff();
    });

    function fitLocale() {
        const pathBasePart = /^(?:\/[a-z]{2,4})?\/([a-z]{2})(?:\/|$)/;

        const found = location.pathname.match(pathBasePart);
        const pathLocale = Array.isArray(found) ? found[1] : null;

        if (pathLocale) {
            if (project?.available_locales.indexOf(pathLocale) === -1) {
                const newPathBase = pathBase({projectId, locale: project.default_locale, projects}) + '/';
                const newPath = location.pathname.replace(pathBasePart, newPathBase);
                history.push(newPath);
                setLocale(locale);
            } else if (pathLocale !== locale) {
                setLocale(pathLocale);
            }
        }
    }

    function loadStuff() {
        loadAccount()
        loadCollections();
        loadProjects();
        loadLanguages();
    }

    function loadAccount() {
        if (
            !accountsStatus.current ||
            accountsStatus.current.split('-')[0] === 'reload' ||
            (isLoggedIn && !account && accountsStatus.current.split('-')[0] === 'fetched')
        ) {
            fetchData({ projectId, locale, projects }, 'accounts', 'current');
        } else if (isLoggedOut && account) {
            deleteData({ projectId, locale, projects }, 'accounts', 'current', null, null, false, true)
        }
    }

    function loadCollections() {
        if (
            project && !collectionsStatus[`for_projects_${project?.id}`]
        ) {
            fetchData({ projectId, locale, projects }, 'collections', null, null, `for_projects=${project?.id}`);
        }
    }

    function loadProjects() {
        if (projectId && !projectsStatus.all) {
            fetchData({ projectId, locale, projects }, 'projects', null, null, 'all');
        }
    }

    function loadLanguages() {
        if (!languagesStatus.all) {
            fetchData({ projectId, locale, projects }, 'languages', null, null, 'all');
        }
    }

    let title = 'Oral-History.Digital';
    if (project) {
        title = project.name[locale];
    }

    return (
        <ResizeWatcherContainer>
            <div className={classNames('Layout', {
                'sidebar-is-visible': sidebarVisible,
                'is-sticky': scrollPositionBelowThreshold,
            })}>
                <Helmet>
                    <html lang={locale} />
                    <title>{title}</title>
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
            </div>
        </ResizeWatcherContainer>
    );
}

WrapperPage.propTypes = {
    scrollPositionBelowThreshold: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool,
    isLoggedOut: PropTypes.bool,
    loggedInAt: PropTypes.number,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string,
    projects: PropTypes.object.isRequired,
    project: PropTypes.object,
    accountsStatus: PropTypes.object,
    languagesStatus: PropTypes.object,
    projectsStatus: PropTypes.object,
    collectionsStatus: PropTypes.object,
    sidebarVisible: PropTypes.bool,
    editView: PropTypes.bool.isRequired,
    account: PropTypes.object,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    toggleSidebar: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
    setLocale: PropTypes.func.isRequired,
};
