import { connect } from 'react-redux';

import RegistryEntry from '../components/RegistryEntry';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { deleteData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.account,
        editView: state.archive.editView
    }
}

const mapDispatchToProps = (dispatch) => ({
    deleteData: (dataType, id, nestedDataType, nestedId) => dispatch(deleteData(dataType, id, nestedDataType, nestedId)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntry);
