import { connect } from 'react-redux';

import RegistryEntryMetadataFields from '../components/RegistryEntryMetadataFields';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { fetchData } from '../actions/dataActionCreators';
import { getCookie } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        registryEntries: state.data.registry_entries,
        registryEntriesStatus: state.data.statuses.registry_entries,
        account: state.data.accounts.current,
        editView: getCookie('editView'),
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntryMetadataFields);
