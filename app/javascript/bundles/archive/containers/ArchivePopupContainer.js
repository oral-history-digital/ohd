import { connect } from 'react-redux';

import ArchivePopup from '../components/ArchivePopup';
import { closeArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        popup: state.archive.popup
    }
}

const mapDispatchToProps = (dispatch) => ({
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(ArchivePopup);
