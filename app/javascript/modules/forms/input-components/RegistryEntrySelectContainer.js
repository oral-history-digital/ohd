import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getProjects, getCurrentProject, getProjectLocales, getRegistryEntries,
    getRegistryEntriesStatus } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import RegistryEntrySelect from './RegistryEntrySelect';

const mapStateToProps = state => ({
    locale: getLocale(state),
    locales: getProjectLocales(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    project: getCurrentProject(state),
    registryEntries: getRegistryEntries(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
    lastModifiedRegistryEntries: getRegistryEntriesStatus(state).lastModified,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntrySelect);
