import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getCurrentInterview, getCurrentProject, getProjects,
    getRegistryEntries, getRegistryEntriesStatus } from 'modules/data';
import { getProjectId, getTranslations, getLocale } from 'modules/archive';
import RegistryReferences from './RegistryReferences';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    project: getCurrentProject(state),
    interview: getCurrentInterview(state),
    translations: getTranslations(state),
    registryEntries: getRegistryEntries(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryReferences);
