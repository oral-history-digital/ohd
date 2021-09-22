import { connect } from 'react-redux';

import { getCurrentInterview, getCurrentProject, getProjects,
    getRegistryEntries, getRegistryEntriesStatus } from 'modules/data';
import { getProjectId, getLocale } from 'modules/archive';
import RegistryReferences from './RegistryReferences';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    project: getCurrentProject(state),
    interview: getCurrentInterview(state),
    registryEntries: getRegistryEntries(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
});

export default connect(mapStateToProps)(RegistryReferences);
