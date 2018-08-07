import { connect } from 'react-redux';

import RegistryReferenceForm from '../components/RegistryReferenceForm';
import { submitData, fetchData } from '../actions/dataActionCreators';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        registryEntries: state.data.registry_entries,
        registryReferenceTypes: state.data.registry_reference_types,
        registry_reference_types_status: state.data.registry_reference_types_status,
        data: state.data,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (dataType, id, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, id, nestedDataType, locale, extraParams)),
    submitData: (params) => dispatch(submitData(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryReferenceForm);
