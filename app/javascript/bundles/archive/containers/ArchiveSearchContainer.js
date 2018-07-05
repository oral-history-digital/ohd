import { connect } from 'react-redux';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import ArchiveSearch from '../components/ArchiveSearch';
import { searchInArchive } from '../actions/searchActionCreators';

const mapStateToProps = (state) => {
    return { 
        foundInterviews: state.search.foundInterviews,
        allInterviewsCount: state.search.allInterviewsCount,
        resultPagesCount: state.search.resultPagesCount,
        foundSegmentsForInterviews: state.search.foundSegmentsForInterviews,
        resultsCount: state.search.resultsCount,
        query: state.search.query,
        interviews: state.search.interviews,
        translations: state.archive.translations,
        locale: state.archive.locale,
        locales: state.archive.locales,
        isArchiveSearching: state.search.isArchiveSearching,
        project: state.archive.project,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    searchInArchive: (url, query) => dispatch(searchInArchive(url, query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearch);


