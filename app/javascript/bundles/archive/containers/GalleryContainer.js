import { connect } from 'react-redux';
import Gallery from '../components/Gallery';
import ArchiveUtils from '../../../lib/utils';
import { openArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = (state) => {
    return {
        photos: ArchiveUtils.getInterview(state).interview.photos,
        translations: state.archive.translations,
        locale: state.archive.locale
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
})


export default connect(mapStateToProps, mapDispatchToProps)(Gallery);
