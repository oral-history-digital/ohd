import { connect } from 'react-redux';

import RegistryEntrySearchFacets from '../components/RegistryEntrySearchFacets';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
//import { deleteData } from '../actions/dataActionCreators';
import { fetchData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        //archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        translations: state.archive.translations,
        data: state.data,
        registryEntries: state.data.registry_entries,
        registry_entries_status: state.data.registry_entries_status,
        registry_reference_types_status: state.data.registry_reference_types_status,
        //account: state.account,
        //editView: state.archive.editView
    }
}

const mapDispatchToProps = (dispatch) => ({
    //deleteData: (dataType, id, nestedDataType, nestedId) => dispatch(deleteData(dataType, id, nestedDataType, nestedId)),
    fetchData: (dataType, archiveId, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, archiveId, nestedDataType, locale, extraParams)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    //closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntrySearchFacets);
