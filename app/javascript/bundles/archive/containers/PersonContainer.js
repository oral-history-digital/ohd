import { connect } from 'react-redux';

import Person from '../components/Person';
import { openArchivePopup, closeArchivePopup } from '../actions/archivePopupActionCreators';
import { deleteData } from '../actions/dataActionCreators';
import { getCookie } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return { 
        archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
    }
}

const mapDispatchToProps = (dispatch) => ({
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(Person);