import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { submitData } from 'bundles/archive/actions/dataActionCreators';
import { closeArchivePopup } from 'bundles/archive/actions/archivePopupActionCreators';
import { getProjects, getCurrentAccount } from 'bundles/archive/selectors/dataSelectors';
import { getLocale, getProjectId } from 'bundles/archive/selectors/archiveSelectors';
import UserDetailsForm from './UserDetailsForm';

const mapStateToProps = state => ({
    account: getCurrentAccount(state),
    locale: getLocale(state),
    projects: getProjects(state),
    projectId: getProjectId(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailsForm);
