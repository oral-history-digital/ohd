import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentProject, fetchData, getRegistryEntriesStatus, getProjects } from 'modules/data';
import { getProjectId, getLocale } from 'modules/archive';
import SelectedRegistryReferences from './SelectedRegistryReferences';

const mapStateToProps = state => ({
    project: getCurrentProject(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SelectedRegistryReferences);
