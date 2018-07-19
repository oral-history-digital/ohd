import { connect } from 'react-redux';
import Histories from '../components/Histories';
import { openArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        //people: state.data.people,
        //people_status: state.data.people_status,
        //history_last_deleted: state.data.people.history_last_deleted,
        account: state.account,
        editView: state.archive.editView,

    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Histories);

