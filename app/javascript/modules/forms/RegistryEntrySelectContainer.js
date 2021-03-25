import { connect } from 'react-redux';

import { fetchData, getProjects, getCurrentProject, getRegistryEntries } from 'modules/data';
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
        registryEntriesStatus: state.data.statuses.registry_entries,
        lastModifiedRegistryEntries: state.data.statuses.registry_entries.lastModified,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntrySelect);
