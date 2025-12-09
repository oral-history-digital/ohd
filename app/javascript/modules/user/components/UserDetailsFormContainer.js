import { getLocale, getProjectId } from 'modules/archive';
import { submitData } from 'modules/data';
import { getCurrentProject, getCurrentUser } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import UserDetailsForm from './UserDetailsForm';

const mapStateToProps = (state) => ({
    user: getCurrentUser(state),
    locale: getLocale(state),
    project: getCurrentProject(state),
    projectId: getProjectId(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailsForm);
