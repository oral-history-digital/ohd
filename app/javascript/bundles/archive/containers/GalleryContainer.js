import { connect } from 'react-redux';
import Gallery from '../components/Gallery';
import { getInterview } from '../../../lib/utils';
import { openArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
    return {
        photos: getInterview(state).photos,
        translations: state.archive.translations,
        locale: state.archive.locale,
        project: state.archive.project,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
})


export default connect(mapStateToProps, mapDispatchToProps)(Gallery);
