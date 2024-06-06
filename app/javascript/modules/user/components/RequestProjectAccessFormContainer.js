import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getCurrentProject, getCurrentUser } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import RequestProjectAccessForm from './RequestProjectAccessForm';

const mapStateToProps = state => {
    const project = getCurrentProject(state);
    return {
        project: project,
        currentUser: getCurrentUser(state),
        projectId: getProjectId(state),
    }
};

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RequestProjectAccessForm);
