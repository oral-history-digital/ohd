import { connect } from 'react-redux';

import UserContentForm from '../components/UserContentForm';
import { submitUserContent } from '../actions/userContentActionCreators';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitUserContent: (params) => dispatch(submitUserContent(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContentForm);
