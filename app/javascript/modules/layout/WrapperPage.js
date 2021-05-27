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

export default class WrapperPage extends Component {
    constructor(props) {
        super(props);

        this.state = { notifications: [] };
    }

    componentDidMount() {
        this.loadStuff();
    }

    componentDidUpdate() {
        this.loadStuff();
    }

    loadStuff() {
        this.loadAccount()
        this.loadCollections();
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
            !this.props.collectionsStatus.all
        ) {
            this.props.fetchData(this.props, 'collections', null, null, 'all');
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
        const { isSticky, flyoutTabsVisible, children, match, toggleFlyoutTabs } = this.props;

        return (
            <ResizeWatcherContainer>
                <div className={classNames('Layout', {
                    'sidebar-is-visible': flyoutTabsVisible,
                    'is-sticky': isSticky,
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

                    <ArchivePopupContainer/>
                </div>
            </ResizeWatcherContainer>
        )
    }
}

WrapperPage.propTypes = {
    isSticky: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool,
    isLoggedOut: PropTypes.bool,
    loggedInAt: PropTypes.number,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
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
