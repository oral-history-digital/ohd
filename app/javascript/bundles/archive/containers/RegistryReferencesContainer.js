import { connect } from 'react-redux';

import RegistryReferences from '../components/RegistryReferences';
import { openArchivePopup  } from 'modules/ui';
import { fetchData, getCurrentInterview } from 'modules/data';
import { getProject } from 'lib/utils';

const mapStateToProps = (state) => {
    return {
        projectId: state.archive.projectId,
        projects: state.data.projects,
        project: getProject(state),
        interview: getCurrentInterview(state),
        translations: state.archive.translations,
        registryEntries: state.data.registry_entries,
        registryEntriesStatus: state.data.statuses.registry_entries,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryReferences);
