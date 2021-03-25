import { connect } from 'react-redux';

import { hideFlyoutTabs, setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { setViewMode, getLocale, getViewMode, getTranslations, getProjectId,
    getEditView } from 'modules/archive';
import { getCurrentProject, getProjects, getCurrentAccount } from 'modules/data';
import { getIsLoggedIn } from 'modules/account';
import { searchInArchive } from '../actions';
import ArchiveSearch from './ArchiveSearch';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        foundInterviews: state.search.archive.foundInterviews,
        resultPagesCount: state.search.archive.resultPagesCount,
        resultsCount: state.search.archive.resultsCount,
        query: state.search.archive.query,
        facets: state.search.archive.facets,
        translations: getTranslations(state),
        locale: getLocale(state),
        isArchiveSearching: state.search.isArchiveSearching,
        project: project,
        projectId: getProjectId(state),
        projects: getProjects(state),
        viewModes: project && project.view_modes,
        viewMode: getViewMode(state),
        listColumns: project && project.list_columns,
        editView: getEditView(state),
        account: getCurrentAccount(state),
        isLoggedIn: getIsLoggedIn(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    searchInArchive: (url, query) => dispatch(searchInArchive(url, query)),
    setViewMode: (viewMode) => dispatch(setViewMode(viewMode)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
    setFlyoutTabsIndex: index => dispatch(setFlyoutTabsIndex(index)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearch);
