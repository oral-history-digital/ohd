import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getCurrentProject, getCurrentUser, getProjects, getRegistryEntries,
    getRegistryEntriesStatus } from 'modules/data';
import { getEditView, getLocale, getProjectId, getTranslations } from 'modules/archive';
import RegistryEntries from './RegistryEntries';
import { getIsLoggedIn } from 'modules/user';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    registryEntries: getRegistryEntries(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
    project: getCurrentProject(state),
    user: getCurrentUser(state),
    editView: getEditView(state),
    isLoggedIn: getIsLoggedIn(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntries);
