import { connect } from 'react-redux';

import UserContent from '../components/UserContent';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import { handleSegmentClick } from '../actions/interviewActionCreators';
import { searchInArchive } from '../actions/searchActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locale: state.archive.locale,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: time => dispatch(handleSegmentClick(time)),
    searchInArchive: (query) => dispatch(searchInArchive(query)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContent);
