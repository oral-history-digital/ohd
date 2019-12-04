import { connect } from 'react-redux';
import { openArchivePopup } from '../actions/archivePopupActionCreators';
import ArchiveSearch from '../components/ArchiveSearch';
import { searchInArchive } from '../actions/searchActionCreators';
import { setViewMode } from '../actions/archiveActionCreators';
import { getCookie } from '../../../lib/utils';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
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
        locales: (project && project.available_locales) || state.archive.locales,
        isArchiveSearching: state.search.isArchiveSearching,
        project: project,
        projectId: state.archive.projectId,
        viewModes: project && project.view_modes,
        viewMode: state.archive.viewMode,
        listColumns: project && project.list_columns,
        detailViewFields: project && project.detail_view_fields,
        editView: state.archive.editView,
        account: state.data.accounts.current,
        isLoggedIn: state.account.isLoggedIn,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    searchInArchive: (url, query) => dispatch(searchInArchive(url, query)),
    setViewMode: (viewMode) => dispatch(setViewMode(viewMode)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearch);


