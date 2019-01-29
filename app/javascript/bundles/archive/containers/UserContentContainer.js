import { connect } from 'react-redux';

import UserContent from '../components/UserContent';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import { handleSegmentClick } from '../actions/interviewActionCreators';
import { searchInArchive } from '../actions/searchActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
        facets: state.search.archive.facets,
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time) => dispatch(handleSegmentClick(tape, time)),
    searchInArchive: (url, query) => dispatch(searchInArchive(url, query)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContent);
