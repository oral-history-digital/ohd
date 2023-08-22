import { useEffect } from 'react';
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
import { AfterRegisterPopup, AfterConfirmationPopup, AfterRequestProjectAccessPopup,
    CorrectUserDataPopup } from 'modules/user';
import useCheckLocaleAgainstProject from './useCheckLocaleAgainstProject';

export default function Layout({
    scrollPositionBelowThreshold,
    sidebarVisible,
    children,
    toggleSidebar,
    loggedInAt,
    collectionsStatus,
    projectsStatus,
    languagesStatus,
    fetchData,
}) {
    const { project, projectId } = useProject();
    const { locale } = useI18n();
    useCheckLocaleAgainstProject();

    useEffect(() => {
        loadStuff();
    });

    function loadStuff() {
        loadCollections();
        loadProjects();
        loadLanguages();
    }

    function loadCollections() {
        if (
            project &&
            !collectionsStatus[`for_projects_${project?.id}`] &&
            !project.is_ohd
        ) {
            fetchData({ projectId, locale, project }, 'collections', null, null, `for_projects=${project?.id}`);
        }
    }

    function loadProjects() {
        if (projectId &&!projectsStatus.all) {
            fetchData({ projectId, locale, project }, 'projects', null, null, 'all');
        }
    }

    function loadLanguages() {
        if (!languagesStatus.all) {
            fetchData({ projectId, locale, project }, 'languages', null, null, 'all');
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
                <AfterRegisterPopup />
                <AfterConfirmationPopup />
                <AfterRequestProjectAccessPopup />
                <CorrectUserDataPopup />
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
    languagesStatus: PropTypes.object,
    projectsStatus: PropTypes.object,
    collectionsStatus: PropTypes.object,
    sidebarVisible: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    toggleSidebar: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
    setLocale: PropTypes.func.isRequired,
};
