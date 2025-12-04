import { getLocale, getProjectId } from 'modules/archive';
import {
    getContributionTypesForCurrentProject,
    getCurrentProject,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ContributionForm from './ContributionForm';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    contributionTypes: getContributionTypesForCurrentProject(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            // please NO submitData in here: it would disable
            // ContributionForm`s functionality
            // as sub-form
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(ContributionForm);
