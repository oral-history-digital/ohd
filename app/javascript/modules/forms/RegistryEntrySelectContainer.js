import { connect } from 'react-redux';

import RegistryEntrySelect from './RegistryEntrySelect';
import { fetchData } from 'modules/data';
import { getCurrentProject } from 'modules/data';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        projectId: state.archive.projectId,
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
