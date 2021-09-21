import { connect } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import SelectedRegistryReferences from './SelectedRegistryReferences';

const mapStateToProps = state => ({
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(SelectedRegistryReferences);
