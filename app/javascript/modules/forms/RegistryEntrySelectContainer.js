import { connect } from 'react-redux';

import { fetchData, getProjects, getCurrentProject } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import RegistryEntrySelect from './RegistryEntrySelect';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || state.archive.locales,
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: state.archive.translations,
        project: project,
        registryEntries: state.data.registry_entries,
        registryEntriesStatus: state.data.statuses.registry_entries,
        lastModifiedRegistryEntries: state.data.statuses.registry_entries.lastModified,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntrySelect);
