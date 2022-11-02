import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    getContributionTypesForCurrentProject,
    getProjects,
    getCurrentProject
} from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import ContributionForm from './ContributionForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    project: getCurrentProject(state),
    contributionTypes: getContributionTypesForCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    // please NO submitData in here: it would disable
    // ContributionForm`s functionality
    // as sub-form
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ContributionForm);
