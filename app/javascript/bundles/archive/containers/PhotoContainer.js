import { connect } from 'react-redux';
import Photo from '../components/Photo';
import { getInterview } from '../../../lib/utils';
import { openArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
    return {
        interview: getInterview(state),
        translations: state.archive.translations,
        locale: state.archive.locale,
        editView: state.archive.editView,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        project: state.archive.project,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
})


export default connect(mapStateToProps, mapDispatchToProps)(Photo);
