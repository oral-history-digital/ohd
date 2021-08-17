import { connect } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import { getIsLoggedIn } from 'modules/account';
import SelectedRegistryReferences from './SelectedRegistryReferences';

const mapStateToProps = state => ({
    project: getCurrentProject(state),
    isLoggedIn: getIsLoggedIn(state),
});

export default connect(mapStateToProps)(SelectedRegistryReferences);
