import { connect } from 'react-redux';

import RegistryReferences from '../components/RegistryReferences';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData } from '../actions/dataActionCreators';
import { getInterview, getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return { 
        projectId: state.archive.projectId,
        project: getProject(state),
        interview: getInterview(state),
        translations: state.archive.translations,
        registryEntries: state.data.registry_entries,
        registryEntriesStatus: state.data.statuses.registry_entries,
        account: state.data.accounts.current,
        editView: state.archive.editView,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryReferences);
