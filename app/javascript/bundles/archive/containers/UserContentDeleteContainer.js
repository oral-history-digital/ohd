import { connect } from 'react-redux';

import UserContentDelete from '../components/UserContentDelete';
import { deleteUserContent } from '../actions/userContentActionCreators';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    deleteUserContent: (id) => dispatch(deleteUserContent(id)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContentDelete);
