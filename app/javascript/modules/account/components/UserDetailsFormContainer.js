import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { submitData } from 'modules/data';
import { getCurrentProject, getCurrentAccount } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import UserDetailsForm from './UserDetailsForm';

const mapStateToProps = state => ({
    account: getCurrentAccount(state),
    locale: getLocale(state),
    project: getCurrentProject(state),
    projectId: getProjectId(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailsForm);
