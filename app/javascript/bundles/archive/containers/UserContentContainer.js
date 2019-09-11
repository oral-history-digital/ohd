import { connect } from 'react-redux';

import UserContent from '../components/UserContent';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import { setTapeAndTime } from '../actions/interviewActionCreators';
import { setArchiveId } from '../actions/archiveActionCreators';
import { searchInArchive } from '../actions/searchActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        translations: state.archive.translations,
        facets: state.search.archive.facets,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setTapeAndTime: (tape, time) => dispatch(setTapeAndTime(tape, time)),
    searchInArchive: (url, query) => dispatch(searchInArchive(url, query)),
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContent);
