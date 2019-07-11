import { connect } from 'react-redux';

import Form from '../../components/form/Form';
import { openArchivePopup, closeArchivePopup } from '../../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    closeArchivePopup: () => dispatch(closeArchivePopup()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Form);
