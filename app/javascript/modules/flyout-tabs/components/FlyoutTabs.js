import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import { AccountContainer } from 'modules/account';
import { admin } from 'modules/auth';
import { StateCheck, getCurrentInterviewFetched } from 'modules/data';
import ArchiveSearchTabPanelContainer from './ArchiveSearchTabPanelContainer';
import RegistryEntriesTabPanelContainer from './RegistryEntriesTabPanelContainer';
import WorkbookTabPanel from './WorkbookTabPanel';
import UsersAdminTabPanelContainer from './UsersAdminTabPanelContainer';
import IndexingTabPanelContainer from './IndexingTabPanelContainer';
import MapTabPanelContainer from './MapTabPanelContainer';
import InterviewTabPanelContainer from './InterviewTabPanelContainer';
import ProjectConfigTabPanelContainer from './ProjectConfigTabPanelContainer';
import LocaleButtonsContainer from './LocaleButtonsContainer';
import * as indexes from '../constants';
import { Spinner } from 'modules/spinners';
import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';

export default class FlyoutTabs extends Component {
    constructor(props) {
        super(props);

        this.handleTabClick = this.handleTabClick.bind(this);
    }

    handleTabClick(index) {
        const { history, isLoggedIn, hasMap, setFlyoutTabsIndex } = this.props;

        setFlyoutTabsIndex(index);

        switch (index) {
        case indexes.INDEX_ACCOUNT:
            if (isLoggedIn) {
                history.push(`${pathBase(this.props)}/accounts/current`);
            }
            break;
        case indexes.INDEX_SEARCH:
            history.push(`${pathBase(this.props)}/searches/archive`);
            break;
        case indexes.INDEX_INTERVIEW:
            history.push(`${pathBase(this.props)}/interviews/${this.props.archiveId}`);
            break;
        case indexes.INDEX_REGISTRY_ENTRIES:
            history.push(`${pathBase(this.props)}/registry_entries`);
            break;
        case indexes.INDEX_MAP:
            if (hasMap) {
                history.push(`${pathBase(this.props)}/searches/map`);
            }
            break;
        default:
        }
    }

    activeCss(index) {
        let offset = this.props.hasMap;
        return ((index === 5 + offset || index === 6 + offset) ? 'active activeadmin' : 'active')
    }

    render() {
        const { className, flyoutTabsIndex, interview, projectId, project, archiveId, isLoggedIn, hasMap } = this.props;

        return (
            <Tabs
                className={classNames(className, 'Sidebar', 'wrapper-flyout')}
                selectedTabClassName="active"
                selectedTabPanelClassName="active"
                selectedIndex={flyoutTabsIndex}
                onSelect={this.handleTabClick}
            >
                <TabList className='flyout'>
                    <Tab className='flyout-top-nav'>
                        { t(this.props, isLoggedIn ? 'account_page' : 'login_page') }
                    </Tab>

                    <LocaleButtonsContainer />

                    <Tab className={project ? 'flyout-tab' : 'hidden'}>
                        { t(this.props, (projectId === 'campscapes' && !archiveId) ? 'user_registration.notes_on_tos_agreement' : 'archive_search') }
                    </Tab>

                    <Tab className={interview && project ? 'flyout-tab' : 'hidden'}>
                        { t(this.props, 'interview') }
                    </Tab>

                    <Tab className={isLoggedIn && project ? 'flyout-tab' : 'hidden'}>
                        { t(this.props, 'registry') }
                    </Tab>

                    {
                        hasMap && (
                            <Tab className='flyout-tab'>
                                { t(this.props, 'map') }
                            </Tab>
                        )
                    }

                    <Tab className={isLoggedIn ? 'flyout-tab' : 'hidden'}>
                        { t(this.props, 'user_content') }
                    </Tab>

                    <Tab
                        selectedClassName='admin'
                        className={project && admin(this.props, {type: 'General'}, 'edit') ? 'flyout-tab admin' : 'hidden'}
                    >
                        { t(this.props, 'edit.indexing') }
                    </Tab>

                    <Tab
                        selectedClassName='admin'
                        className={project && admin(this.props, {type: 'General'}, 'edit') ? 'flyout-tab admin' : 'hidden'}
                    >
                        { t(this.props, 'edit.administration') }
                    </Tab>
                    <Tab
                        selectedClassName='admin'
                        className={project && admin(this.props, {type: 'Project'}, 'update') ? 'flyout-tab admin' : 'hidden'}
                    >
                        { t(this.props, 'edit.project.admin') }
                    </Tab>
                </TabList>

                <TabPanel>
                    <AccountContainer/>
                </TabPanel>

                <TabPanel>
                    { project && <ArchiveSearchTabPanelContainer selectedArchiveIds={this.props.selectedArchiveIds} /> }
                </TabPanel>

                <TabPanel>
                    <StateCheck
                        testSelector={getCurrentInterviewFetched}
                        fallback={<Spinner withPadding />}
                    >
                        { project && <InterviewTabPanelContainer /> }
                    </StateCheck>
                </TabPanel>

                <TabPanel>
                    { project && <RegistryEntriesTabPanelContainer /> }
                </TabPanel>

                {
                    hasMap && project ?
                        (<TabPanel>
                            <MapTabPanelContainer />
                        </TabPanel>) :
                        null
                }

                <TabPanel>
                    <WorkbookTabPanel />
                </TabPanel>

                <TabPanel>
                    { project && <IndexingTabPanelContainer /> }
                </TabPanel>

                <TabPanel>
                    { project && <UsersAdminTabPanelContainer /> }
                </TabPanel>

                <TabPanel>
                    { project && <ProjectConfigTabPanelContainer /> }
                </TabPanel>
            </Tabs>
        );
    }
}

FlyoutTabs.propTypes = {
    className: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    interview: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    archiveId: PropTypes.string.isRequired,
    hasMap: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    flyoutTabsIndex: PropTypes.number.isRequired,
    selectedArchiveIds: PropTypes.array,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};
