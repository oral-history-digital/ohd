import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hideSidebar, setSidebarTabsIndex } from 'modules/sidebar';
import { setViewMode, getLocale, getViewModes, getViewMode, getTranslations,
    getProjectId, getEditView } from 'modules/archive';
import { getCurrentProject, getProjects, getCurrentAccount } from 'modules/data';
import { getIsLoggedIn } from 'modules/account';
import { searchInArchive } from '../actions';
import { getArchiveFacets, getArchiveFoundInterviews, getArchiveQuery, getArchiveResultPagesCount,
    getArchiveResultsCount, getArchiveSearchResultsAvailable } from '../selectors';
import ArchiveSearch from './ArchiveSearch';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        resultsAvailable: getArchiveSearchResultsAvailable(state),
        foundInterviews: getArchiveFoundInterviews(state),
        resultPagesCount: getArchiveResultPagesCount(state),
        resultsCount: getArchiveResultsCount(state),
        query: getArchiveQuery(state),
        facets: getArchiveFacets(state),
        translations: getTranslations(state),
        locale: getLocale(state),
        isArchiveSearching: state.search.isArchiveSearching,
        project: project,
        projectId: getProjectId(state),
        projects: getProjects(state),
        viewModes: getViewModes(state),
        currentViewMode: getViewMode(state),
        listColumns: project && project.list_columns,
        editView: getEditView(state),
        account: getCurrentAccount(state),
        isLoggedIn: getIsLoggedIn(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    searchInArchive,
    setViewMode,
    hideSidebar,
    setSidebarTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearch);
