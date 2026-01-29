import { getProjectId } from 'modules/archive';
import { getCurrentProject, submitData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SubmitOnBlurFormComponent from './SubmitOnBlurFormComponent';

const mapStateToProps = (state) => ({
    // locale is set with props.
    projectId: getProjectId(state),
    project: getCurrentProject(state),
});

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
)(SubmitOnBlurFormComponent);
