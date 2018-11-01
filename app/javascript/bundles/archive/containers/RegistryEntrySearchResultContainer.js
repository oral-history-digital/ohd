import { connect } from 'react-redux';

import RegistryEntrySearchResult from '../components/RegistryEntrySearchResult';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData, deleteData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        translations: state.archive.translations,
        registryEntriesStatus: state.data.statuses.registry_entries,
        account: state.account,
        editView: state.archive.editView
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, archiveId, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, archiveId, nestedDataType, locale, extraParams)),
    deleteData: (dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(dataType, id, nestedDataType, nestedId, skipRemove)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntrySearchResult);
