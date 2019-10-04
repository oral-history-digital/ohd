import { connect } from 'react-redux';
import Gallery from '../components/Gallery';
import { getInterview, getCookie, getProject } from '../../../lib/utils';
import { openArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        interview: getInterview(state),
        translations: state.archive.translations,
        locale: state.archive.locale,
        editView: state.archive.editView,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        project: project && project.identifier,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
})


export default connect(mapStateToProps, mapDispatchToProps)(Gallery);
