import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';

import { ErrorBoundary } from 'modules/react-toolbox';
import { ArchivePopupContainer } from 'modules/ui';
import { ResizeWatcherContainer } from 'modules/user-agent';
import { FlyoutTabs } from 'modules/flyout-tabs';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import MessagesContainer from './MessagesContainer';
import BurgerButton from './BurgerButton';
import BackToTopButton from './BackToTopButton';
import { pathBase } from 'modules/routes';

export default class WrapperPage extends Component {
    constructor(props) {
        super(props);

        this.state = { notifications: [] };
    }

    componentDidMount() {
        this.fitLocale();
        this.loadStuff();
    }

    componentDidUpdate(prevProps) {
        this.fitLocale(prevProps.locale);
        this.loadStuff();
    }

    fitLocale(prevLocale) {
        const { history, location, locale, project, projectId, projects, setLocale } = this.props;

        const found = location.pathname.match(/^(\/[a-z]{2,4}){0,1}\/([a-z]{2})[\/$]/);
        const pathLocale = Array.isArray(found) ? found[2] : null;

        if (pathLocale) {
            if (project?.available_locales.indexOf(pathLocale) === -1) {
                const newPath = location.pathname.replace(/^(\/[a-z]{2,4}){0,1}\/([a-z]{2})\//, pathBase({projectId, locale: project.default_locale, projects}) + '/');
                history.push(newPath);
                setLocale(locale);
            } else if (pathLocale !== locale) {
                setLocale(pathLocale);
            }
        }
    }

    loadStuff() {
        this.loadAccount()
        //this.loadCollections();
        this.loadProjects();
        this.loadLanguages();
    }

    loadAccount() {
        if (
            !this.props.accountsStatus.current ||
            this.props.accountsStatus.current.split('-')[0] === 'reload' ||
            (this.props.isLoggedIn && !this.props.account && this.props.accountsStatus.current.split('-')[0] === 'fetched')
        ) {
            this.props.fetchData(this.props, 'accounts', 'current');
        } else if (this.props.isLoggedOut && this.props.account) {
            this.props.deleteData(this.props, 'accounts', 'current', null, null, false, true)
        }
    }

    loadCollections() {
        if (
            this.props.project && !this.props.collectionsStatus[`for_projects=${this.props.project?.id}`]
        ) {
            this.props.fetchData(this.props, 'collections', null, null, `for_projects=${this.props.project?.id}`);
        }
    }

    loadProjects() {
        if (this.props.projectId && !this.props.projectsStatus.all) {
            this.props.fetchData(this.props, 'projects', null, null, 'all');
        }
    }

    loadLanguages() {
        if (!this.props.languagesStatus.all) {
            this.props.fetchData(this.props, 'languages', null, null, 'all');
        }
    }

    render() {
        const { scrollPositionBelowThreshold, flyoutTabsVisible, children, match, toggleFlyoutTabs } = this.props;

        return (
            <ResizeWatcherContainer>
                <div className={classNames('Layout', {
                    'sidebar-is-visible': flyoutTabsVisible,
                    'is-sticky': scrollPositionBelowThreshold,
                })}>
                    <Helmet>
                        <html lang={match.params.locale} />
                    </Helmet>

                    <div className={classNames('Layout-page', 'Site')}>
                        <SiteHeader />

                        <MessagesContainer
                            loggedInAt={this.props.loggedInAt}
                            notifications={this.state.notifications}
                        />

                        <main className="Site-content">
                            {children}
                        </main>

                        <SiteFooter />
                    </div>

                    <ErrorBoundary>
                        <FlyoutTabs className="Layout-sidebar" />
                    </ErrorBoundary>

                    <BurgerButton
                        className="Layout-sidebarToggle"
                        open={flyoutTabsVisible}
                        onClick={() => toggleFlyoutTabs(flyoutTabsVisible)}
                    />

                    <BackToTopButton
                        visible={scrollPositionBelowThreshold}
                        fullscreen={!flyoutTabsVisible}
                    />

                    <ArchivePopupContainer/>
                </div>
            </ResizeWatcherContainer>
        )
    }
}

WrapperPage.propTypes = {
    scrollPositionBelowThreshold: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool,
    isLoggedOut: PropTypes.bool,
    loggedInAt: PropTypes.number,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string,
    projects: PropTypes.object.isRequired,
    accountsStatus: PropTypes.object,
    languagesStatus: PropTypes.object,
    projectsStatus: PropTypes.object,
    collectionsStatus: PropTypes.object,
    flyoutTabsVisible: PropTypes.bool,
    editView: PropTypes.bool.isRequired,
    account: PropTypes.object,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    match: PropTypes.object.isRequired,
    toggleFlyoutTabs: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
};

