import { getLocale, getProjectId } from 'modules/archive';
import { getCurrentProject, getCurrentUser, submitData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RequestProjectAccessForm from './RequestProjectAccessForm';

const mapStateToProps = (state) => {
    const project = getCurrentProject(state);
    return {
        project: project,
        currentUser: getCurrentUser(state),
        projectId: getProjectId(state),
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RequestProjectAccessForm);
