import { connect } from 'react-redux';

import { openArchivePopup } from 'modules/ui';
import { hideFlyoutTabs, setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { setViewMode } from 'modules/archive';
import { getCurrentProject } from 'modules/data';
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
        translations: state.archive.translations,
        locale: state.archive.locale,
        isArchiveSearching: state.search.isArchiveSearching,
        project: project,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        viewModes: project && project.view_modes,
        viewMode: state.archive.viewMode,
        listColumns: project && project.list_columns,
        editView: state.archive.editView,
        account: state.data.accounts.current,
        isLoggedIn: state.account.isLoggedIn,
    }
}

const mapDispatchToProps = (dispatch) => ({
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
    searchInArchive: (url, query) => dispatch(searchInArchive(url, query)),
    setViewMode: (viewMode) => dispatch(setViewMode(viewMode)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
    setFlyoutTabsIndex: index => dispatch(setFlyoutTabsIndex(index)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearch);
