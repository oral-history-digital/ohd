import { connect } from 'react-redux';

import RegistryEntries from '../components/RegistryEntries';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        registryEntries: state.data.registry_entries,
        registryEntriesStatus: state.data.statuses.registry_entries,
        hiddenRegistryEntryIds: state.archive.hiddenRegistryEntryIds,
        account: state.data.accounts.current,
        editView: state.archive.editView,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, archiveId, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, archiveId, nestedDataType, locale, extraParams)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntries);
