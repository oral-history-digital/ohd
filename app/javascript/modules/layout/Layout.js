import { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';

import { ErrorBoundary } from 'modules/react-toolbox';
import { ResizeWatcherContainer } from 'modules/user-agent';
import { Sidebar } from 'modules/sidebar';
import { pathBase } from 'modules/routes';
import FetchAccountContainer from './FetchAccountContainer';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import MessagesContainer from './MessagesContainer';
import BurgerButton from './BurgerButton';
import BackToTopButton from './BackToTopButton';

export default function Layout({
    scrollPositionBelowThreshold,
    sidebarVisible,
    children,
    toggleSidebar,
    locale,
    project,
    projectId,
    projects,
    loggedInAt,
    collectionsStatus,
    projectsStatus,
    languagesStatus,
    setLocale,
    fetchData,
}) {
    const location = useLocation();
    const navigate = useNavigate();

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
                navigate(newPath);
                setLocale(locale);
            } else if (pathLocale !== locale) {
                setLocale(pathLocale);
            }
        }
    }

    function loadStuff() {
        loadCollections();
        loadProjects();
        loadLanguages();
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

    let titleBase = 'Oral-History.Digital';
    if (project) {
        titleBase = project?.display_name?.[locale] || project.name[locale];
    }

    return (
        <ResizeWatcherContainer>
            <div className={classNames('Layout', {
                'sidebar-is-visible': sidebarVisible,
                'is-sticky': scrollPositionBelowThreshold,
            })}>
                <FetchAccountContainer />
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
            </div>
        </ResizeWatcherContainer>
    );
}

Layout.propTypes = {
    scrollPositionBelowThreshold: PropTypes.bool.isRequired,
    loggedInAt: PropTypes.number,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string,
    projects: PropTypes.object.isRequired,
    project: PropTypes.object,
    languagesStatus: PropTypes.object,
    projectsStatus: PropTypes.object,
    collectionsStatus: PropTypes.object,
    sidebarVisible: PropTypes.bool,
    editView: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    toggleSidebar: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
    setLocale: PropTypes.func.isRequired,
};
