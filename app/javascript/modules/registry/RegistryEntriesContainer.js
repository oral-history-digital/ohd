import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getCurrentProject, getCurrentAccount, getProjects, getRegistryEntries,
    getRegistryEntriesStatus } from 'modules/data';
import { getEditView, getLocale, getProjectId, getTranslations } from 'modules/archive';
import RegistryEntries from './RegistryEntries';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    registryEntries: getRegistryEntries(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
    project: getCurrentProject(state),
    account: getCurrentAccount(state),
    editView: getEditView(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntries);
