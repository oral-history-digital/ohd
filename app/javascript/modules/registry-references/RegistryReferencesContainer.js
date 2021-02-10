import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openArchivePopup  } from 'modules/ui';
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
    openArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryReferences);
