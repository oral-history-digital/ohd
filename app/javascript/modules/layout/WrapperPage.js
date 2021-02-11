import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';

import { ErrorBoundary } from 'modules/react-toolbox';
import { ArchivePopupContainer } from 'modules/ui';
import { ResizeWatcherContainer } from 'modules/responsive';
import { FlyoutTabs } from 'modules/flyout-tabs';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import MessagesContainer from './MessagesContainer';
import BurgerButton from './BurgerButton';

export default class WrapperPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
        }
    }

    componentDidMount() {
        this.loadAccount()
        this.loadCollections();
        this.loadProjects();
    }

    componentDidUpdate() {
        this.loadAccount()
        if (this.props.visible && (this.state.currentMQ === 'S' || this.state.currentMQ === 'XS')) {
            if (!document.body.classList.contains('noScroll')) {
                document.body.classList.add('noScroll');
            }
        } else {
            document.body.classList.remove('noScroll');
        }
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
            this.props.projectId &&
            !this.props.collectionsStatus[`collections_for_project_${this.props.projectId}`]
        ) {
            this.props.fetchData(this.props, 'collections', null, null, `collections_for_project=${this.props.projectId}`);
        }
    }

    loadProjects() {
        if (this.props.projectId && !this.props.projectsStatus.all) {
            this.props.fetchData(this.props, 'projects', null, null, 'all');
        }
    }

    loadLanguages() {
        if (!this.props.languagesStatus) {
            this.props.fetchData(this.props, 'languages', null, null, 'all');
        }
    }

    render() {
        const { visible, children, transcriptScrollEnabled, match } = this.props;

        return (
            <ResizeWatcherContainer>
                <div className={classNames({
                    'flyout-is-visible': visible,
                    'flyout-is-hidden': !visible,
                    'fix-video': transcriptScrollEnabled,
                })}>
                    <Helmet>
                        <html lang={match.params.locale} />
                    </Helmet>

                    <div className={classNames('Site', 'wrapper-page', {
                        'fix-video': transcriptScrollEnabled,
                        'fullscreen': !visible,
                    })}>
                        <SiteHeader />

                        <MessagesContainer loggedInAt={this.props.loggedInAt}
                                           notifications={this.state.notifications} />

                        <main className="Site-content">
                            {children}
                        </main>

                        <SiteFooter />

                        { transcriptScrollEnabled ? <div className="compensation" /> : null }
                    </div>

                    <BurgerButton open={visible}
                                  onClick={() => this.props.toggleFlyoutTabs(visible)}/>

                    <ErrorBoundary>
                        <FlyoutTabs />
                    </ErrorBoundary>

                    <ArchivePopupContainer/>
                </div>
            </ResizeWatcherContainer>
        )
    }
}

WrapperPage.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    isLoggedOut: PropTypes.bool.isRequired,
    loggedInAt: PropTypes.number.isRequired,
    transcriptScrollEnabled: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    accountsStatus: PropTypes.object,
    languagesStatus: PropTypes.object,
    projectsStatus: PropTypes.object,
    collectionsStatus: PropTypes.object,
    visible: PropTypes.bool,
    editView: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    match: PropTypes.object.isRequired,
    toggleFlyoutTabs: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
    deleteData: PropTypes.func.isRequired,
};
