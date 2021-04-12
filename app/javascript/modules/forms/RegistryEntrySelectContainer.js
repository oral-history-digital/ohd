import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getProjects, getCurrentProject, getRegistryEntries, getRegistryEntriesStatus } from 'modules/data';
import { getLocale, getProjectId, getTranslations, getLocales } from 'modules/archive';
import RegistryEntrySelect from './RegistryEntrySelect';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        project: project,
        registryEntries: getRegistryEntries(state),
        registryEntriesStatus: getRegistryEntriesStatus(state),
        lastModifiedRegistryEntries: getRegistryEntriesStatus(state).lastModified,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntrySelect);
