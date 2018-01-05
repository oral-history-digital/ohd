import { connect } from 'react-redux';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import ArchiveSearch from '../components/ArchiveSearch';
import { searchInArchive } from '../actions/searchActionCreators';

const mapStateToProps = (state) => {
    return { 
        foundInterviews: state.search.foundInterviews,
        allInterviewsCount: state.search.allInterviewsCount,
        resultPagesCount: state.search.resultPagesCount,
        resultsCount: state.search.resultsCount,
        query: state.search.query,
        interviews: state.search.interviews,
        translations: state.archive.translations,
        locale: state.archive.locale,
        isArchiveSearching: state.search.isArchiveSearching,
        account: state.account
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    searchInArchive: (query) => dispatch(searchInArchive(query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearch);


