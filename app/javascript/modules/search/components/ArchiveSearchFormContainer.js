import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getLocale, getTranslations, getProjectId, getEditView } from 'modules/archive';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import { resetQuery, setQueryParams, searchInArchive, searchInMap } from '../actions';
import ArchiveSearchForm from './ArchiveSearchForm';

const mapStateToProps = (state) => {
    return {
        allInterviewsTitles: state.search.archive.allInterviewsTitles,
        allInterviewsPseudonyms: state.search.archive.allInterviewsPseudonyms,
        facets: state.search.archive.facets,
        mapSearchFacets: state.search.map.facets,
        query: state.search.archive.query,
        translations: getTranslations(state),
        locale: getLocale(state),
        isArchiveSearching: state.search.isArchiveSearching,
        isMapSearching: state.search.isMapSearching,
        projectId: getProjectId(state),
        projects: state.data.projects,
        account: state.data.accounts.current,
        editView: getEditView(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    resetQuery: (scope) => dispatch(resetQuery(scope)),
    searchInArchive: (url, query) => dispatch(searchInArchive(url, query)),
    searchInMap: (url, query) => dispatch(searchInMap(url, query)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ArchiveSearchForm));
