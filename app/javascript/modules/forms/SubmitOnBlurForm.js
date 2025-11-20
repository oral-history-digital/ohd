import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getCurrentProject } from 'modules/data';
import { getProjectId } from 'modules/archive';
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
