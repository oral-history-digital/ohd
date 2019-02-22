import { connect } from 'react-redux';

import PhotoForm from '../components/PhotoForm';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { submitData, fetchData, deleteData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        account: state.data.accounts.current,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (params) => dispatch(submitData(params)),
    fetchData: (dataType, archiveId, nestedDataType, locale, extraParams) => dispatch(fetchData(dataType, archiveId, nestedDataType, locale, extraParams)),
    deleteData: (dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(dataType, id, nestedDataType, nestedId, skipRemove)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(PhotoForm);
