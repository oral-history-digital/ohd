import { connect } from 'react-redux';

import RegistryEntry from '../components/RegistryEntry';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData, deleteData } from '../actions/dataActionCreators';
import { addRemoveRegistryEntryId } from '../actions/archiveActionCreators';
import { getCookie } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return { 
        archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        translations: state.archive.translations,
        registryEntriesStatus: state.data.statuses.registry_entries,
        account: state.data.accounts.current,
        editView: state.archive.editView,
        selectedRegistryEntryIds: state.archive.selectedRegistryEntryIds,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    addRemoveRegistryEntryId: (id) => dispatch(addRemoveRegistryEntryId(id)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntry);
