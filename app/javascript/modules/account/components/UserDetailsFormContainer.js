import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { submitData } from 'bundles/archive/actions/dataActionCreators';
import { getProjects, getCurrentAccount } from 'bundles/archive/selectors/dataSelectors';
import { getLocale, getProjectId } from 'modules/archive';
import UserDetailsForm from './UserDetailsForm';

const mapStateToProps = state => ({
    account: getCurrentAccount(state),
    locale: getLocale(state),
    projects: getProjects(state),
    projectId: getProjectId(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailsForm);
