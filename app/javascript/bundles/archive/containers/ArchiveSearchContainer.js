import { connect } from 'react-redux';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import ArchiveSearch from '../components/ArchiveSearch';
import { searchInArchive } from '../actions/searchActionCreators';
import { setViewMode } from '../actions/archiveActionCreators';

const mapStateToProps = (state) => {
    return { 
        foundInterviews: state.search.archive.foundInterviews,
        allInterviewsCount: state.search.archive.allInterviewsCount,
        resultPagesCount: state.search.archive.resultPagesCount,
        foundSegmentsForInterviews: state.search.archive.foundSegmentsForInterviews,
        resultsCount: state.search.archive.resultsCount,
        query: state.search.archive.query,
        facets: state.search.archive.facets,
        interviews: state.search.interviews,
        translations: state.archive.translations,
        locale: state.archive.locale,
        locales: state.archive.locales,
        isArchiveSearching: state.search.isArchiveSearching,
        project: state.archive.project,
        viewMode: state.archive.viewMode,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    searchInArchive: (url, query) => dispatch(searchInArchive(url, query)),
    setViewMode: (viewMode) => dispatch(setViewMode(viewMode)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearch);


