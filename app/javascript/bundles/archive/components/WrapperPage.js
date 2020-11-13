import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ActionCable from 'actioncable';

import ResizeWatcherContainer from '../containers/ResizeWatcherContainer';
import FlyoutTabsContainer from '../containers/FlyoutTabsContainer';
import ArchivePopupContainer from '../containers/ArchivePopupContainer';
import BurgerButton from './layout/BurgerButton';
import MessagesContainer from '../containers/layout/MessagesContainer';
import SiteHeaderContainer from '../containers/layout/SiteHeaderContainer';
import SiteFooter from './layout/SiteFooter';

export default class WrapperPage extends React.Component {
    static propTypes = {
        editView: PropTypes.bool.isRequired,
    }

    static contextTypes = {
        router: PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            editView: this.props.editViewCookie,
        }
        this.props.changeToEditView(this.props.editViewCookie)
    }

    componentDidMount(prevProps) {
        if(this.props.locale !== this.context.router.route.match.params.locale) {
            this.props.setLocale(this.context.router.route.match.params.locale);
        }
        this.loadAccount()
        this.loadCollections();
        this.loadProjects();
        //this.setProjectId();
    }

    componentDidUpdate(prevProps, prevState) {
        this.loadAccount()
        if (this.props.visible && (this.state.currentMQ === 'S' || this.state.currentMQ === 'XS')) {
            if (!document.body.classList.contains('noScroll')) {
                document.body.classList.add('noScroll');
            }
        } else {
            document.body.classList.remove('noScroll');
        }
        if (prevProps.editView !== this.props.editView) {
            this.setState({editView: this.props.editView})
        }
        this.loadCollections();
        this.loadProjects();
        this.loadLanguages();
        //this.setProjectId();
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

    setProjectId() {
        //
        // TODO: enable this for really multi-project use
        //
        if (this.context.router.route.match.params.projectId !== this.props.projectId) {
            this.props.setProjectId(this.context.router.route.match.params.projectId);
        }
    }

    createSocket() {
        let cable = ActionCable.createConsumer('/cable');

        this.notifications = cable.subscriptions.create({
            channel: "WebNotificationsChannel"
        }, {
            //connected: () => {},
            received: (data) => {
                console.log(data);
                this.setState({notifications: [...this.state.notifications, data]})
            },
            //create: function(content) {}
        });
    }

    render() {
        const { visible, locale, project,children,  transcriptScrollEnabled } = this.props;

        return (
            <ResizeWatcherContainer>
                <div className={classNames({
                    'flyout-is-visible': visible,
                    'flyout-is-hidden': !visible,
                    'fix-video': transcriptScrollEnabled,
                })}>
                    <div className={classNames('wrapper-page', {
                        'fix-video': transcriptScrollEnabled,
                        'fullscreen': !visible,
                    })}>
                        <SiteHeaderContainer logos={project.logos} />

                        <MessagesContainer loggedInAt={this.props.loggedInAt}
                                           notifications={this.state.notifications} />

                        {children}

                        <SiteFooter project={project} locale={locale} />

                        { transcriptScrollEnabled ? <div className="compensation" /> : null }
                    </div>

                    <BurgerButton open={visible}
                                  onClick={() => this.props.toggleFlyoutTabs(visible)}/>

                    <FlyoutTabsContainer />

                    <ArchivePopupContainer/>
                </div>
            </ResizeWatcherContainer>
        )
    }
}
