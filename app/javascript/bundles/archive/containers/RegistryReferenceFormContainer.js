import { connect } from 'react-redux';

import RegistryReferenceForm from '../components/RegistryReferenceForm';
import { submitData, fetchData } from '../actions/dataActionCreators';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
    return { 
        locales: state.archive.locales,
        translations: state.archive.translations,
        registryEntries: state.data.registry_entries,
        registryReferenceTypes: state.data.registry_reference_types,
        registryReferenceTypesStatus: state.data.statuses.registry_reference_types.all,
        registryEntriesStatus: state.data.statuses.registry_entries,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, id, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, id, nestedDataType, locale, extraParams)),
    submitData: (params) => dispatch(submitData(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryReferenceForm);
