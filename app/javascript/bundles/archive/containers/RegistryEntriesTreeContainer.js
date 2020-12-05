import { connect } from 'react-redux';

import RegistryEntriesTree from '../components/RegistryEntriesTree';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData, submitData } from '../actions/dataActionCreators';
import { setFlyoutTabsIndex } from '../actions/flyoutTabsActionCreators';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        project: project,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        registryEntries: state.data.registry_entries,
        registryEntriesStatus: state.data.statuses.registry_entries,
        foundRegistryEntries: state.search.registryEntries,
        editView: state.archive.editView,
        account: state.data.accounts.current,
        isLoggedIn: state.account.isLoggedIn,
        selectedRegistryEntryIds: state.archive.selectedRegistryEntryIds,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
    setFlyoutTabsIndex: index => dispatch(setFlyoutTabsIndex(index)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntriesTree);
