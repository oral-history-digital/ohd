import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeArchivePopup } from 'modules/ui';
import { fetchData, getContributionTypesForCurrentProject,
    getPeopleStatus, getPeopleForCurrentProject,
    getProjects, getCurrentProject } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import { setFlyoutTabsIndex } from 'modules/flyout-tabs';
import ContributionForm from './ContributionForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    project: getCurrentProject(state),
    people: getPeopleForCurrentProject(state),
    peopleStatus: getPeopleStatus(state),
    contributionTypes: getContributionTypesForCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    closeArchivePopup,
    fetchData,
    setFlyoutTabsIndex,
    // please NO submitData in here: it would disable
    // ContributionForm`s functionality
    // as sub-form
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ContributionForm);
